from channels.db import database_sync_to_async
from event_app.models import Event
from participant_app.models import TicketRegistration
from .TicketHandle import generate_tickets_zip

class ParticipantHandle:
   
    async def HandleEventParticipant(self, payment_data):
        event_id = payment_data.get("event_id")
        user_id = payment_data.get("user_id")
        username = payment_data.get("username")
        registered_at = payment_data.get("registered_at")
        transaction_id = payment_data.get("transaction_id")
        ticket_quantity = payment_data.get("ticket_quantity")
      
        event_obj = await database_sync_to_async(Event.objects.get)(id=event_id)
        
        
        
        # CREATING EVENT TICKET NAME
        title = event_obj.title
        split = title.split(" ")
        first_char = [word[0].upper() for word in split]
        event_ticket_name = ''.join(first_char)
        print('CREATING TICET RESGI OBJ')
        ticket_registration_obj = await database_sync_to_async(TicketRegistration.objects.create)(user_id=user_id, username=username, event_id=event_obj, ticket_quantity=ticket_quantity, registered_at=registered_at, transaction_id=transaction_id)
        
        print('CALLING ZIP DEF')
        response = await generate_tickets_zip(event_obj, user_id, event_ticket_name, ticket_quantity, ticket_registration_obj)
        ticket_registration_obj.ticket_secure_url = response.get('secure_url')
        ticket_registration_obj.ticket_public_id = response.get('public_id')
        
        print('SAVING COUNT')
        await database_sync_to_async(ticket_registration_obj.save)()
        
        # for number in range(current_participants_count, ticket_range):
        #     ticket_number = f"{event_ticket_name}_{event_id}_00{number}"
        #     print(ticket_number)
        #     await generate_ticket_pdf(event_obj, ticket_number, user_id)
        #     await database_sync_to_async(Participant.objects.create)(user_id=user_id, event_id=event_obj, ticket_number=ticket_number, registered_at=registered_at, transaction_id=transaction_id)
        #     event_obj.current_participants_count += 1
        #     await database_sync_to_async(event_obj.save)()