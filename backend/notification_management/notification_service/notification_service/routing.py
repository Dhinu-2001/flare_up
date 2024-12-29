from notification_app.consumers import NotificationConsumer
from chat_app.consumers import ChatConsumer, ChatListConsumer
from django.urls import re_path

websocket_urlpatterns = [
    re_path(r'ws/notifications/(?P<user_id>\w+)/$', NotificationConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<room_name>[\w-]+)/$', ChatConsumer.as_asgi()),
    re_path(r'ws/chat-list/(?P<user_id>\w+)/$', ChatListConsumer.as_asgi()),
]