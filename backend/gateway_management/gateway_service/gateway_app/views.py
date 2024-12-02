import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .user_svc import auth  # Assuming auth is where the function is located
import requests
import environ

env = environ.Env()
environ.Env.read_env()


@method_decorator(csrf_exempt, name="dispatch")
class register(APIView):
    def post(self, request):
        response = auth.register(request)
        return response


@method_decorator(csrf_exempt, name="dispatch")
class login(APIView):
    def post(self, request):
        response = auth.login(request)
        return response


class VerifyOTP(APIView):
    def post(self, request):
        response = auth.VerifyOTP(request)
        return response


class resend_otp(APIView):
    def post(self, request):
        response = auth.resend_otp(request)
        return response


class GoogleAuth(APIView):
    def post(self, request):
        response = auth.GoogleAuth(request)
        return response


class GoogleAuthLogin(APIView):
    def post(self, request):
        print("google auth login")
        response = auth.GoogleAuthLogin(request)
        return response


class RefreshTokenAPI(APIView):
    def post(self, request):
        try:
            response = requests.post(
                f"http://localhost:8081/token_refresh/",
                json=request.data,
                headers={"Content-Type": "application/json"},
            )
            gateway_response = Response(response.json(), status=response.status_code)

            for cookie in response.cookies:
                gateway_response.set_cookie(
                    key=cookie.name,
                    value=cookie.value,
                    httponly=cookie.has_nonstandard_attr("HttpOnly"),
                    secure=cookie.secure,
                    samesite=cookie.get_nonstandard_attr("SameSite"),
                )

            if response.status_code == 200:
                return gateway_response
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response(
                {"error": "User service is unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


class LogoutAPI(APIView):
    def post(self, request):
        try:
            response = requests.post(f"http://localhost:8081/logout/")

            print(response)
            gateway_response = Response(response.json(), status=response.status_code)

            if response.status_code == 200:
                return gateway_response
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response(
                {"error": "User service is unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


class UserAPI(APIView):
    def get(self, request, user_id):
        try:
            print("reached api gateway", user_id)
            response = requests.get(
                f"http://localhost:8081/user/{user_id}/",
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response(
                {"error": "User service is unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


class UpdateUserProfileAPI(APIView):
    def patch(self, request, user_id):
        try:
            response = requests.patch(
                f"http://localhost:8081/user/{user_id}/update_user_profile/",
                json=request.data,
                headers={"Content-Type": "application/json"},
            )
            gateway_response = Response(response.json(), status=response.status_code)

            if response.status_code == 200:
                return gateway_response
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response(
                {"error": "User service is unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


class setPasswordAPI(APIView):
    def post(self, request, user_id):
        try:
            auth_header = request.headers.get("Authorization")
            csrf_token = request.headers.get("csrftoken")
            headers = {"Content-Type": "application/json"}

            # If the token exists, add it to the outgoing request
            if auth_header:
                headers["Authorization"] = auth_header
                headers["x-csrftoken"] = csrf_token
            print(headers)

            response = requests.post(
                f"http://localhost:8081/user/{user_id}/set_password/",
                json=request.data,
                headers=headers,
            )
            gateway_response = Response(response.json(), status=response.status_code)

            if response.status_code == 200:
                return gateway_response
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response(
                {"error": "User service is unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


class ForgotPasswordAPI(APIView):
    def post(self, request):
        try:
            response = requests.post(
                f"http://localhost:8081/forgot-password/",
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
                {"error": "User service is unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

class VerifyOTPForgotPasswordAPI(APIView):
    def post(self, request):
        try:
            response = requests.post(
                f"http://localhost:8081/verify-otp-forgot-password/",
                json=request.data,
                headers={"Content-Type":"application/json"}
            )
            if response.status_code == 200:
                return Response(response.json(),status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except:
            return Response({"error": "User service is unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    

class SetNewPasswordAPI(APIView):
    def post(self, request):
        try:
            headers = {"Content-Type": "application/json"}

            response = requests.post(
                f"http://localhost:8081/set-new-password/",
                json=request.data,
                headers=headers,
            )
            gateway_response = Response(response.json(), status=response.status_code)

            if response.status_code == 200:
                return gateway_response
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response(
                {"error": "User service is unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
