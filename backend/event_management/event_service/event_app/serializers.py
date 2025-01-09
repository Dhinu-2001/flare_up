from rest_framework import serializers
from .models import Event, EventCategory, EventType, KeyParticipant, Sponsor

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'description', 'status']


class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ['id', 'name', 'description', 'category', 'status']

class KeyParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyParticipant
        fields = ['name', 'role', 'bio', 'photo', 'event']


# class SponsorSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Sponsor
#         fields = ['name', 'logo', 'website', 'event']


# event/serializers.py

from rest_framework import serializers
from .models import Event

class EventCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Event
        fields = [
            'title', 'description', 'category', 'type', 'host_id', 'organization_id', 
            'latitude', 'longitude', 'address_line_1', 'city', 'state', 'country', 
            'payment_required', 'ticket_price', 'participant_capacity', 'banner_image', 
            'promo_video', 'start_date_time', 'end_date_time', 'registration_deadline', 
            'status', 'approval_status', 'approval_comments'
        ]
        
class EventRetrieveSerializer(serializers.ModelSerializer):
    key_participants = KeyParticipantSerializer(many=True, read_only=True)
    # Define datetime fields with a readable format
    start_date_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    end_date_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    registration_deadline = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    approval_updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", allow_null=True)

    category = serializers.StringRelatedField()  # Assuming you want a human-readable representation for category
    type = serializers.StringRelatedField()
    
    # Adjusting max_digits for full precision
    latitude = serializers.DecimalField(max_digits=15, decimal_places=6, required=False, allow_null=True)
    longitude = serializers.DecimalField(max_digits=15, decimal_places=6, required=False, allow_null=True)
    
    
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'type', 'host_id', 'organization_id', 
            'latitude', 'longitude', 'address_line_1', 'city', 'state', 'country', 
            'payment_required', 'ticket_price', 'participant_capacity', 'banner_image', 
            'promo_video', 'start_date_time', 'end_date_time', 'registration_deadline', 
            'created_at', 'updated_at', 'status', 'status_request', 'approval_status', 'approval_comments', 
            'approval_updated_at', 'key_participants', 'current_participants_count',
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'approval_updated_at'
        ]
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Convert latitude and longitude to integers if they exist and are valid
        if representation.get('latitude') is not None:
            representation['latitude'] = float(representation['latitude'])
        if representation.get('longitude') is not None:
            representation['longitude'] = float(representation['longitude'])

        return representation

class KeyParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = KeyParticipant
        fields = ['event', 'name', 'role', 'bio', 'photo']

# event/serializers.py

class SponsorSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False)

    class Meta:
        model = Sponsor
        fields = ['event', 'name', 'logo', 'website']
