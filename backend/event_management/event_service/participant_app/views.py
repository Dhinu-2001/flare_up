from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TicketRegistration
from .serializers import TicketRegistrationSerializer

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
        
class ParticipantsByEvent(APIView):
    def get(self, request, event_id):
        try:
            if not event_id:
                return Response(
                    {"error": "Event id is not required"},status=status.HTTP_400_BAD_REQUEST)
                
            ticket_objs = TicketRegistration.objects.filter(event_id=event_id)
            serializer = TicketRegistrationSerializer(ticket_objs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class TicketDetails(APIView):
    def get(self, request, transaction_id):
        try:
            if not transaction_id:
                return Response(
                    {"error": "Transaction id is not required"},status=status.HTTP_400_BAD_REQUEST)
                
            ticket_obj = TicketRegistration.objects.get(transaction_id=transaction_id)
            serializer = TicketRegistrationSerializer(ticket_obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)