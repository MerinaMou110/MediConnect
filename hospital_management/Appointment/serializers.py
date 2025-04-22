from rest_framework import serializers
from .models import Appointment
from .models import Appointment

from django.utils.timezone import make_aware
import pytz
from rest_framework import serializers
from .models import Appointment, AvailableTime
from django.utils import timezone
import pytz

from datetime import datetime

class AppointmentSerializer(serializers.ModelSerializer):
    appointment_time = serializers.SerializerMethodField()
    doctor_id = serializers.IntegerField(write_only=True)
    available_time_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'doctor_id', 'available_time', 'available_time_id', 
                  'symptoms', 'appointment_type', 'status', 'appointment_time']
        read_only_fields = ['patient', 'doctor', 'available_time']

    def get_appointment_time(self, obj):
        request = self.context.get('request', None)
        patient_timezone = request.user.timezone if request and request.user.is_authenticated else 'UTC'
        timezone_obj = pytz.timezone(patient_timezone)

        stored_time = obj.available_time.start_time
        appointment_date = obj.available_time.date  
        start_time_utc = pytz.utc.localize(datetime.combine(appointment_date, stored_time))
        converted_time = start_time_utc.astimezone(timezone_obj)

        return converted_time.strftime("%I:%M %p")  

    def validate_available_time_id(self, value):
        try:
            available_time = AvailableTime.objects.get(id=value)
            if available_time.is_booked:
                raise serializers.ValidationError("This time slot has already been booked.")

            if Appointment.objects.filter(available_time=available_time).exists():
                raise serializers.ValidationError("This time slot has already been booked.")
        except AvailableTime.DoesNotExist:
            raise serializers.ValidationError("Available time slot not found.")
        return value

