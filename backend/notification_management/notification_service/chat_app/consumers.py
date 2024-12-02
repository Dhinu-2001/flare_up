import json
from channels.generic.websocket import AsyncWebsocketConsumer
#from .models import ChatRoom, ChatMessage
from .utils import handle_receive_message, get_chat_messages
from asgiref.sync import sync_to_async
from .models import ChatRoom
from notification_app.utils import send_user_notification

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        # self.room_group_name = f'chat_{self.room_name}'
        print('reached chat', self.room_name)
        
        # Validate or create room in the database
        room, created = await sync_to_async(ChatRoom.objects.get_or_create)(name=self.room_name)
        if created:
            print(f"Room '{self.room_name}' created.")
        else:
            print(f"Room '{self.room_name}' already exists.")

        # Join room group
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()
        
        #Fetching all historical chat from database
        chats = await get_chat_messages(self.room_name)
        for chat in chats:
           await self.send(text_data=json.dumps(chat))

    async def disconnect(self, close_code):
        print(f"Disconnecting from room: {self.room_name}")
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = data['username']
        user_id = data['senderId']
        receiverId = data.get('receiverId')
        print('text data', message, username, user_id, receiverId, self.room_name)

        # Save the message to the database
        
        await handle_receive_message(self.room_name, username, user_id, message)
        
        notification_message = f"A message from {username}"
        type = 'New Message'
        await send_user_notification(receiverId, notification_message, type, senderId=user_id)

        # Broadcast the message to the group
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'user_id':user_id,
            }
        )

    async def chat_message(self, event):
        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username'],
            'user_id': event['user_id'],
        }))