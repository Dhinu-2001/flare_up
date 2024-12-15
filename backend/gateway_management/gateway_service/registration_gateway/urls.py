from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout-session/', views.create_checkout_sessionAPI.as_view(), name='create_checkout_sessionAPI'),
    path('payments/<int:user_id>/', views.PaymentsByHosterViewAPI.as_view(), name='payments-by-hoster-API'),
    path('payments/<str:transaction_id>/', views.PaymentDetailAPI.as_view(), name='payment-detail-API'),

]
