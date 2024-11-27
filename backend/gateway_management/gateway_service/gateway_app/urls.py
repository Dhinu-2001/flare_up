from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.register.as_view(), name='register'),
    path('login/',views.login.as_view(), name='login'),
    path('otp_verification/',views.VerifyOTP.as_view(), name='otp_verification'),
    path('resend_otp/', views.resend_otp.as_view(),name='resend_otp'),
    path('GoogleAuth/', views.GoogleAuth.as_view(), name='GoogleAuth'),
    path('GoogleAuthLogin/', views.GoogleAuthLogin.as_view(), name='GoogleAuthLogin'),
    path('token_refresh/', views.RefreshTokenAPI.as_view(), name='Refresh_token_api'),
    path('logout/', views.LogoutAPI.as_view(), name='LogoutAPI'),
    path('user/<int:user_id>/', views.UserAPI.as_view(), name='UserAPI'),
    path('user/<int:user_id>/update_user_profile/', views.UpdateUserProfileAPI.as_view(), name='UpdateUserProfileAPI'),
    path('user/<int:user_id>/set_password/', views.setPasswordAPI.as_view(), name='setPasswordAPI'),
]
