from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import environ

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
    def get(self, request, transaction_id):
        try:
            user_id = request.query_params.get('user')
            print('reached api payment')
            payment_response = requests.get(
                f"http://{env('REGISTRATION_SVC_ADDRESS')}/payments/{transaction_id}/"
            )
            payment_json = payment_response.json()
            
            user_response = requests.get(
                f"http://localhost:8081/user-data/{user_id}/"
            )
            user_json = user_response.json()
            
            
            response_data = {
                "payment_data": payment_json["data"],
                "user_data": user_json["data"]
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException:
            return Response(
                {'error': 'Registration service is unavailable'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
                )