from django.shortcuts import render
from django.http import JsonResponse
from .models import ChatMessage

def get_chat_messages(request, room_name):
    messages = ChatMessage.objects.filter(room__name=room_name).order_by('timestamp')
    return JsonResponse({
        'messages': [
            {'username': msg.user.username, 'content': msg.content, 'timestamp': msg.timestamp}
            for msg in messages
        ]
    })