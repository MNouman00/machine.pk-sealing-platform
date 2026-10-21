from django.urls import path
from .views import chat_stream

urlpatterns = [
    path("stream", chat_stream, name="chat-stream"),
]