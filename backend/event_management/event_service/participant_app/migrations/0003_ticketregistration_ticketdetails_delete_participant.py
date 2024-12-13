# Generated by Django 5.1.1 on 2024-12-13 06:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event_app', '0013_event_current_participants_count_alter_event_status'),
        ('participant_app', '0002_participant_delete_keyparticipant'),
    ]

    operations = [
        migrations.CreateModel(
            name='TicketRegistration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField(blank=True, null=True)),
                ('ticket_file', models.CharField(blank=True, max_length=255, null=True)),
                ('registered_at', models.DateTimeField(blank=True)),
                ('transaction_id', models.CharField(blank=True, max_length=255, null=True)),
                ('event_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ticket_registrations', to='event_app.event')),
            ],
        ),
        migrations.CreateModel(
            name='TicketDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticket_number', models.CharField(blank=True, max_length=255, null=True)),
                ('ticket_status', models.CharField(default='Active', max_length=50)),
                ('ticket_registration_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ticket_details', to='participant_app.ticketregistration')),
            ],
        ),
        migrations.DeleteModel(
            name='Participant',
        ),
    ]