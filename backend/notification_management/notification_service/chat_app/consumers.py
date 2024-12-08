from datetime import datetime, timezone, timedelta
import json
from channels.generic.websocket import AsyncWebsocketConsumer
#from .models import ChatRoom, ChatMessage
from .utils import handle_receive_message, get_chat_messages, get_chat_rooms, handle_chat_list
from asgiref.sync import sync_to_async
from .models import ChatRoom
from notification_app.utils import send_user_notification

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        # self.room_group_name = f'chat_{self.room_name}'
        print('reached chat', self.room_name)
        if self.room_name == 'null':
            print('chat is INVLAID', self.room_name)
            
        
        # Validate or create room in the database
        room_object, created = await sync_to_async(ChatRoom.objects.get_or_create)(name=self.room_name)
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
        senderName = data['senderName']
        user_id = data['senderId']
        recieverName = data['recieverName']
        receiverId = data.get('receiverId')
        print('text data', message, senderName, user_id, receiverId, self.room_name)

        # Save the message to the database
        
        room, latest_message = await handle_receive_message(self.room_name, senderName, user_id, message, receiverId, recieverName)
        
        await handle_chat_list(room, latest_message, user_id, receiverId)
        
        notification_message = f"A message from {senderName}"
        type = 'New Message'
        print('notification_message',notification_message)
        await send_user_notification(receiverId, notification_message, type, senderId=user_id)
        
        current_time = datetime.now(timezone(timedelta(hours=5, minutes=30)))

        # Broadcast the message to the group
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': senderName,
                'user_id':user_id,
                "timestamp":current_time.isoformat(),
            }
        )

    async def chat_message(self, event):
        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username'],
            'user_id': event['user_id'],
            'timestamp': event['timestamp'],
        }))
        

class ChatListConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        # self.room_group_name = f'chat_{self.room_name}'
        print('reached chat list', self.user_id)
        self.chat_room_list = f'chat_room_list{self.user_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.chat_room_list,
            self.channel_name
        )
        await self.accept()
        
        chat_rooms = await get_chat_rooms(self.user_id) 
        
        for chat_room in chat_rooms:
            await self.send(text_data=json.dumps(chat_room))
        

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.chat_room_list, self.channel_name)
        
    async def send_chat_list(self, event):
        print('send chat list SENDER')
        await self.send(text_data=json.dumps(event['chat_list']))