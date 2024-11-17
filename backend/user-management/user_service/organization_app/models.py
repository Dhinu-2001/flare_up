from django.db import models

class Organization(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    contact_email = models.EmailField(max_length=100, unique=True)
    website = models.URLField(max_length=200)
    logo = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name
