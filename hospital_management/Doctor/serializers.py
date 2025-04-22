from rest_framework import serializers
from .models import Doctor, Specialization, Designation, AvailableTime, Review
from Appointment.models import Appointment
from rest_framework.exceptions import ValidationError
from datetime import datetime

import pytz  #
class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name', 'slug', 'icon']


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = ['id', 'name', 'slug', 'icon']

from django.utils.timezone import make_aware
import pytz
from django.utils import timezone 


class AvailableTimeSerializer(serializers.ModelSerializer):

    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = AvailableTime
        fields = ['id', 'date', 'start_time', 'end_time', 'is_booked']

    def get_start_time(self, obj):
        return self.format_time(obj.start_time, obj.doctor.user.timezone)

    def get_end_time(self, obj):
        return self.format_time(obj.end_time, obj.doctor.user.timezone)

    def format_time(self, time_obj, doctor_timezone):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            patient_timezone = request.user.timezone  
        else:
            patient_timezone = 'UTC'  

        doctor_tz = pytz.timezone(doctor_timezone)
        patient_tz = pytz.timezone(patient_timezone)

        today = timezone.now().astimezone(doctor_tz).date()
        doctor_datetime = doctor_tz.localize(datetime.combine(today, time_obj))
        patient_datetime = doctor_datetime.astimezone(patient_tz)

        return patient_datetime.strftime("%I:%M %p") 



class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.user.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'doctor', 'body', 'created', 'rating', 'reviewer_name', 'doctor_name']
        read_only_fields = ['reviewer']  # Make 'reviewer' field read-only

    def validate(self, data):
        """Ensure that only patients can leave a review after a completed appointment."""
        user = self.context['request'].user

        # Ensure user is a patient
        if user.role != 'Patient':
            raise ValidationError("Only patients can submit reviews.")

        # Ensure patient has additional profile info
        if not hasattr(user, 'patient_profile') or not user.patient_profile.is_complete():
            raise ValidationError("You must complete your profile before reviewing a doctor.")

        # Ensure patient has a completed appointment with the doctor
        doctor = data['doctor']
        completed_appointments = Appointment.objects.filter(
            patient=user.patient_profile,
            doctor=doctor,
            status='Completed'
        )

        if not completed_appointments.exists():
            raise ValidationError("You can only review doctors after completing an appointment.")

        # Prevent duplicate reviews for the same doctor
        if Review.objects.filter(reviewer=user.patient_profile, doctor=doctor).exists():
            raise ValidationError("You have already reviewed this doctor.")

        return data


    def create(self, validated_data):
        """Automatically assign the logged-in patient as the reviewer."""
        user = self.context['request'].user
        validated_data['reviewer'] = user.patient_profile  # Assign patient profile
        return super().create(validated_data)






class DoctorSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', required=False)
    user_email = serializers.EmailField(source='user.email', required=False)
    designation = serializers.PrimaryKeyRelatedField(queryset=Designation.objects.all(), many=True)
    specialization = serializers.PrimaryKeyRelatedField(queryset=Specialization.objects.all(), many=True)
    available_times = AvailableTimeSerializer(many=True, read_only=True)
    license_number = serializers.CharField(source='user.license_number', read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    country = serializers.CharField(source='country.name', required=False, allow_null=True)
    timezone = serializers.CharField(source='user.timezone', required=False, allow_null=True)

    # 🚨 Make these fields read-only to prevent self-editing
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2, read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Doctor
        exclude = ['user']

    def update(self, instance, validated_data):
        """Update doctor profile but prevent modification of ratings."""
        user_data = validated_data.pop('user', None)  # Handle user fields separately

        if isinstance(user_data, dict):
            user = instance.user
            if 'name' in user_data:
                user.name = user_data['name']
            if 'email' in user_data:
                user.email = user_data['email']
            if 'timezone' in user_data:
                user.timezone = user_data['timezone']
            user.save()

        return super().update(instance, validated_data)







from datetime import datetime
import pytz
from rest_framework import serializers
from .models import Doctor, AvailableTime

class DoctorPublicSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)  # Include doctor name
    designation = DesignationSerializer(many=True, read_only=True)  # Show names, not IDs
    specialization = SpecializationSerializer(many=True, read_only=True)  # Show names, not IDs
    available_times = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            'id', 'user_name', 'image', 'designation', 'specialization', 'available_times',
            'fee', 'clinic_address', 'meet_link', 'contact_number', 'languages_spoken',
            'average_rating', 'total_reviews'
        ]

    def get_available_times(self, obj):
        request = self.context.get('request')
        if not request:
            return None

        # 🌍 Default timezone is "Asia/Dhaka" for unauthenticated users
        patient_timezone = "Asia/Dhaka"
        if request.user.is_authenticated and request.user.timezone:
            patient_timezone = request.user.timezone

        timezone_obj = pytz.timezone(patient_timezone)

        available_times = obj.available_times.all()
        formatted_times = []

        for time in available_times:
            # ✅ Combine `date` with `start_time` and `end_time` to create full datetime objects
            start_time_utc = pytz.utc.localize(datetime.combine(time.date, time.start_time))
            end_time_utc = pytz.utc.localize(datetime.combine(time.date, time.end_time))

            # Convert to user's timezone (or Asia/Dhaka if not logged in)
            start_time_user = start_time_utc.astimezone(timezone_obj)
            end_time_user = end_time_utc.astimezone(timezone_obj)

            formatted_times.append({
                "date": time.date.strftime("%Y-%m-%d"),  # Keep date separate
                "start_time": start_time_user.strftime("%I:%M %p"),  # Convert to AM/PM format
                "end_time": end_time_user.strftime("%I:%M %p"),
                "is_booked": time.is_booked
            })

        return formatted_times
