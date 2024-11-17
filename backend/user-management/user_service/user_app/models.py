from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser
from django.utils import timezone
from organization_app.models import Organization

# Create your models here.
class MyAccountManager(BaseUserManager):
    def create_user(self, username, fullname, email, phone_number=None, password=None, role='user', organization=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            fullname=fullname,
            phone_number=phone_number,
            role=role,
            organization=organization
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, fullname, email, phone_number=None, password=None):
        user = self.create_user(
            username=username,
            fullname=fullname,
            email=email,
            phone_number=phone_number,
            password=password,
            role='admin',
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superadmin = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser):
    USER_ROLES = [
        ('user', 'User'),
        ('hoster', 'Hoster'),
        ('admin', 'Admin'),
    ]

    username = models.CharField(max_length=50, unique=True, blank=True, null=True)
    fullname = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    google_userid = models.CharField(max_length=50, unique=True, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    password = models.CharField(max_length=128)
    
    profile_picture = models.CharField(max_length=255, blank=True, null=True)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(auto_now=True)
    role = models.CharField(max_length=10, choices=USER_ROLES, default='user')

    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superadmin = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'fullname']

    objects = MyAccountManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

