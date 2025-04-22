from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings
from Patient.models import Patient
from Doctor.models import Doctor, AvailableTime

# Appointment Status Choices
APPOINTMENT_STATUS = [
    ('Pending', 'Pending'),
    ('Confirmed', 'Confirmed'),
    ('Cancelled', 'Cancelled'),
    ('Completed', 'Completed'),
]

# Appointment Type Choices
APPOINTMENT_TYPE = [
    ('Online', 'Online'),
    ('Offline', 'Offline'),
]

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments")
    available_time = models.ForeignKey(AvailableTime, on_delete=models.CASCADE, related_name="appointments")
    symptoms = models.TextField(blank=True, null=True)  # Patient symptoms
    appointment_type = models.CharField(choices=APPOINTMENT_TYPE, max_length=10, default='Offline')
    status = models.CharField(choices=APPOINTMENT_STATUS, max_length=10, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment: {self.patient.user.name} with {self.doctor.user.name} on {self.available_time.date} at {self.available_time.start_time} ({self.appointment_type})"
