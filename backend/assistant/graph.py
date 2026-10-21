from django.conf import settings
from langchain_core.messages import SystemMessage
from langchain_groq import ChatGroq  # <-- Changed import
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from typing import Annotated, TypedDict, Optional
from .tools import search_products, get_product_details, create_order, ALL_TOOLS

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user: Optional[object]

SYSTEM_PROMPT = """You are MACHINES.PK Assistant.
You help customers find sealing machines and place orders.

IMPORTANT INSTRUCTIONS:
1. If the user says hello, asks how you are, or makes small talk, reply directly. DO NOT use any tools.
2. ONLY use `search_products` if they ask about machines, prices, or stock.
3. ONLY use `create_order` after confirming the customer's name, email, and items.
4. Be brief and helpful."""

def build_graph():
    # Use Groq's ultra-fast Llama 3.3 70B model
    llm = ChatGroq(
         model="openai/gpt-oss-120b", # <-- Fast & powerful
        api_key=settings.GROQ_API_KEY,
        temperature=0.3,
        streaming=True
    ).bind_tools(ALL_TOOLS)
    
    tool_node = ToolNode(ALL_TOOLS)

    def call_model(state: AgentState):
        user = state.get("user")
        system_prompt = SYSTEM_PROMPT
        if user:
            system_prompt += f"\n\nCurrent logged-in user: {user.username} (ID: {user.id})."

        msgs = [SystemMessage(content=system_prompt)] + state["messages"]
        response = llm.invoke(msgs)
        return {"messages": [response]}

    def should_continue(state: AgentState):
        last = state["messages"][-1]
        if hasattr(last, "tool_calls") and last.tool_calls:
            return "tools"
        return END

    g = StateGraph(AgentState)
    g.add_node("agent", call_model)
    g.add_node("tools", tool_node)
    g.set_entry_point("agent")
    g.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    g.add_edge("tools", "agent")
    return g.compile()

_graph = None
def get_graph():
    global _graph
    if _graph is None:
        _graph = build_graph()
    return _graph