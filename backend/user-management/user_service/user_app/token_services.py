from datetime import datetime, timedelta
from django.conf import settings
import jwt

class TokenService:
    @staticmethod
    def generate_tokens(user_id):
        access_token = jwt.encode({
            'user_id':user_id,
            'exp':datetime.utcnow()+timedelta(minutes=1),
            'iat': datetime.utcnow(),
            'type': 'access'
        }, settings.SIMPLE_JWT['SIGNING_KEY'], algorithm=settings.SIMPLE_JWT['ALGORITHM'])

        refresh_token = jwt.encode({
            'user_id':user_id,
            'exp':datetime.utcnow()+timedelta(minutes=2),
            'iat':datetime.utcnow(),
            'type':'refresh',
        }, settings.SIMPLE_JWT['SIGNING_KEY'], algorithm=settings.SIMPLE_JWT['ALGORITHM'])

        return access_token, refresh_token

    @staticmethod
    def verify_token(token, token_type='access'):
        try:
            payload = jwt.decode(token, settings.SIMPLE_JWT['SIGNING_KEY'],algorithms=['HS256'])
            if payload['type'] != token_type:
                raise jwt.InvalidTokenError('Invalid token type')
            return payload
        except jwt.ExpiredSignatureError:
            raise jwt.ExpiredSignatureError('Token has expired')
        except jwt.InvalidAlgorithmError:
            raise jwt.InvalidAlgorithmError('Invalid algorithm')
        except jwt.InvalidTokenError:
            raise jwt.InvalidTokenError('Invalid token')