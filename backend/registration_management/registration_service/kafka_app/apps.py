from django.apps import AppConfig
from kafka_app.kafka_utils.admin_service import KafkaAdminService


class KafkaAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'kafka_app'
    
    def ready(self):
        kafka_admin = KafkaAdminService()
        kafka_admin.initialize_topics()
