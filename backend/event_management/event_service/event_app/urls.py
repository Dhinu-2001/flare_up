from django.contrib import admin
from django.urls import path, include
from . import views
from . import category_view

urlpatterns = [
    path('', views.Events.as_view(), name='Events'),
    path('events/category/<str:category_name>/', views.EventsByCategory.as_view(), name='EventCategory'),
    path('events/hoster/<int:hoster_id>/', views.EventsByHoster.as_view(), name='EventsByHoster'),
    path('event/<int:event_id>/', views.Event.as_view(), name='Event'),
    path('event/<int:event_id>/update_event_status/', views.UpdateEventStatus.as_view(), name='UpdateEventStatus'),
    path('event/<int:event_id>/update_status/', views.UpdateApprovalStatus.as_view(), name='UpdateApprovalStatus'),
    path('event/<int:event_id>/key_participants/', views.KeyParticipants.as_view(), name='KeyParticipants'),
    path('create_category/', views.CreateCategory.as_view(), name='CreateCategory'),
    path('event-types-and-categories/', views.EventTypesAndCategories.as_view(), name='EventTypesAndCategories'),
    path('category/<str:category_name>/', category_view.Category.as_view(), name='EventTypesAndCategories'),
    path('type/', category_view.Types.as_view(), name='Types'),
    path('get_user_ticket_booking_details/<int:user_id>/', views.get_user_ticket_booking_details, name='get_user_ticket_booking_details'),
]
