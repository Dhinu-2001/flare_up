from django.core.management.base import BaseCommand
from kafka_app.kafka_utils.consumer import KafkaConsumerService
import asyncio
import environ
env = environ.Env()
environ.Env.read_env()

class Command(BaseCommand):
    help = 'Start Kafka Consumer for the Content Service'

    def handle(self, *args, **options):
        config = {
            'bootstrap.servers': env('KAFKA_SVC'),
            'group.id':'event-consumer-group',
            'auto.offset.reset':'earliest'
        }
        consumer = KafkaConsumerService(config)
        asyncio.run(consumer.consume_message())