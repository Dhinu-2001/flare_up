from django.db import models

# Create your models here.


class Registration(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    event_id = models.IntegerField(blank=True, null=True)
    ticket_number = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default="Pending")
    registered_at = models.DateTimeField(auto_now_add=True)
    ticket_quantity = models.IntegerField(blank=True, null=True)
    amount_received = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Registration {self.id}: User {self.user_id} for Event {self.event_id}"
