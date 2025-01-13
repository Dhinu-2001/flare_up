from datetime import datetime, timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    RegisterUserSerializer,
    Userserializer,
    VerifyOTPSerializer,
    EmailSerializer,
    GoogleAuthSerializer,
    UserProfileRetrieveSerializer,
    UserDataRetrieveSerializer
)
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.middleware import csrf
from .send_otp import send_otp
from .models import CustomUser
from django.core.cache import cache
from .token_services import TokenService
import jwt
import environ
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import cachecontrol
import requests

env = environ.Env()
environ.Env.read_env()

# Create your views here.


# TOKEN GENERATION FUNCTION
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    # Custom Claims
    refresh["username"] = str(user.username)
    refresh["isAdmin"] = user.is_superadmin

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class register(APIView):
    def post(self, request, *args, **kwargs):
        print("register request data", request.data)
        serializer = RegisterUserSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.data["email"]
            otp = send_otp(email)

            print(email, otp)

            cache.set(f"{email}",[email, otp, serializer.validated_data], timeout=120)
            
            cache_data=cache.get(f"{email}")
            print('value setted in cache', cache_data) 
            print("after cache")
            # request.session['otp'] = otp
            # request.session['email'] = email
            request.session["user_data"] = serializer.validated_data
            request.session.save()
            # request.session.modified = True
            print("session id", request.session.session_key)
            return Response(
                {"message": "An OTP has been sent to your email"},
                status=status.HTTP_201_CREATED,
            )
        else:
            
            error_messages = []
            for field, errors in serializer.errors.items():
                for error in errors:
                    if field == "email" and "unique" in error:
                        error_messages.append("Email already exists")
                    elif field == "username" and "unique" in error:
                        error_messages.append("Username already exists")
                    else:
                        error_messages.append(f"{field.capitalize()}: {error}")

            content = {"error": error_messages}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)



