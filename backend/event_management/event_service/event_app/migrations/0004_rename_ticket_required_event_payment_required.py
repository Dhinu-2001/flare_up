# Generated by Django 5.1.1 on 2024-10-30 08:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('event_app', '0003_alter_event_host_id_alter_event_location_id_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='ticket_required',
            new_name='payment_required',
        ),
    ]
