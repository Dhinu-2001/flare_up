# import jwt
# from datetime import datetime, timedelta, timezone
# from django.conf import settings

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions
from django.http import JsonResponse
import jwt

# Define SimpleUser at module level
class SimpleUser:
    def __init__(self, user_dict):
        for key, value in user_dict.items():
            setattr(self, key, value)
    
    @property
    def is_authenticated(self):
        return True

class EventServiceAuthentication(JWTAuthentication):
    def authenticate(self, request):
        public_paths = ['/login/', '/register/', '/token_refresh/', '/otp_verification/', 
                       '/resend_otp/', '/GoogleAuth/', '/GoogleAuthLogin/', '/logout/', '/events/']
        
        # Skip authentication for public paths
        if request.path in public_paths:
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
            
            # Validate the token
            validated_token = self.get_validated_token(access_token)
            
            # Extract user info from token
            user_info = {
                'id': validated_token.get('user_id'),  # Adjust based on your token payload
                'username': validated_token.get('username', ''),  # Optional
                'is_authenticated': True
            }
            
            user = SimpleUser(user_info)
            
            # Skip CSRF for microservice communication
            # enforce_csrf(request)  # Comment this out if using service-to-service communication
            
            return (user, validated_token)
            
        except AuthenticationFailed as e:
            if 'token has expired' in str(e):
                return JsonResponse({'error': 'Access token has expired'}, status=401)
            return JsonResponse({'error': str(e)}, status=401)
        except IndexError:
            return JsonResponse({'error': 'Invalid authorization format'}, status=401)
        except Exception as e:
            return JsonResponse({'error': f'Authentication error: {str(e)}'}, status=401)

    def get_user(self, validated_token):
        """
        Override this method to return a simple user object based on token claims
        """
        user_info = {
            'id': validated_token.get('user_id'),
            'username': validated_token.get('username', ''),
            'is_authenticated': True
        }
        return SimpleUser(user_info)

# from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework.exceptions import AuthenticationFailed
# from rest_framework.authentication import CSRFCheck
# from rest_framework import exceptions
# from django.http import JsonResponse


# def enforce_csrf(request):
#     """Function to enforce CSRF checks."""
#     check = CSRFCheck()
#     check.process_request(request)
#     reason = check.process_view(request, None, (), {})
#     if reason:
#         raise exceptions.PermissionDenied('CSRF Denied: %s' % reason)

# class CustomAuthentication(JWTAuthentication):
#     def authenticate(self, request):
#         public_paths = ['/login/', '/register/', '/token_refresh/','/otp_verification/', '/resend_otp/', '/GoogleAuth/', '/GoogleAuthLogin/', '/logout/', '/events/']
        
#         # Skip authentication for public paths
#         if request.path in public_paths:
#             return None

#         auth_header = request.headers.get('Authorization')
#         if not auth_header:
#             return None
#         try:
#             if not auth_header.startswith('Bearer '):
#                 raise AuthenticationFailed('Invalid authorization format. Use Bearer scheme')

#             # Extract the token
#             access_token = auth_header.split(' ')[1]

#             if not access_token:
#                 return None

#             print('before token validation')
            
#             validated_token = self.get_validated_token(access_token)
#             print('jwt authen in user serv:', validated_token )
#             useri = self.get_user(validated_token)
#             print('user in authencation', useri)
            
#             # enforce_csrf(request)
#             return self.get_user(validated_token), validated_token
            
#         except AuthenticationFailed as e:
#             # Check for a specific message indicating an expired token
#             if 'token has expired' in str(e):
#                 return JsonResponse({'error': 'Access token has expired'}, status=401)
#             return JsonResponse({'error': str(e)}, status=401)
#         except IndexError:
#             return JsonResponse({'error': 'Invalid authorization format'}, status=401)
