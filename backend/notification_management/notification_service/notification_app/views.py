from django.shortcuts import render 
from django.http import JsonResponse
from .utils import get_notifications_from_redis

def get_notifications(request):
    return JsonResponse({'notifications': 'Worked'})
