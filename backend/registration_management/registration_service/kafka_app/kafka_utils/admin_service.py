from confluent_kafka.admin import AdminClient, NewTopic
from django.conf import settings

class KafkaAdminService:
    def __init__(self):
        self.admin_client = AdminClient(settings.KAFKA_CONFIG)
        
    def create_topic(self, topic_name, num_partitions=3, replication_factor=1):
        """Create a Kafka topic if it doesn't already exist."""
        topic_metadata = self.admin_client.list_topics(timeout=5)
        
        if topic_name in topic_metadata.topics:
            print(f"Topic '{topic_name}' already exists")
        else:
            new_topic = NewTopic(topic_name, num_partitions=num_partitions, replication_factor=replication_factor)
            result = self.admin_client.create_topics([new_topic])

            # Check and print results for each topic
            for topic, future in result.items():
                try:
                    future.result()  # Wait for the result
                    print(f"Topic '{topic_name}' created successfully")
                except Exception as e:
                    print(f"Failed to create topic '{topic_name}': {e}")

    def initialize_topics(self):
        """Initialize required topics for the application."""
        topics = ["payment_notification"]
        for topic in topics:
            self.create_topic(topic)