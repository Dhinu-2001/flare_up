# from django.shortcuts import render
# from rest_framework.views import APIView
from django.http import JsonResponse
from event_app.models import Event, EventCategory
from participant_app.models import TicketRegistration, TicketDetails

# # Create your views here.
# class MainGraph(APIView):
#     def get(self, request, host_id):
#         event_objs = Event.objects.filter(host_id=host_id)

from django.db.models import Count, Sum, Q, F
from django.db.models.functions import TruncDate
from datetime import datetime, timedelta
import json
from django.utils.timezone import now

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
    print('overall', response_data)

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



def get_user_event_analytics(request, user_id):
    # Get current date
    today = now().date()

    # Define date ranges
    start_of_month = today.replace(day=1)
    start_of_year = today.replace(month=1, day=1)
    last_month_start = (today - timedelta(days=30)).replace(day=1)

    # Filter registrations for the last month and year
    monthly_registrations = TicketRegistration.objects.filter(
        user_id=user_id,
        registered_at__gte=start_of_month,
    )

    yearly_registrations = TicketRegistration.objects.filter(
        user_id=user_id,
        registered_at__gte=start_of_year,
    )
    
    total_registrations = TicketRegistration.objects.filter(
        user_id=user_id,
    )

    # Helper to get analytics data
    def get_analytics_data(registrations):
        total_events = registrations.count()
        category_data = (
            registrations
            .values(category_name=F("event_id__category__name"))
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        categories = []
        color_map = {
            "Music": "bg-blue-500",
            "Sports": "bg-green-500",
            "Tech": "bg-purple-500",
            "Education": "bg-blue-500",
            "Cultural": "bg-green-500",
            "Business": "bg-purple-500",
        }
        icon_map = {
            "Music": "Music",
            "Sports": "Dumbbell",
            "Tech": "Laptop",
            "Education": "Music",
            "Cultural": "Dumbbell",
            "Business": "Laptop",
        }

        for data in category_data:
            categories.append({
                "name": data["category_name"],
                "count": data["count"],
                "icon": icon_map.get(data["category_name"], "DefaultIcon"),
                "color": color_map.get(data["category_name"], "bg-gray-500"),
            })

        return {
            "totalEvents": total_events,
            "categories": categories,
        }

    # Generate analytics
    monthly_data = get_analytics_data(monthly_registrations)
    yearly_data = get_analytics_data(yearly_registrations)
    total_data = get_analytics_data(total_registrations)

    output =  {
        "monthlyData": monthly_data,
        "yearlyData": yearly_data,
        "totalData": total_data,
    }
    return JsonResponse({"result": output}) 
