from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from organization_app.models import Organization


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'fullname', 'email', 'phone_number', 'role', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            fullname=validated_data['fullname'],
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number', None),
            role=validated_data.get('role'),
            password=validated_data['password']
        )
        return user
    def validate_password(self, value):
        """
        Hash the password before storing it in the session.
        """
        return make_password(value)
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
class GoogleAuthSerializer(serializers.ModelSerializer ):
    class Meta:
        model = CustomUser
        fields = ['google_userid', 'fullname', 'email', 'role']

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    def validate_google_userid(self, value):
        if CustomUser.objects.filter(google_userid=value).exists():
            raise serializers.ValidationError("Google account already exists.")
        return value  

class Userserializer(serializers.ModelSerializer):
    # email = serializers.EmailField()
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser   # Specify the model you're working with
        fields = ['username', 'password']  # Define the fields you want to include

    def validate(self, data):
        username = data.get('username').strip()
        password = data.get('password').strip()

        if not username or not password:
            raise serializers.ValidationError('Both email and password are required')
        
        try:
            # Attempt to retrieve the user by username
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            # Return an error if the user does not exist
            raise serializers.ValidationError("Invalid username or password.")

        if not user:
            raise serializers.ValidationError('Invalid username')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is inactive')
        
        user = authenticate(username = username, password=password)

        if user is None:
            raise serializers.ValidationError('Invalid password')
        
        data['user'] = user
        return data
    

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'address', 'created_at', 'updated_at']
    
class UserRetrieveSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    has_password = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'fullname', 'email', 'google_userid', 'phone_number',
            'profile_picture', 'date_joined', 'last_login', 'role', 'organization', 
            'is_active', 'is_staff', 'is_admin', 'is_superadmin', 'has_password'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'is_admin', 'is_superadmin']
    
    def get_has_password(self, obj):
        return bool(obj.password)

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    enteredOtp = serializers.CharField(max_length=6, min_length=6)
    
    def validate_enteredOtp(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("OTP must be numeric.")
        return value
    
class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()