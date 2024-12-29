from confluent_kafka import Producer
from django.conf import settings
import json
from datetime import datetime, timezone

# FOLLOW_REQUESTED = "follow_requested"
# FOLLOW_CANCELLED = "follow_cancelled"
# FOLLOW_ACCEPTED = "follow_accepted"
# UNFOLLOW = "unfollow"
# BLOCKED = "blocked"


class KafkaProducerService:
    def __init__(self, config):
        self.producer = Producer(settings.KAFKA_CONFIG)

    def delivery_report(self, err, msg):
        if err is not None:
            print(f"Delivery failed for record {msg.key()}: {err}")
        else:
            print(f"Record {msg.key()} successfully produced to {msg.topic()} [{msg.partition()}] at offset {msg.offset()}")

    def send_payment_notification_message(self, payment_data):
        try:
            self.producer.produce(
                'payment_notification',
                key=str(payment_data['id']),
                value=json.dumps(payment_data),
                on_delivery=self.delivery_report
            )
            print('success payment_notification',payment_data)
            self.producer.flush()
        except Exception as e:
            print(f"payment_notification - Failed to send message: {e}")