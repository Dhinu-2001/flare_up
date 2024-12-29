from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('ticket-download/<str:transaction_id>/',views.TicketDownload.as_view(), name='TicketDownload'),
    path('event/<int:event_id>/',views.ParticipantsByEvent.as_view(), name='participants_event'),
    path('ticket_details/<str:transaction_id>/',views.TicketDetails.as_view(), name='ticket_details'),
    
]