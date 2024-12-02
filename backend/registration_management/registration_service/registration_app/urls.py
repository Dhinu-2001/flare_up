from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout-session/', views.create_checkout_session, name='create_checkout_session'),
    path('success-payment/', views.HandleSuccessPayment.as_view(), name='HandleSuccessPayment'),
    path('registrations/<int:user_id>/', views.RegistrationsByHosterView.as_view(), name='registrations-by-hoster'),
]
