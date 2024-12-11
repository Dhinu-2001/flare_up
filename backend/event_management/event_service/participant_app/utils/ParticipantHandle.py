from channels.db import database_sync_to_async
from event_app.models import Event
from participant_app.models import Participant



class ParticipantHandle:
    @database_sync_to_async
    def HandleEventParticipant(self, payment_data):
        event_id = payment_data.get("event_id")
        user_id = payment_data.get("user_id")
        registered_at = payment_data.get("registered_at")
        transaction_id = payment_data.get("transaction_id")
        ticket_quantity = payment_data.get("ticket_quantity")
        

        event_obj = Event.objects.get(id=event_id)
        
        # CREATE TICKET NUMBER RANGE
        current_participants_count = event_obj.current_participants_count
        ticket_range = current_participants_count + ticket_quantity 
        
        # CREATING EVENT TICKET NAME
        title = event_obj.title
        split = title.split(" ")
        first_char = [word[0].upper() for word in split]
        event_ticket_name = ''.join(first_char)
        
        for number in range(current_participants_count, ticket_range):
            ticket_number = f"{event_ticket_name}_{event_id}_00{number}"
            print(ticket_number)
            
            Participant.objects.create(user_id=user_id, event_id=event_obj, ticket_number=ticket_number, registered_at=registered_at, transaction_id=transaction_id)
            event_obj.current_participants_count += 1
            event_obj.save()