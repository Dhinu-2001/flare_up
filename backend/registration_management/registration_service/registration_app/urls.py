from django.contrib import admin
from django.urls import path
from . import views, analytic_views

urlpatterns = [
    path('create-checkout-session/', views.create_checkout_session, name='create_checkout_session'),
    path('success-payment/<str:user_id>/', views.HandleSuccessPayment.as_view(), name='HandleSuccessPayment'),
    path('failure-payment/<str:user_id>/', views.HandleFailurePayment.as_view(), name='HandleFailurePayment'),
    path('payments/<int:user_id>/', views.PaymentsByHosterView.as_view(), name='registrations-by-hoster'),
    path('payments/<str:transaction_id>/', views.PaymentDetailView.as_view(), name='payment-detail'),
    path('total_income/<int:host_id>/', analytic_views.total_income.as_view(), name='total-income'),
]
