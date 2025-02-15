from django.core.management.base import BaseCommand
from kafka_app.kafka_utils.consumer import KafkaConsumerService
import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

class Command(BaseCommand):
    help = 'Start Kafka Consumer for the Content Service'

    def handle(self, *args, **options):
        config = {
            'bootstrap.servers': os.getenv('KAFKA_SVC'),
            'group.id':'payment-consumer-group',
            'auto.offset.reset':'earliest'
        }
        consumer = KafkaConsumerService(config)
        asyncio.run(consumer.consume_message())