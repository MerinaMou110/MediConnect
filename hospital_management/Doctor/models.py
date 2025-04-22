from django.db import models
from django.conf import settings  # For using the custom User model
from Patient.models import Patient
from django.utils import timezone
import pytz
from django_countries.fields import CountryField
# Days of the Week Choices
DAYS_OF_WEEK = [
    ('Sunday', 'Sunday'),
    ('Monday', 'Monday'),
    ('Tuesday', 'Tuesday'),
    ('Wednesday', 'Wednesday'),
    ('Thursday', 'Thursday'),
    ('Friday', 'Friday'),
    ('Saturday', 'Saturday'),
]


class Specialization(models.Model):
    name = models.CharField(max_length=30)
    slug = models.SlugField(max_length=40, unique=True)
    icon = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name


class Designation(models.Model):
    name = models.CharField(max_length=30)
    slug = models.SlugField(max_length=40, unique=True)
    icon = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name


from django.core.exceptions import ValidationError

class AvailableTime(models.Model):
    doctor = models.ForeignKey(
        'Doctor',
        on_delete=models.CASCADE,
        related_name='available_times'
    )
    date = models.DateField()  # Doctor's specific available date
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)  # Prevents double booking

    class Meta:
        unique_together = ('doctor', 'date', 'start_time')

    def __str__(self):
        status = "Booked" if self.is_booked else "Available"
        return f"{self.date}: {self.start_time} - {self.end_time} ({status})"





class Doctor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_profile'
    )
    image = models.ImageField(upload_to="doctor/images/", blank=True, null=True)
    designation = models.ManyToManyField(Designation)
    specialization = models.ManyToManyField(Specialization)
    fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    clinic_address = models.TextField(blank=True, null=True)
    meet_link = models.URLField(max_length=200, blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    experience_years = models.PositiveIntegerField(default=0)
    qualifications = models.CharField(max_length=255, blank=True, null=True)
    languages_spoken = models.CharField(max_length=255, blank=True, null=True)
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.0,
        help_text="Calculated average rating based on reviews."
    )
    total_reviews = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True, null=True, help_text="Brief description about the doctor.")
    is_available = models.BooleanField(default=True)
    country = CountryField(blank_label='(Select Country)', blank=True, null=True)  # Country field added

    def __str__(self):
        return f"{self.user.name} ({', '.join(special.name for special in self.specialization.all())})"

    def calculate_average_rating(self):
        """Recalculate and update the average rating for the doctor based on reviews."""
        reviews = self.reviews.all()
        if reviews.exists():
            total_rating = sum(int(review.rating.count('⭐')) for review in reviews)
            self.average_rating = total_rating / reviews.count()
            self.total_reviews = reviews.count()
        else:
            self.average_rating = 0.0
            self.total_reviews = 0
        self.save()

    @property
    def timezone(self):
        """Fetch the timezone from the related User model."""
        return self.user.timezone if hasattr(self.user, 'timezone') else "UTC"



STAR_CHOICES = [
    ('⭐', '⭐'),
    ('⭐⭐', '⭐⭐'),
    ('⭐⭐⭐', '⭐⭐⭐'),
    ('⭐⭐⭐⭐', '⭐⭐⭐⭐'),
    ('⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'),
]


class Review(models.Model):
    reviewer = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="reviews")
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    rating = models.CharField(choices=STAR_CHOICES, max_length=10)

    def __str__(self):
        return f"Patient: {self.reviewer.user.name} | Doctor: Dr. {self.doctor.user.name}"
