from django.urls import path
from . import views
from . import admin_analytic_view

urlpatterns = [
    path('get_user_event_analytics/<int:user_id>/', views.get_user_event_analytics, name='get_user_event_analytics'),
    
    path('get_event_participant_stats/<int:host_id>/', views.get_event_participant_stats, name='get_event_stats'),
    path('event_count_on_category/<int:host_id>/', views.EventCountOnCategory, name='event_count_on_category'),
    path('participant_count_on_category/<int:host_id>/', views.ParticipantCountOnCategory, name='participant_count_on_category'),
    
    path('admin/get_event_participant_stats/<int:admin_id>/', admin_analytic_view.get_event_participant_stats, name='get_event_stats'),
    path('admin/event_count_on_category/<int:admin_id>/', admin_analytic_view.EventCountOnCategory, name='event_count_on_category'),
    path('admin/participant_count_on_category/<int:admin_id>/', admin_analytic_view.ParticipantCountOnCategory, name='participant_count_on_category'),
]