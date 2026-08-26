from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv()

TAVILY_API_KEY =os.getenv("TAVILY_API_KEY")

client=TavilyClient(
    api_key=TAVILY_API_KEY
)

def tavily_search(query:str):
    """Search the web for information"""
    try:
        response=client.search(
            query=query,
            max_results=5
        )
        results =[]

    
        for i , r in enumerate(response["results"],1):
            title=r.get("title","Unknown")
            url =r.get("url","")
            snippet=r.get("content","")

            if len(snippet)>300:
                snippet=snippet[:300] + "..."

            results.append(
                f"[{i}.{title}]({url})\n{snippet}"
            ) 
    
        return "\n\n".join(results)

    except Exception as e:
        return f"Error searching the web: {str(e)}"

    


