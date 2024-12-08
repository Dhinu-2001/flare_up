
import redis
import json
from datetime import datetime
from asgiref.sync import async_to_sync
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer

# Initialize Redis client
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

def store_notification_in_redis(user_id, message, type, senderId):
    # Key format: notifications:<user_id>
    key = f'notifications:{user_id}'
    if senderId:
        notification = {
        'senderId':senderId,
        'notification_type': type,
        'message': message,
        'timestamp': str(datetime.now())
        }
    else:    
        # Add the notification as a JSON string
        notification = {
            'notification_type': type,
            'message': message,
            'timestamp': str(datetime.now())
        }
    
  
    print('STORING NOTI IN REDIS ', notification)
    redis_client.rpush(key, json.dumps(notification))

    # Set TTL for the key (14 days in seconds)
    redis_client.expire(key, 14 * 24 * 60 * 60)
    
    # res = get_notifications_from_redis(user_id)
    

def get_notifications_from_redis(user_id):
    # Key format: notifications:<user_id>
    key = f'notifications:{user_id}'
    notifications = redis_client.lrange(key, 0, -1)
    if len(notifications) > 19:
        notifications = notifications[:-21:-1]
    return [json.loads(notification) for notification in notifications[::-1]]

@sync_to_async
def send_user_notification(user_id, message, type, senderId=None):
    # Store the notification in Redis
    print('mesage', message)
    store_notification_in_redis(user_id, message, type, senderId)

    # Send real-time notification via WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notification_user_{user_id}',  # Unique group for the user
        {
            'type': 'send_notification',
            'message': message,
            'notification_type': type,
            'timestamp': str(datetime.now()),
            'senderId': senderId,
        }
    )
  