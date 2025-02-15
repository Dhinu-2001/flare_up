# Generated by Django 5.1.1 on 2024-11-26 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Registration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField(blank=True, null=True)),
                ('event_id', models.IntegerField(blank=True, null=True)),
                ('ticket_number', models.CharField(blank=True, max_length=255, null=True)),
                ('status', models.CharField(default='Pending', max_length=50)),
                ('registered_at', models.DateTimeField(auto_now_add=True)),
                ('ticket_quantity', models.IntegerField(blank=True, null=True)),
                ('amount_received', models.DecimalField(decimal_places=2, max_digits=10)),
                ('transaction_id', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
    ]
