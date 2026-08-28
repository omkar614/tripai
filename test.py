from tools.tavily_tool import tavily_search
from backend import run_travel_agent
from tools.flight_tool import search_flights
#print(tavily_search("Best hotels in Mumbai"))
#print(search_flights("Plan a 7 days trip to Japan from Mumbai"))

user_input = input("Enter travel request")

response = run_travel_agent(
    user_input,
    thread_id="test_user"
)

print(response["answer"])