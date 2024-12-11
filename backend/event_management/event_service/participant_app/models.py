from django.db import models
from event_app.models import Event

# Create your models here.
class Participant(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    event_id = models.ForeignKey(Event, related_name='participants', on_delete=models.CASCADE)
    ticket_number = models.CharField(max_length=255, blank=True, null=True)
    ticket_status = models.CharField(max_length=50, default="Active")
    registered_at = models.DateTimeField(blank=True)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.event} ({self.ticket_number}) - {self.event.title}"

