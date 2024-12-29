# from django.shortcuts import render
# from rest_framework.views import APIView
from django.http import JsonResponse
from event_app.models import Event, EventCategory
from participant_app.models import TicketRegistration

# # Create your views here.
# class MainGraph(APIView):
#     def get(self, request, host_id):
#         event_objs = Event.objects.filter(host_id=host_id)

from django.db.models import Count, Sum, Q
from django.db.models.functions import TruncDate
from datetime import datetime, timedelta
import json


def total_events_participants(host_id):
    total_events = Event.objects.filter(host_id=host_id).count()
    
    total_participants= (
        TicketRegistration.objects.filter(
            event_id__host_id=host_id
        )
        .aggregate(participants=Sum("ticket_quantity"))
    )['participants'] or 0
    
    print('TOTAL', total_events, total_participants)
    
    return {'total events':total_events, 'total participants': total_participants}

def get_event_participant_stats(request, host_id):
    # Calculate date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=90)  # last 3 months

    # Query for events created per day
    events_per_day = (
        Event.objects.filter(host_id=host_id, created_at__range=(start_date, end_date))
        .annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(events=Count("id"))
        .order_by("date")
    )

    # Query for participants per day based on ticket registrations
    participants_per_day = (
        TicketRegistration.objects.filter(
            event_id__host_id=host_id, registered_at__range=(start_date, end_date)
        )
        .annotate(date=TruncDate("registered_at"))
        .values("date")
        .annotate(participants=Sum("ticket_quantity"))
        .order_by("date")
    )

    # Create a dictionary with all dates in the range
    date_range = [(start_date + timedelta(days=x)).date() for x in range(91)]
    chart_data = {
        date: {"date": date.strftime("%Y-%m-%d"), "events": 0, "participants": 0}
        for date in date_range
    }

    # Fill in event counts
    for entry in events_per_day:
        date = entry["date"]
        if date in chart_data:
            chart_data[date]["events"] = entry["events"]

    # Fill in participant counts
    for entry in participants_per_day:
        date = entry["date"]
        if date in chart_data:
            chart_data[date]["participants"] = entry["participants"] or 0

    # Convert to list and format for chart
    result = list(chart_data.values())
    
    response_data = total_events_participants(host_id)
    response_data["event_participant_stats"] = result

    return JsonResponse(response_data)


def EventCountOnCategory(request, host_id):
    categories = EventCategory.objects.annotate(
        events=Count("event", filter=Q(event__host_id=host_id))
    )

    # Transform the result into the desired format
    output = [
        {
            "category": category.name,
            "events": category.events,
            # "fill": category_colors.get(item['category__name'], "var(--color-default)")
        }
        for category in categories
    ]

    return JsonResponse({"result": output})


def ParticipantCountOnCategory(request, host_id):
    categories = EventCategory.objects.annotate(
        total_tickets=Sum(
            "event__ticket_registrations__ticket_quantity",
            filter=Q(event__host_id=host_id),
        )
    )
    output = [
        {
            "category": category.name,
            "tickets": category.total_tickets or 0,
            # "fill": category_colors.get(category.name, "var(--color-default)")
        }
        for category in categories
    ]
    return JsonResponse({"result": output})
