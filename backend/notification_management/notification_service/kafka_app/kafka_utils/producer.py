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

    def send_user_details_request(self, user_id):
        try:
            self.producer.produce(
                'get_user_details',
                key=str(user_id),
                value=json.dumps(str(user_id)),
                on_delivery=self.delivery_report
            )
            print('success send_user_details_request',user_id)
            self.producer.flush()
        except Exception as e:
            print(f"get_user_details - Failed to send message: {e}")