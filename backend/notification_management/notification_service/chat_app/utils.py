from .models import ChatMessage, ChatRoom
from asgiref.sync import sync_to_async
import json
from django.db.models import Q
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

 
@sync_to_async
def handle_receive_message(
    room_name, username, user_id, message, receiverId, recieverName
):
    room = ChatRoom.objects.get(name=room_name)

    if not room.user1 or not room.user1_name or not room.user2 or not room.user2_name :
        user_ids = [user_id, receiverId]
        print("IDS ", user_id, receiverId, user_ids)
        user_ids.sort()
        room.user1 = user_ids[0]
        room.user2 = user_ids[1]
        if user_ids[0] == user_id:
            room.user1_name = username
            room.user2_name = recieverName
        else:
            room.user1_name = recieverName
            room.user2_name = username
        room.save()
        print("user1 and user2 is created")
        
    user_ids = [user_id, receiverId]
    print("IDS ", user_id, receiverId, user_ids)
    user_ids.sort()
    if room.user1 == user_id:
        if username != room.user1_name or recieverName != room.user2_name:
            room.user1_name = username
            room.user2_name = recieverName
    else:
        if username != room.user2_name or recieverName != room.user1_name:
            room.user1_name = recieverName
            room.user2_name = username
    room.save()

    latest_message = ChatMessage.objects.create(
        room=room, username=username, user_id=user_id, content=message
    )
    print("SAVED")

    return room, latest_message


@sync_to_async
def get_chat_messages(room_name):
    messages = ChatMessage.objects.filter(room__name=room_name).order_by("timestamp")
    return [
        {
            "username": message.username,
            "message": message.content,
            "timestamp": message.timestamp.isoformat(),
            "user_id": message.user_id,
        }
        for message in messages
    ]


@database_sync_to_async
def get_chat_rooms(user_id):
    chat_rooms = ChatRoom.objects.filter(Q(user1=user_id) | Q(user2=user_id))
    for room in chat_rooms:
        print("get_chat_rooms", room.id)

    chat_room_with_messages = []
    if chat_rooms:
        for chat_room in chat_rooms:
            latest_message = (
                ChatMessage.objects.filter(room=chat_room)
                .order_by("-timestamp")
                .first()
            )

            chat_room_data = {
                "id": chat_room.id,
                "user1": chat_room.user1,
                "user2": chat_room.user2,
                "user1_name": chat_room.user1_name,
                "user2_name": chat_room.user2_name,
            }

            message_data = None
            timestamp = None
            if latest_message:
                timestamp = latest_message.timestamp.isoformat()
                message_data = {
                    "id": latest_message.id,
                    "content": latest_message.content,
                    "timestamp": timestamp,
                }

            chat_room_with_messages.append(
                {
                    "room": chat_room_data,
                    "message": message_data,
                    "lates_timestamp": timestamp,
                }
            )

        sorted_chat_rooms = sorted(
            chat_room_with_messages,
            key=lambda X: X["lates_timestamp"] or "",
            reverse=False,
        )
        response_data = [
            {"room": item["room"], "message": item["message"]}
            for item in sorted_chat_rooms
        ]
        print("response_data", response_data)
        return response_data

    return response_data


@sync_to_async
def handle_chat_list(room, latest_message, user_id, receiverId):
    chat_room_data = {
        "id": room.id,
        "user1": room.user1,
        "user2": room.user2,
        "user1_name": room.user1_name,
        "user2_name": room.user2_name,
    }

    message_data = {
        "id": latest_message.id,
        "content": latest_message.content,
        "timestamp": latest_message.timestamp.isoformat(),
    }

    response_data = {"room": chat_room_data, "message": message_data}
    print(response_data)

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"chat_room_list{user_id}",  # Unique group for the user
        {
            "type": "send_chat_list",
            "chat_list": response_data,
        },
    )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"chat_room_list{receiverId}",  # Unique group for the user
        {
            "type": "send_chat_list",
            "chat_list": response_data,
        },
    )
