from confluent_kafka import Consumer, KafkaException
import json
from django.conf import settings
from django.utils import timezone
from notification_app.utils import send_user_notification
from asgiref.sync import sync_to_async

class KafkaConsumerService:
    def __init__(self, config):

        self.consumer = Consumer(config)
        self.consumer.subscribe(["payment_notification"])
        
    # @sync_to_async
    def handle_payment_notification_message(self, payment_data):
        try:
            print('payment_data Consumer',payment_data)
            user_id = payment_data["user_id"]
            message = f"Payment of {payment_data['amount_received']} {payment_data['currency']} for Event:{payment_data["event_title"]} was successful."
            type = 'Notification'
            send_user_notification(user_id, message, type)
            
        except Exception as e:
            print(f"Error processing message : {e}")

    
    def handle_message(self, message):
        try:
            payment_data = json.loads(message.value().decode("utf-8"))

            if message.topic() == "payment_notification":
                self.handle_payment_notification_message(payment_data)
        except Exception as e:
            print(f"Error processing message: {e}")

    def consume_message(self):
        try:
            while True:
                msg = self.consumer.poll(timeout=1.0)
                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() == KafkaException._PARTITION_EOF:
                        continue
                    else:
                        print(f"consumer error: {msg.error()}")
                        continue
                self.handle_message(msg)

        except KeyboardInterrupt:
            print("Consumer Stopped.")
        finally:
            self.consumer.close()
