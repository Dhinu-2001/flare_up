from .models import ChatMessage, ChatRoom
from asgiref.sync import sync_to_async
import json


@sync_to_async
def handle_receive_message(room_name, username, user_id, message):
    room = ChatRoom.objects.get(name=room_name)
    ChatMessage.objects.create(
        room=room, username=username, user_id=user_id, content=message
    )
    print("SAVED")


@sync_to_async
def get_chat_messages(room_name):
    messages = ChatMessage.objects.filter(room__name=room_name).order_by("timestamp")
    return [
        {
            "username": message.username,
            "message": message.content,
            "timestamp": message.timestamp.isoformat(),
            "user_id":message.user_id
        }
        for message in messages
    ]
