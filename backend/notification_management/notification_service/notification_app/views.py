from django.shortcuts import render 
from django.http import JsonResponse
from .utils import get_notifications_from_redis

def get_notifications(request):
    user = request.user
    if user.is_anonymous:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    notifications = get_notifications_from_redis(user.id)
    return JsonResponse({'notifications': notifications})
