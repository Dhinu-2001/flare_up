from rest_framework import serializers
from .models import Participant

class ParticipantCreateSerializer(serializers.ModelSerializer):
    class Meta:
        modal = Participant
        fields = ['user_id', 'event_id', 'ticket_number' , 'registered_at', 'transaction_id']