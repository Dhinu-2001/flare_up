from django.shortcuts import render
from rest_framework.views import APIView

# Create your views here.

class TicketDownload(APIView):
    def get(self, request, transaction_id):
        pass
            