from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import Patient,MedicalRecord

from rest_framework.exceptions import PermissionDenied
from Account.permissions import IsAdmin, IsDoctor, IsPatient

from Appointment.tasks import  send_medical_record_pdf
from Appointment.models import Appointment
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Patient
from .serializers import PatientSerializer,MedicalRecordSerializer

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.core.files.storage import default_storage

from rest_framework.views import APIView
from django.core.exceptions import PermissionDenied
from .models import MedicalRecord
from django.http import FileResponse
from reportlab.lib.pagesizes import letter


class PatientListView(generics.ListAPIView):
    """
    View for listing all patients. Accessible by authorized users only.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]


class PatientDetailView(generics.RetrieveUpdateAPIView):
    """
    View for retrieving or updating a single patient's details.
    Only the patient or admin can update the profile.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow patients to see only their profile or admins to access all profiles
        user = self.request.user
        if user.is_admin:
            return Patient.objects.all()
        return Patient.objects.filter(user=user)
    



from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.core.files.storage import default_storage
from .models import Patient
from .serializers import PatientSerializer

class PatientProfileView(generics.RetrieveUpdateAPIView):
    """
    Allows a patient to:
    - View their own profile
    - Create their profile if it doesn't exist
    - Update their profile information, including name, email, and profile picture
    """
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user

        # Ensure the user is a Patient
        if user.role != 'Patient':
            raise PermissionDenied("You are not authorized to access this profile.")
        
        # Get or create the patient's profile linked to the logged-in user
        patient, created = Patient.objects.get_or_create(user=user)
        return patient

    def patch(self, request, *args, **kwargs):
        """Handle partial updates, including profile picture resizing."""
        patient = self.get_object()

        # Handle profile picture upload and resizing
        if 'image' in request.FILES:
            # If the patient already has a profile picture, delete the old one first
            if patient.image and default_storage.exists(patient.image.name):
                default_storage.delete(patient.image.name)
            
            # Assign the new image
            patient.image = request.FILES['image']
            patient.save()

        return super().patch(request, *args, **kwargs)


class EMRListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctor | IsAdmin | IsPatient]

    def get_queryset(self):
        user = self.request.user
        if user.role == "Doctor":
            return MedicalRecord.objects.filter(doctor__user=user)
        elif user.role == "Patient":
            return MedicalRecord.objects.filter(patient__user=user)
        elif user.role == "Admin":
            return MedicalRecord.objects.all()
        return MedicalRecord.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != "Doctor":
            raise PermissionDenied("Only doctors can create medical records.")
        
        doctor = user.doctor_profile
        patient = serializer.validated_data["patient"]

        # Check if an appointment exists & is completed
        if not Appointment.objects.filter(patient=patient, doctor=doctor, status="Completed").exists():
            raise PermissionDenied("You can only add records after a completed appointment.")
        
        record = serializer.save(doctor=doctor)

        # Trigger Celery task to send medical record as a PDF
        send_medical_record_pdf.delay(
            patient_email=record.patient.user.email,
            doctor_name=doctor.user.name,
            diagnosis=record.diagnosis,
            visit_date=str(record.visit_date),
            prescriptions=record.prescriptions,  # ✅ Add prescriptions
            test_results=record.test_results,    # ✅ Add test results
            additional_notes=record.additional_notes,  # ✅ Add additional notes
            record_id=record.id
        )

from django.http import FileResponse
import io
from reportlab.pdfgen import canvas

class MedicalRecordPDFView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPatient]

    def get(self, request, pk):
        record = MedicalRecord.objects.get(pk=pk, patient__user=request.user)

        # Generate PDF in-memory
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        c.drawString(100, 750, f"Medical Record")
        c.drawString(100, 730, f"Doctor: {record.doctor.user.name}")
        c.drawString(100, 710, f"Diagnosis: {record.diagnosis}")
        c.drawString(100, 690, f"Visit Date: {record.visit_date}")
        c.save()

        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f"medical_record_{record.id}.pdf")

from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer

class EMRDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    - Patients can only view their own records.
    - Doctors can modify or delete only their created records.
    - Admins have full access.
    """
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "Doctor":
            return MedicalRecord.objects.filter(doctor__user=user).select_related("doctor", "patient")
        elif user.role == "Patient":
            return MedicalRecord.objects.filter(patient__user=user).select_related("doctor", "patient")
        elif user.role == "Admin":
            return MedicalRecord.objects.all().select_related("doctor", "patient")
        
        return MedicalRecord.objects.none()

    def perform_update(self, serializer):
        """
        - Restricts updates: Doctors can only update records they created.
        - Sends an email to the patient when their record is updated.
        """
        instance = self.get_object()
        user = self.request.user

        if user.role == "Doctor" and instance.doctor.user != user:
            raise PermissionDenied("Doctors can only update their own records.")
        if user.role == "Patient":
            raise PermissionDenied("Patients are not allowed to update records.")

        updated_record = serializer.save()

        # Send email notification with is_update=True
        send_medical_record_pdf.delay(
            patient_email=updated_record.patient.user.email,
            doctor_name=updated_record.doctor.user.name,
            diagnosis=updated_record.diagnosis,
            visit_date=str(updated_record.visit_date),
            prescriptions=updated_record.prescriptions,
            test_results=updated_record.test_results,
            additional_notes=updated_record.additional_notes,
            record_id=updated_record.id,
            is_update=True  # ✅ Mark email as an update
        )


    def perform_destroy(self, instance):
        """
        Restricts deletion:
        - Doctors can only delete records they created.
        - Patients cannot delete records.
        - Admins have full access.
        """
        user = self.request.user

        if user.role == "Doctor" and instance.doctor.user != user:
            raise PermissionDenied("Doctors can only delete their own records.")
        if user.role == "Patient":
            raise PermissionDenied("Patients are not allowed to delete records.")

        instance.delete()
