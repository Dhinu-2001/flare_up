# Generated by Django 5.1.1 on 2024-10-25 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event_app', '0002_alter_event_promo_video'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='host_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='location_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='organization_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]