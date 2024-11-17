from datetime import datetime, timedelta
from django.conf import settings
import jwt

class TokenService:
    @staticmethod
    def verify_token(token, token_type='access'):
        try:
            payload = jwt.decode(token, settings.SIMPLE_JWT['SIGNING_KEY'],algorithms=['HS256'])
            print('token decode type:', payload['type'])
            if payload['type'] != token_type:
                raise jwt.InvalidTokenError('Invalid token type')
            return payload
        except jwt.ExpiredSignatureError:
            raise jwt.ExpiredSignatureError('Token has expired')
        except jwt.InvalidAlgorithmError:
            raise jwt.InvalidAlgorithmError('Invalid algorithm')
        except jwt.InvalidTokenError:
            raise jwt.InvalidTokenError('Invalid token')