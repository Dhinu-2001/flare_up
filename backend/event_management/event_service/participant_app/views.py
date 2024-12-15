from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TicketRegistration

# Create your views here.

class TicketDownload(APIView):
    def get(self, request, transaction_id):
        try:
            if not transaction_id:
                return Response(
                    {"error": "Transaction id is not required"},status=status.HTTP_400_BAD_REQUEST)
            ticket_obj = TicketRegistration.objects.get(transaction_id=transaction_id)
            response_data ={
                'secure_url': ticket_obj.ticket_secure_url,
                'public_id': ticket_obj.ticket_public_id,
            }
            print(response_data)
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
            