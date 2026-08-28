import os
import certifi 
from dotenv import load_dotenv

from typing import Annotated,Literal,TypedDict
import operator 
import uuid

import psycopg
from psycopg.rows import dict_row 


from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langchain_core.runnables import RunnablePassthrough,RunnableLambda
from langgraph.graph import StateGraph,END,START
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.prebuilt import ToolNode,tools_condition
from langchain_core.messages import (
    AnyMessage,
    HumanMessage,
    SystemMessage,
    AIMessage,
    ToolMessage,
)

from tools.tavily_tool import tavily_search
from tools.flight_tool import search_flights

load_dotenv()

os.environ["SSL_CERT_FILE"]=certifi.where()
os.environ["REQUESTS_CA_BUNDLE"]=certifi.where()

GROQ_API_KEY=os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment variables")

GROQ_MODEL = "openai/gpt-oss-20b"

def get_db_url():
    db_url=os.getenv("DATABASE_URL")
    
    if not db_url:
        raise ValueError("DATABASE_URL not found in environment variables")
    
    if "sslmode=" not in db_url:
        separator="&" if "?" in db_url else ""
        db_url = f"{db_url}{separator}sslmode=require"
    
    return db_url


llm = ChatGroq(
    model=GROQ_MODEL,
    api_key=GROQ_API_KEY,
   
)

class TravelState(TypedDict):
    messages:Annotated[list[AnyMessage],operator.add]
    user_query:str
    flight_results:str
    hotel_results:str
    itinerary:str
    llm_calls:int

def flight_agent(state:TravelState):
    query=state["user_query"]
    flight_data=search_flights(query)

    return {
        "flight_results":flight_data,
        "messages":[AIMessage(content=f"Flight results: {flight_data}")],
        "llm_calls":state.get("llm_calls",0)+1
    }

def hotel_agent(state:TravelState):
    query=f"Find hotels for this trip: {state['user_query']}"
    hotel_data=tavily_search(query)

    return {
        "hotel_results":hotel_data,
        "messages":[AIMessage(content=f"Hotel results: {hotel_data}")],
        "llm_calls":state.get("llm_calls",0)+1
    }


def itinerary_agent(state:TravelState):
    prompt=f"""
    You are an expert travel agent.
    Create a detailed daily itinerary for the following trip:
    User query :
    {state['user_query']}

    Flight results:
    {state['flight_results']}

    Hotel results:
    {state['hotel_results']}
    
    Include:
    - Daily schedule
    - Activities
    - Food recommendations
    - Sightseeing
    - Travel tips
    
    Make it engaging and helpful.
    """
    response =llm.invoke([
        SystemMessage(content="You are an expert travel agent. Create a detailed daily itinerary for the following trip:"),
        HumanMessage(content=prompt)
    ])

    return {
        "itinerary":response.content,
        "messages":[AIMessage(content=f"Itinerary: {response.content}")],
        "llm_calls":state.get("llm_calls",0)+1
    }


def final_agent(state:TravelState):
    final_prompt = f"""
    You are an expert travel agent.
    Create a detailed daily itinerary for the following trip:
    User query :
    {state['user_query']}

    Flight results:
    {state['flight_results']}

    Hotel results:
    {state['hotel_results']}

    Itinerary:
    {state['itinerary']}
    
    Include:
    - Daily schedule
    - Activities
    - Food recommendations
    - Sightseeing
    - Travel tips
    
    Make it engaging and helpful.

    IMPORTANT: 
    - Be clear and concise
    - Use simple language
    - Provide all the information the user needs
    - Make it easy to read and understand
    """
    response =llm.invoke([
        SystemMessage(content="You are an expert travel agent. Create a detailed daily itinerary for the following trip:"),
        HumanMessage(content=final_prompt)
    ])

    return {
        "itinerary": str(response.content),
        "messages": [response],
        "llm_calls": state.get("llm_calls",0)+1
    }


graph = StateGraph(TravelState)

graph.add_node("flight_agent",flight_agent)
graph.add_node("hotel_agent",hotel_agent)
graph.add_node("itinerary_agent",itinerary_agent)
graph.add_node("final_agent",final_agent)

graph.add_edge(START,"flight_agent")
graph.add_edge("flight_agent","hotel_agent")
graph.add_edge("hotel_agent","itinerary_agent")
graph.add_edge("itinerary_agent","final_agent")
graph.add_edge("final_agent",END)


DB_URL = get_db_url()

_conn= psycopg.connect(DB_URL,
    autocommit=True,
    row_factory=dict_row
)

checkpointer= PostgresSaver(_conn)
checkpointer.setup()

travel_graph=graph.compile(
    checkpointer=checkpointer
)

# FUnction for fastapi

def run_travel_agent(user_input: str, thread_id: str | None = None):
    if not thread_id:
        thread_id = f"user_{uuid.uuid4().hex}"

    config = {
        "configurable": {
            "thread_id": thread_id
        }
    }

    result = travel_graph.invoke(
        {
            "messages": [
                HumanMessage(content=user_input)
            ],
            "user_query": user_input,
            "flight_results": "",
            "hotel_results": "",
            "itinerary": "",
            "llm_calls": 0
        },
        config=config
    )

    final_answer = result["messages"][-1].content

    return {
        "thread_id": thread_id,
        "answer": final_answer,
        "flight_results": result.get("flight_results", ""),
        "hotel_results": result.get("hotel_results", ""),
        "itinerary": result.get("itinerary", ""),
        "llm_calls": result.get("llm_calls", 0),
    }