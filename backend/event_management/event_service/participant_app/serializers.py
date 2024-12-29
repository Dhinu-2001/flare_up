from rest_framework import serializers
from .models import TicketDetails, TicketRegistration

class TicketDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketDetails
        fields = ['id', 'ticket_number', 'ticket_status', 'ticket_registration_id']
        depth = 1

class TicketRegistrationSerializer(serializers.ModelSerializer):
    ticket_details = TicketDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = TicketRegistration
        fields = [
            'id',
            'user_id',
            'username',
            'event_id',
            'ticket_quantity',
            'ticket_secure_url',
            'ticket_public_id',
            'registered_at',
            'transaction_id',
            'ticket_details',
        ]
        depth = 1