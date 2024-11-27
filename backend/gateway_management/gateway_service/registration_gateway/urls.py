from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout-session/', views.create_checkout_sessionAPI.as_view(), name='create_checkout_sessionAPI'),
]
