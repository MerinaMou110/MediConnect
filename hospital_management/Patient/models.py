from django.db import models
# from Doctor.models import Doctor
# Create your models here.
from django.conf import settings

class Patient(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # References the custom User model
        on_delete=models.CASCADE,
        related_name='patient_profile',
    )
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')],
        default='Other',
    )
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    emergency_contact_name = models.CharField(max_length=200, null=True, blank=True)
    emergency_contact_number = models.CharField(max_length=15, null=True, blank=True)
    medical_history = models.TextField(null=True, blank=True)  # Details about medical history
    allergies = models.TextField(null=True, blank=True)  # Details about allergies
    blood_group = models.CharField(
        max_length=3,
        choices=[('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), 
                 ('O+', 'O+'), ('O-', 'O-'), ('AB+', 'AB+'), ('AB-', 'AB-')],
        null=True,
        blank=True,
    )
    image = models.ImageField(upload_to='patient_profiles/', null=True, blank=True)  # ✅ Add Profile Picture
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Patient Profile - {self.user.email}"
    def is_complete(self):
        """Check if the patient profile has required fields filled."""
        return all([
            self.date_of_birth,
            self.gender,
            self.phone_number,
            self.address,
            self.emergency_contact_name,
            self.emergency_contact_number,
            self.blood_group
        ])




class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medical_records")
    doctor = models.ForeignKey("Doctor.Doctor", on_delete=models.SET_NULL, null=True, related_name="medical_records")  # Use string reference
    visit_date = models.DateTimeField(auto_now_add=True)
    diagnosis = models.TextField()
    prescriptions = models.TextField()
    test_results = models.TextField(blank=True, null=True)
    additional_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Record for {self.patient.user.name} by Dr. {self.doctor.user.name} on {self.visit_date.strftime('%Y-%m-%d')}"