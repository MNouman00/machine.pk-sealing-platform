from django.conf import settings
from langchain_core.messages import SystemMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from typing import Annotated, TypedDict, Optional
from .tools import ALL_TOOLS

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user: Optional[object]

SYSTEM_PROMPT = """You are AECO Assistant.
You help customers find sealing machines and place orders.
Use `search_products` to find items. Use `get_product_details` to show specs.
Use `create_order` ONLY after confirming the customer's name, email, and items.

IMPORTANT: If a logged-in user is present, you MUST pass their user_id when calling create_order."""

def build_graph():
    llm = ChatGroq(
        model="openai/gpt-oss-120b",
        api_key=settings.GROQ_API_KEY,
        temperature=0.3,
        streaming=True,
        max_tokens=800  # <-- Add this
    ).bind_tools(ALL_TOOLS)
    tool_node = ToolNode(ALL_TOOLS)

    def call_model(state: AgentState):
        user = state.get("user")
        system_prompt = SYSTEM_PROMPT
        if user:
            system_prompt += f"\n\nCurrent logged-in user: {user.username} (user_id={user.id}). Pass this user_id to create_order."
        
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