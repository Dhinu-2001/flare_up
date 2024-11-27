from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.register.as_view(), name='register'),
    path('otp_verification/', views.VerifyOTP.as_view(), name='otp_verification'),
    path('resend_otp/', views.resend_otp.as_view(),name="resend_otp"),
    path('login/',views.login.as_view(), name="login"),
    path('GoogleAuth/', views.GoogleAuth.as_view(), name='GoogleAuth'),
    
    path('token_refresh/', views.RefreshTokenView.as_view(), name='RefreshTokenView'),
    path('logout/', views.LogoutView.as_view(), name='LogoutView'),
    path('user/<int:user_id>/', views.User.as_view(), name='User'),
    path('user/<int:user_id>/update_user_profile/', views.UpdateUserProfile.as_view(), name='UpdateUserProfile'),
    path('user/<int:user_id>/set_password/', views.setPassword.as_view(), name='setPassword'),
]
