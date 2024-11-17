# Generated by Django 5.1.1 on 2024-10-30 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event_app', '0005_rename_end_time_event_end_date_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='banner_image',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='promo_video',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='keyparticipant',
            name='photo',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='sponsor',
            name='logo',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
