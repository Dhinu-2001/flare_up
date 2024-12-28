from django.urls import path
from . import views

urlpatterns = [
    path('get_event_participant_stats/<int:host_id>/', views.get_event_participant_stats, name='get_event_stats'),
    path('event_count_on_catgory/<int:host_id>/', views.EventCountOnCatgory, name='event_count_on_catgory'),
]