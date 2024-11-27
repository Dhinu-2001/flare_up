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
