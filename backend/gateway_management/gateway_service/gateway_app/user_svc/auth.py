import json
import requests
from rest_framework.response import Response
from rest_framework import status
import os
import environ

env = environ.Env()
environ.Env.read_env()

def register(request):
    try:
        # Parse incoming request data from the gateway
        data = json.loads(request.body)

        # Send the data as JSON to the user service
        response = requests.post(
            f"http://localhost:8081/register/",
            json=data,  # Send data as JSON
            headers={"Content-Type": "application/json"}
        )

        # Handle different status codes from the user service response
        if response.status_code == 201:
            return Response(response.json(), status=status.HTTP_201_CREATED)
        return Response(response.json(), status=response.status_code)

    except requests.exceptions.RequestException as e:
        # Handle network or connection issues with user service
        return Response({"error": "User Service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
def login(request):
    try:
        data = json.loads(request.body)
        
        response = requests.post(
            f"http://localhost:8081/login/",
            json=data,
            headers={"Content-Type":"application/json"}
        )

        print("Cookies in response gateway:", response.cookies.items())

        gateway_response = Response(response.json(), status=response.status_code)

        for cookie in response.cookies:
            gateway_response.set_cookie(
                key=cookie.name, 
                value=cookie.value, 
                httponly=cookie.has_nonstandard_attr('HttpOnly'),
                secure=cookie.secure,
                samesite=cookie.get_nonstandard_attr('SameSite')
            )

        if response.status_code == 200:
            return gateway_response
        return Response(response.json(), status=response.status_code)
    except:
        return Response({"error": "User Service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
def VerifyOTP(request):
    try:
        data = json.loads(request.body)
        print(data)
        response = requests.post(
            f"http://localhost:8081/otp_verification/",
            json=data,
            headers={"Content-Type":"application/json"}
        )
        if response.status_code == 200:
            return Response(response.json(),status=status.HTTP_200_OK)
        return Response(response.json(), status=response.status_code)
    except:
        return Response({"error": "User service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

def resend_otp(request):
    try:
        data = json.loads(request.body)
        print(data)
        response = requests.post(
            f"http://localhost:8081/resend_otp/",
            json=data,
            headers={"Content-Type":"application/json"}
        )
        if response.status_code == 200:
            return Response(response.json(),status=status.HTTP_200_OK)
        return Response(response.json(), status=response.status_code)
    except:
        return Response({"error":"User service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

def GoogleAuth(request):
    try:
        data = json.loads(request.body)
       
        path = env('USER_SVC_ADDRESS')
        print('google auth reached', path)
        
        response = requests.post(
            f"http://localhost:8081/GoogleAuth/",
            json=data,
            headers={"Content-Type":"application/json"}
        )
        if response.status_code == 200:
            return Response(response.json(), status=status.HTTP_201_CREATED)
        return Response(response.json(),status=response.status_code)
    except:
        return Response({"error":"User service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
def GoogleAuthLogin(request):
    try:
        data = json.loads(request.body)
        response = requests.post(
            f"http://localhost:8081/GoogleAuthLogin/",
            json=data,
            headers={"Content-Type":"application/json"}
        )
        if response.status_code == 200:
            return Response(response.json(), status=status.HTTP_201_CREATED)
        return Response(response.json(),status=response.status_code)
    except:
        return Response({"error":"User service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)