from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from requests.exceptions import RequestException, Timeout
import environ
import logging

env = environ.Env()
environ.Env.read_env()

# Create your views here.


class create_checkout_sessionAPI(APIView):
    def post(self, request):
        print('reached register gateway')
        try:
            response = requests.post(
                f"http://{env('REGISTRATION_SVC_ADDRESS')}/create-checkout-session/",
                json=request.data,
                headers={"Content-Type": "application/json"},
            )

            print(response)
            gateway_response = Response(response.json(), status=response.status_code)

            if response.status_code == 200:
                return gateway_response
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response(
                {"error": "Resgitration service is unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

      
class PaymentsByHosterViewAPI(APIView):
    def get(self, request, user_id):
        try:
            print('reached api gateway', user_id)
            response = requests.get(
                f"http://{env('REGISTRATION_SVC_ADDRESS')}/payments/{user_id}/",
                
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Registration service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
 
class PaymentDetailAPI(APIView):
    def get(self, request, transaction_id, user, event):
        print('PAYMENT DETAILS')
        user_id = user
        event_id = event
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Service addresses
        registration_svc_address = env('REGISTRATION_SVC_ADDRESS')
        if not registration_svc_address:
            return Response({'error': 'Service address not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        payment_url = f"http://{registration_svc_address}/payments/{transaction_id}/"
        event_url = f"http://{env('EVENT_SVC_ADDRESS')}/events/event/{event_id}/"
        user_url = f"http://localhost:8081/user-data/{user_id}/"

        try:
            # Fetch data concurrently for better performance
            payment_response   = requests.get(payment_url, timeout=5)
            event_response = requests.get(event_url, timeout=5)
            user_response = requests.get(user_url, timeout=5)

            # Check response statuses
            if payment_response.status_code != 200:
                logging.error(f"Payment service returned {payment_response.status_code}")
                return Response(
                    {'error': f"Failed to fetch payment data (status {payment_response.status_code})"},
                    status=status.HTTP_502_BAD_GATEWAY
                )
                
            if event_response.status_code != 200:
                logging.error(f"Event service returned {event_response.status_code}")
                return Response(
                    {'error': f"Failed to fetch event data (status {event_response.status_code})"},
                    status=status.HTTP_502_BAD_GATEWAY
                )
            
            if user_response.status_code != 200:
                logging.error(f"User service returned {user_response.status_code}")
                return Response(
                    {'error': f"Failed to fetch user data (status {user_response.status_code})"},
                    status=status.HTTP_502_BAD_GATEWAY
                )
            
            # Parse JSON data
            payment_json = payment_response.json()
            event_json = event_response.json()
            user_json = user_response.json()
            print('PAYMENT DATA', payment_json)
            print('EVENT DATA', event_json)
            print('USER DATA', user_json)

           
            # Combine responses
            response_data = {
                "payment_data": payment_json,
                "event_data": event_json,
                "user_data": user_json
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Timeout as e:
            logging.error(f"Request timeout: {e}")
            return Response(
                {'error': 'Service timeout. Please try again later.'},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        except RequestException as e:
            logging.error(f"Request error: {e}")
            return Response(
                {'error': 'Service unavailable. Please try again later.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except ValueError as e:  # JSON decode error
            logging.error(f"Invalid JSON response: {e}")
            return Response(
                {'error': 'Invalid response received from one of the services'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )