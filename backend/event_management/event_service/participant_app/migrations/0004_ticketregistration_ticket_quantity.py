# Generated by Django 5.1.1 on 2024-12-13 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('participant_app', '0003_ticketregistration_ticketdetails_delete_participant'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticketregistration',
            name='ticket_quantity',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]