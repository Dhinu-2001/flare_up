from django.db import models

class EventCategory(models.Model):
    name = models.CharField(max_length=100,unique=True)
    description = models.TextField(blank=True, null=True)
    category_image = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class EventType(models.Model):
    name = models.CharField(max_length=100,unique=True)
    description = models.TextField(blank=True, null=True)
    type_image = models.CharField(max_length=255, blank=True, null=True)
    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE, related_name="event_types", blank=True, null=True)
    status = models.CharField(max_length=50, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    # Event details
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(EventCategory, on_delete=models.SET_NULL, null=True)
    type = models.ForeignKey(EventType, on_delete=models.SET_NULL, null=True)

    # Organizer and host and location
    host_id = models.CharField(max_length=255, blank=True, null=True)  # This will be the ID of the user from the User Service
    organization_id = models.CharField(max_length=255, blank=True, null=True)  # Organization ID from Organization Service
    
    # Location
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    address_line_1 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    # Ticket and pricing
    payment_required  = models.BooleanField(default=False)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    participant_capacity = models.IntegerField(blank=True, null=True)
    current_participants_count = models.IntegerField(default=0)

    # Media
    banner_image = models.CharField(max_length=255, blank=True, null=True)
    promo_video = models.CharField(max_length=255, blank=True, null=True)

    # Date and time
    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()
    registration_deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Status
    status = models.CharField(max_length=50, choices=[('Active', 'Active'), ('Cancelled', 'Cancelled'), ('Cancelled by Admin', 'Cancelled by Admin'), ('Draft', 'Draft')], default='Draft')
    status_request  = models.BooleanField(default=False)
    
    # Admin approval
    approval_status = models.CharField(max_length=50, choices=[('Approved', 'Approved'), ('Rejected', 'Rejected'), ('Waiting for approval', 'Waiting for approval')], default='Waiting for approval')
    approval_comments = models.TextField(null=True, blank=True)
    approval_updated_at = models.DateTimeField( blank=True, null=True)

    def __str__(self):
        return self.title
    

class KeyParticipant(models.Model):
    event = models.ForeignKey(Event, related_name='key_participants', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    photo = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.role}) - {self.event.title}"


class Sponsor(models.Model):
    event = models.ForeignKey(Event, related_name='sponsors', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    logo = models.CharField(max_length=255, blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} - Sponsor for {self.event.title}"
