from django.urls import path
from . import views

urlpatterns = [
    path('',views.EventsAPI.as_view(), name='EventsAPI'),
    path('events/category/<str:category_name>/', views.EventsByCategoryAPI.as_view(), name='EventsByCategoryAPI'),
    path('events/hoster/<int:hoster_id>/', views.EventsByHosterAPI.as_view(), name='EventsByHosterAPI'),
    path('event/<int:event_id>/', views.EventAPI.as_view(), name='EventAPI'),
    path('event/<int:event_id>/update_event_status/', views.UpdateEventStatusAPI.as_view(), name='UpdateEventStatusAPI'),
    path('event/<int:event_id>/update_status/', views.UpdateApprovalStatusAPI.as_view(), name='UpdateApprovalStatusAPI'),
    path('event/<int:event_id>/key_participants/', views.KeyParticipantsAPI.as_view(), name='KeyParticipantsAPI'),
    path('event-types-and-categories/',views.EventTypesAndCategoriesAPI.as_view(), name='EventTypesAndCategoriesAPI'),
    path('create_category/',views.CreateCategoryAPI.as_view(), name='CreateCategoryAPI'),
    path('category/<str:category_name>/',views.CategoryAPI.as_view(), name='CategoryAPI'),
    path('type/',views.TypeAPI.as_view(), name='TypeAPI'),
    path('ticket-download/<str:transaction_id>/',views.TicketDownloadAPI.as_view(), name='TicketDownloadAPI'),
    path('participants/event/<int:event_id>/',views.ParticipantsByEventAPI.as_view(), name='participants_event'),
    path('analytics_hoster/<int:hoster_id>/',views.AnalyticsHosterAPI.as_view(), name='analytics_hoster_api'),
    path('analytics_admin/<int:admin_id>/',views.AnalyticsAdminAPI.as_view(), name='analytics_admin_api'),
    path('get_user_data_event_analytics/<int:user_id>/',views.GetUserDataEventAnalyticsAPI.as_view(), name='GetUserDataEventAnalyticsAPI'),
    path('get_user_ticket_booking_details/<int:user_id>/',views.GetUserTicketBookingDetailsAPI.as_view(), name='get-user-ticket-booking-details'),
]
