from datetime import datetime, timezone
from django.http import JsonResponse
import jwt
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication

class JWTAuthenticationMiddleware(JWTAuthentication):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        public_paths = [
            '/api/login/', '/api/register/', '/api/token_refresh/', '/api/admin-register/', '/api/otp_verification/', 
            '/api/resend_otp/', '/api/GoogleAuth/', '/api/GoogleAuthLogin/', '/api/logout/', '/api/events/','/api/forgot-password/', '/api/verify-otp-forgot-password/', '/api/set-new-password/'
        ]
        print('request path', request.path)
        # Skip authentication for public paths
        if request.path in public_paths:
            print('public path')
            return self.get_response(request)

        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return JsonResponse(
                    {'error': 'Authorization header is missing'}, 
                    status=401
                )
            
            if not auth_header.startswith('Bearer '):
                return JsonResponse(
                    {'error': 'Invalid authorization format. Use Bearer scheme'},
                    status=401
                )

            access_token = auth_header.split(' ')[1]
            if not access_token:
                return JsonResponse(
                    {'error': 'Token is missing in Authorization header'},
                    status=401
                )
            
            # Validate the token using JWTAuthentication methods
            
            # Restframework Token validation 
            validated_token = self.get_validated_token(access_token)
            print('key printing')
            print(dir(validated_token))

            user_id = validated_token.get('user_id')
            print('user id:', user_id)
            request.is_authenticated = True
            
            
        except AuthenticationFailed as e:
            # Check for a specific message indicating an expired token
            if 'token has expired' in str(e):
                return JsonResponse({'error': 'Access token has expired'}, status=401)
            return JsonResponse({'error': str(e)}, status=401)
        except IndexError:
            return JsonResponse({'error': 'Invalid authorization format'}, status=401)

        # Proceed with the request
        return self.get_response(request)