class Adminregister(APIView):
    def post(self, request, *args, **kwargs):
        try:
            print("register request data", request.data)
            serializer = RegisterUserSerializer(data=request.data)

            if serializer.is_valid():
                print(serializer.validated_data)
                user = CustomUser.objects.create(**serializer.validated_data)
                user.is_staff = True
                user.is_admin = True
                user.is_superadmin = True
                user.save()
                print("reached here")
                # request.session.pop("otp", None)
                # request.session.pop("email", None)
                # request.session.pop("user_data", None)
                
                return Response(
                    {
                        "message": "Admin account created. You can login now."
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class resend_otp(APIView):
    def post(self, request):
        print("resend_otp reached")
        print("data prineting", request.data)
        serializer = EmailSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            new_otp = send_otp(email)

            cache_data = cache.get(f"{email}")
            if cache_data:
                cache_data[1] = new_otp
                cache.set(f"{email}",cache_data,timeout=120)
            else:
                print('No data found in cache for this email')
                return Response({'error':'No data found in cache'},status=status.HTTP_400_BAD_REQUEST)
            
            # cache.set("otp", otp, timeout=120)
            # cache.set("email", email, timeout=120)
            return Response(
                {"message": "An OTP has been sent to your registered email"},
                status=status.HTTP_201_CREATED,
            )
        else:
            print("error in serializer")
            return Response(
                {"message": serializer.error_messages},
                status=status.HTTP_400_BAD_REQUEST,
            )


class VerifyOTP(APIView):
    def post(self, request):
        print(request.data)
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():

            print(request.session.session_key)
            email = serializer.validated_data["email"]
            enteredOtp = serializer.validated_data["enteredOtp"]
            
            print("Send by user", enteredOtp, email)
            
            cache_data=cache.get(f"{email}")
            
            if cache_data:
                cached_email = cache_data[0]
                cached_OTP = cache_data[1]
                cached_user_data = cache_data[2]
            else:
                print('No data found in cache for this email')
                return Response({'error':'No data found in cache'},status=status.HTTP_400_BAD_REQUEST)
            

            print("redis", cached_email, cached_OTP, cached_user_data)
            user_data_session = request.session.get("user_data")
            print("session user data", user_data_session)

            if cached_email != email:
                return Response(
                    {"message": "Invalid email address"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if cached_OTP != enteredOtp:
                return Response(
                    {"message": "Invalid Otp"}, status=status.HTTP_400_BAD_REQUEST
                )
            
            print("before save", cached_user_data)

            if cached_user_data:
                user = CustomUser.objects.create(**cached_user_data)
                user.save()

                print("reached here")
                # request.session.pop("otp", None)
                # request.session.pop("email", None)
                # request.session.pop("user_data", None)

                return Response(
                    {
                        "message": "Email verified and account created. You can login now."
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "No user data found. Please register again."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class GoogleAuth(APIView):
    def post(self, request):
        token = request.data.get("gToken")
        role = request.data.get("role")
        CLIENT_ID = env("GOOGLE_CLIENT_ID")
        print(token, role, CLIENT_ID)
        
        try:
            print('before gtoken validation')
            
            session = requests.session()
            cached_session = cachecontrol.CacheControl(session)
            request = google_requests.Request(session=cached_session)
            idinfo = id_token.verify_oauth2_token(token, request, CLIENT_ID, clock_skew_in_seconds=10)
            print("token info", idinfo)

            # CHECKING IS THE CORRECT AUDIENCE#####

            if idinfo["aud"] != CLIENT_ID:
                raise ValueError("Could not verify audience.")
            print("passed aud test")

            google_userid = idinfo["sub"]
            full_name = idinfo["name"]
            email = idinfo["email"]
            try:
                user = CustomUser.objects.get(email=email)
            except:
                user = None
            print("user detail in data", user)

            if not user:
                print("creating(Register) user and login")
                if not role:
                    return Response({'error':'Please register'}, status=status.HTTP_401_UNAUTHORIZED)
                serializer = GoogleAuthSerializer(
                    data={
                        "google_userid": google_userid,
                        "fullname": full_name,  # changed `full_name` to `fullname`
                        "email": email,
                        "role": role,
                    }
                )
                print("before serializer check")
                if serializer.is_valid():
                    user = CustomUser.objects.create(
                        google_userid=google_userid,
                        fullname=full_name,
                        email=email,
                        role=role,
                    )
                    user.save()
                    tokens = get_tokens_for_user(user)
                    print(tokens)

                    response_data = {
                        "accessToken": tokens["access"],
                        "refreshToken": tokens["refresh"],
                        "id": user.id,
                        "username": user.fullname,
                        "email": user.email,
                        "role": user.role,
                        "profile_picture": user.profile_picture,
                    }
                    response = Response(response_data,status=status.HTTP_200_OK)
                    print(response)
                    return response
                else:
                    print(serializer.errors)
                    return Response(
                        {"message": "Google Oauth is not valid"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                print("user already exist login")
                tokens = get_tokens_for_user(user)
                print(tokens)

                # tokens = get_tokens_for_user(user)
                response_data = {
                    "accessToken": tokens["access"],
                    "refreshToken": tokens["refresh"],
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "profile_picture": user.profile_picture,
                }
                response = Response(response_data,status=status.HTTP_200_OK)
                print(response)
                return response

        except Exception as e:
            print(e)
            return Response(
                {"error": f"Google Oauth Failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
            )

        # else:
        #     error_messages = []
        #     for field, errors in serializer.errors.items():
        #         for error in errors:
        #             if field == 'email' and 'unique' in error:
        #                 error_messages.append("Email already exists")
        #             elif field == 'username' and 'unique' in error:
        #                 error_messages.append("Username already exists")
        #             else:
        #                 error_messages.append(f"{field.capitalize()}: {error}")

        #     content = {"message": error_messages}
        #     return Response(content, status=status.HTTP_400_BAD_REQUEST)


class login(APIView):
    def post(self, request, format=None):
        data = request.data
        serializer = Userserializer(data=data)
        print('befor validation')
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            if user.is_active:
                tokens = get_tokens_for_user(user)
                print(tokens)

                # tokens = get_tokens_for_user(user)
                response_data = {
                    "accessToken": tokens["access"],
                    "refreshToken": tokens["refresh"],
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "profile_picture": user.profile_picture,
                }
                response = Response(response_data)
                print(response)
                return response
            else:
                return Response(
                    {"Not active": "This account is suspended"},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

from datetime import datetime


class RefreshTokenView(APIView):
    def post(self, request):
        print("reached token refresh")
        print(request.data)
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response(
                {"error": "Refresh token not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh_token = RefreshToken(refresh_token)

            timestamp = refresh_token["exp"]
            currtime = datetime.now(tz=timezone.utc).timestamp()
            readable_time = datetime.utcfromtimestamp(timestamp).strftime(
                "%Y-%m-%d %H:%M:%S"
            )
            currreadable_time = datetime.utcfromtimestamp(currtime).strftime(
                "%Y-%m-%d %H:%M:%S"
            )

            print("refresh exp", readable_time)
            print("current time", currreadable_time)

            if refresh_token["exp"] < datetime.now(tz=timezone.utc).timestamp():
                print("expired")
                return Response(
                    {"error": "Refresh token expired"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            new_access_token = str(refresh_token.access_token)

            user_id = refresh_token["user_id"]
            user = CustomUser.objects.get(id=user_id)

            # Build response
            response_data = {
                "accessToken": new_access_token,
                "refreshToken": str(refresh_token),
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "profile_picture": user.profile_picture,
            }
            response = Response(response_data, status=status.HTTP_200_OK)
            print(response.data)
            return response
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "Token has expired"}, status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.InvalidAlgorithmError:
            return Response(
                {"error": "Invalid algorithm"}, status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.InvalidTokenError:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        return response


class UserProfile(APIView):
    def get(self, request, user_id):
        try:
            if not user_id:
                return Response(
                    {"error":"User ID is missing."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            print('reached user',user_id)
            try:
                user = CustomUser.objects.get(id=user_id)
            except CustomUser.DoesNotExist:
                return Response(
                    {"error": "User not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            serializer = UserProfileRetrieveSerializer(user)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class UserData(APIView):
    def get(self, request, user_id):
        try:
            if not user_id:
                return Response(
                    {"error":"User ID is missing."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            print('reached user',user_id)
            print(type(user_id))
            try:
                user_object = CustomUser.objects.get(id=user_id)
            except CustomUser.DoesNotExist:
                return Response(
                    {"error": "User not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
            serializer = UserDataRetrieveSerializer(user_object)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    
class UpdateUserProfile(APIView):
    def patch(self, request, user_id):
        if not user_id:
            return Response({'error':'User id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            print('request data',request.data)
            if request.data:
                updated_data = request.data
                user_object = CustomUser.objects.get(id=user_id)
                if 'profile_publicId' in updated_data:
                    user_object.profile_picture = updated_data['profile_publicId']
                else:
                    user_object.fullname = updated_data['fullname']
                    user_object.username = updated_data['username']
                    user_object.email = updated_data['email']
                    user_object.phone_number = updated_data['phone_number']
                user_object.save()
                    
                return Response({'message':'User data updated successfully'}, status=status.HTTP_202_ACCEPTED)

            else:
                return Response({'error':'Please input the data'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
                return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)

# if len(new_password) < 8:  # Example validation
#         return Response({'error': 'Password must be at least 8 characters long'}, status=400)
from django.contrib.auth.hashers import check_password  

class setPassword(APIView):
    def post(self, request, user_id):
        try:
            user_email = request.user
            user_object = CustomUser.objects.get(email = user_email)
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')
            if new_password != confirm_password:
                    return Response({'error':'New password and confirm password must be same to confirm.'}, status=status.HTTP_400_BAD_REQUEST)
            if not user_object.password:
                
                user_object.set_password(new_password)
                user_object.save()
                return Response({'message':'User password updated successfully'}, status=status.HTTP_202_ACCEPTED)
            else:
                current_password = request.data.get('current_password')
                print('beore checking')
                if not check_password(current_password, user_object.password):
                    return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
                print('after checking')
                user_object.set_password(new_password)
                user_object.save()
                return Response({'message':'User password updated successfully'}, status=status.HTTP_202_ACCEPTED)

        except Exception as e:
                return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
class ForgotPassword(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            print(email)
            user_object = CustomUser.objects.get(email=email)
            if not user_object:
                return Response({'error':'Entered email is not in use.'}, status=status.HTTP_404_NOT_FOUND)
            
            otp = send_otp(email)

            print(email, otp)

            cache.set(f"{email}",[email, otp], timeout=120)
            
            cache_data=cache.get(f"{email}")
            print('value setted in cache', cache_data) 
            print("after cache")
            return Response(
                {"message": "An OTP has been sent to your email"},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            print(e)
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class VerifyOTPForgotPassword(APIView):
    def post(self, request):
        print(request.data)
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            print(request.session.session_key)
            email = serializer.validated_data["email"]
            enteredOtp = serializer.validated_data["enteredOtp"]
            
            print("Send by user", enteredOtp, email)
            
            cache_data=cache.get(f"{email}")
            
            if cache_data:
                cached_email = cache_data[0]
                cached_OTP = cache_data[1]
            else:
                print('No data found in cache for this email')
                return Response({'error':'No data found in cache'},status=status.HTTP_400_BAD_REQUEST)
            

            print("redis", cached_email, cached_OTP)

            if cached_email != email:
                return Response(
                    {"message": "Invalid email address"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if cached_OTP != enteredOtp:
                return Response(
                    {"message": "Invalid Otp"}, status=status.HTTP_400_BAD_REQUEST
                )
            print('email veri')
            return Response(
                {
                    "message": "Email verified."
                },
                status=status.HTTP_202_ACCEPTED
            )
            
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SetNewPassword(APIView):
    def post(self, request):
        try:
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')
            email = request.data.get('email')
            user_object = CustomUser.objects.get(email = email)
            if not user_object:
                return Response({'error':'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            if new_password != confirm_password:
                    return Response({'error':'New password and confirm password must be same to confirm.'}, status=status.HTTP_400_BAD_REQUEST)
        
            user_object.set_password(new_password)
            user_object.save()
            return Response({'message':'User password updated successfully'}, status=status.HTTP_202_ACCEPTED)

        except Exception as e:
                return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
            

class HosterList(APIView):
    def get(self, request):
        try:
            users = CustomUser.objects.filter(role='hoster')
            
            serializer = UserProfileRetrieveSerializer(users, many=True)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class UserList(APIView):
    def get(self, request):
        try:
            users = CustomUser.objects.filter(role='user')
            serializer = UserProfileRetrieveSerializer(users, many=True)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
    