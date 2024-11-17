
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import jwt
from datetime import datetime, timedelta, timezone
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions
from django.http import JsonResponse

def enforce_csrf(request):
    """Function to enforce CSRF checks."""
    check = CSRFCheck()
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied('CSRF Denied: %s' % reason)

class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request):
        public_paths = ['/login/', '/register/', '/token_refresh/','/otp_verification/', '/resend_otp/', '/GoogleAuth/', '/GoogleAuthLogin/', '/logout/']
        print('path:', request.path)
        # Skip authentication for public paths
        if request.path in public_paths:
            print('public path')
            return None

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        try:
            if not auth_header.startswith('Bearer '):
                raise AuthenticationFailed('Invalid authorization format. Use Bearer scheme')

            # Extract the token
            access_token = auth_header.split(' ')[1]

            if not access_token:
                return None
            
            print('before token validation')
            
            validated_token = self.get_validated_token(access_token)
            print('jwt authen in user serv:', validated_token )
            useri = self.get_user(validated_token)
            print('user in authencation', useri)
            

            #     raise AuthenticationFailed('Invalid token type')
                    
            enforce_csrf(request)
            return self.get_user(validated_token), validated_token
            
        except AuthenticationFailed as e:
            # Check for a specific message indicating an expired token
            if 'token has expired' in str(e):
                return JsonResponse({'error': 'Access token has expired'}, status=401)
            return JsonResponse({'error': str(e)}, status=401)
        except IndexError:
            return JsonResponse({'error': 'Invalid authorization format'}, status=401)

# class CustomAuthenticate(JWTAuthentication):
    # """Custom authentication class to enforce JWT and CSRF checks."""
    # def authenticate(self, request: Request):
    #     """Override the authenticate method to add CSRF checks."""   
    #     jwt_bypass_paths = ['/login','/register',  '/home', '/forgot-password']
    #     if request.path in jwt_bypass_paths:
    #         return None 

    #     header = self.get_header(request)

    #     if header is None:
    #         raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
    #     else:
    #         raw_token = self.get_raw_token(header)
    #     if raw_token is None:
    #         return None

    #     validated_token = self.get_validated_token(raw_token)
    #     enforce_csrf(request)
    #     return self.get_user(validated_token), validated_token

