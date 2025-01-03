# Generated by Django 5.1.1 on 2024-12-09 11:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('event_app', '0013_event_current_participants_count_alter_event_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='KeyParticipant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField(blank=True, null=True)),
                ('ticket_number', models.CharField(blank=True, max_length=255, null=True)),
                ('status', models.CharField(default='Pending', max_length=50)),
                ('registered_at', models.DateTimeField(blank=True)),
                ('transaction_id', models.CharField(blank=True, max_length=255, null=True)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participants', to='event_app.event')),
            ],
        ),
    ]
