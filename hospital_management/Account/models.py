from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
import pytz


class UserManager(BaseUserManager):
    def create_user(self, email, name, tc, role='Patient', license_number=None, timezone='UTC', password=None):
        """
        Creates and returns a new user with the given details.
        """
        if not email:
            raise ValueError("User must have an email address")
        if role == 'Doctor' and not license_number:
            raise ValueError("Doctors must provide a valid license number.")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            tc=tc,
            role=role,
            license_number=license_number,
            timezone=timezone
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, tc, password=None):
        """
        Creates and returns a superuser.
        """
        user = self.create_user(email, name, tc, role='Admin', password=password, timezone='UTC')
        user.is_active = True
        user.is_admin = True
        user.status = 'Active'
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """
    Custom User model with roles and timezones.
    """
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Doctor', 'Doctor'),
        ('Patient', 'Patient'),
    ]

    STATUS_CHOICES = [
        ('Inactive', 'Inactive'),
        ('Pending', 'Pending'),
        ('Active', 'Active'),
    ]

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=200)
    tc = models.BooleanField()
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Patient')
    license_number = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Inactive')
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    # New timezone field for all users
    timezone = models.CharField(
        max_length=50,
        choices=[(tz, tz) for tz in pytz.all_timezones],  # List of all timezones
        default='UTC'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'tc']

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin
