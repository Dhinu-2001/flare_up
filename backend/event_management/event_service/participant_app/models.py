from django.db import models
from event_app.models import Event

# Create your models here.
class TicketRegistration(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    username = models.CharField(max_length=50, blank=True, null=True)
    event_id = models.ForeignKey(Event, related_name='ticket_registrations', on_delete=models.CASCADE)
    ticket_quantity = models.IntegerField(blank=True, null=True)
    ticket_secure_url = models.CharField(max_length=255, blank=True, null=True)
    ticket_public_id = models.CharField(max_length=255, blank=True, null=True)
    registered_at = models.DateTimeField(blank=True)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user_id} ({self.event_id}) - {self.transaction_id}"
    
class TicketDetails(models.Model):
    ticket_registration_id = models.ForeignKey(TicketRegistration, related_name="ticket_details", on_delete=models.CASCADE)
    ticket_number = models.CharField(max_length=255, blank=True, null=True)
    ticket_status = models.CharField(max_length=50, default="Active")
    
    def __str__(self):
        return f"{self.ticket_number} - {self.ticket_registration_id}"

