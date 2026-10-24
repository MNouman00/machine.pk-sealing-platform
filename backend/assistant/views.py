import json
from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from langchain_core.messages import HumanMessage, AIMessage
from rest_framework.authtoken.models import Token
from .graph import get_graph

def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"

@csrf_exempt
@require_POST
def chat_stream(request):
    try:
        body = json.loads(request.body)
        user_text = body.get("message", "").strip()
        history = body.get("history", [])
    except json.JSONDecodeError:
        return StreamingHttpResponse(iter([_sse("error", {"error": "Invalid JSON"})]), content_type="text/event-stream")

    # Read user from token
    user = None
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Token '):
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
        except Token.DoesNotExist:
            pass

    messages = []
    for turn in history:
        if turn.get("role") == "user":
            messages.append(HumanMessage(content=turn["content"]))
        elif turn.get("role") == "assistant":
            messages.append(AIMessage(content=turn["content"]))
    messages.append(HumanMessage(content=user_text))

    def event_stream():
        try:
            graph = get_graph()
            for event in graph.stream({"messages": messages, "user": user}, stream_mode="values"):
                msgs = event.get("messages", [])
                if not msgs: continue
                last = msgs[-1]
                
                if isinstance(last, AIMessage) and last.content:
                    text_content = ""
                    if isinstance(last.content, str):
                        text_content = last.content
                    elif isinstance(last.content, list):
                        for block in last.content:
                            if isinstance(block, dict) and block.get("type") == "text":
                                text_content += block.get("text", "")
                    
                    if text_content:
                        yield _sse("token", {"text": text_content})

                if isinstance(last, AIMessage) and last.tool_calls:
                    yield _sse("tool", {"tools": [t["name"] for t in last.tool_calls]})
                    
            yield _sse("done", {})
        except Exception as e:
            yield _sse("token", {"text": f"\n\n**Error:** {str(e)}"})
            yield _sse("done", {})

    resp = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    resp["Cache-Control"] = "no-cache"
    return resp