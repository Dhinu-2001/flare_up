from django.urls import path
from . import views

urlpatterns = [
    path('',views.EventsAPI.as_view(), name='EventsAPI'),
    path('events/category/<str:category_name>/', views.EventsByCategoryAPI.as_view(), name='EventsByCategoryAPI'),
    path('event/<int:event_id>/', views.EventAPI.as_view(), name='EventAPI'),
    path('event/<int:event_id>/update_event_status/', views.UpdateEventStatusAPI.as_view(), name='UpdateEventStatusAPI'),
    path('event/<int:event_id>/update_status/', views.UpdateApprovalStatusAPI.as_view(), name='UpdateApprovalStatusAPI'),
    path('event-types-and-categories/',views.EventTypesAndCategoriesAPI.as_view(), name='EventTypesAndCategoriesAPI'),
    path('create_category/',views.CreateCategoryAPI.as_view(), name='CreateCategoryAPI'),
    path('category/<str:category_name>/',views.CategoryAPI.as_view(), name='CategoryAPI'),
    path('type/',views.TypeAPI.as_view(), name='TypeAPI'),
]
