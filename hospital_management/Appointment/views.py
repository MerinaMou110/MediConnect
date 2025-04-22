from django.shortcuts import render
from rest_framework import serializers
# Create your views here.
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Appointment, AvailableTime
from Doctor.models import Doctor,AvailableTime
from .serializers import AppointmentSerializer
from rest_framework.views import APIView
from .tasks import send_appointment_confirmation  # Import the new task
from rest_framework.exceptions import PermissionDenied
from .models import Appointment
from Account.permissions import IsDoctor

class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        user = self.request.user  

        if not hasattr(user, 'patient_profile'):
            raise PermissionDenied("Only patients can book appointments.")

        doctor_id = self.request.data.get("doctor_id")
        available_time_id = self.request.data.get("available_time_id")

        try:
            doctor = Doctor.objects.get(id=doctor_id)
            available_time = AvailableTime.objects.get(id=available_time_id, doctor=doctor)
        except Doctor.DoesNotExist:
            raise serializers.ValidationError({"doctor_id": "Doctor not found."})
        except AvailableTime.DoesNotExist:
            raise serializers.ValidationError({"available_time_id": "Available time slot not found for this doctor."})

        if available_time.is_booked:
            raise serializers.ValidationError({"available_time_id": "This time slot is already booked."})

        available_time.is_booked = True
        available_time.save()

        appointment = serializer.save(
            patient=user.patient_profile, 
            doctor=doctor,
            available_time=available_time, 
            status="Confirmed"
        )

        send_appointment_confirmation.delay(appointment.id)


class CompleteAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        print(f"🔍 DEBUG: User ID {request.user.id} Role: {request.user.role}")

        if not hasattr(request.user, "doctor_profile"):
            print("❌ DEBUG: User is not a doctor")
            return Response({"error": "Only doctors can complete appointments."}, status=403)

        doctor = request.user.doctor_profile
        print(f"✅ DEBUG: Doctor ID {doctor.id} is making the request")
        
        try:
            appointment = Appointment.objects.get(pk=pk, doctor=doctor)
        except Appointment.DoesNotExist:
            print("❌ DEBUG: Appointment not found or unauthorized")
            return Response({"error": "Appointment not found or unauthorized"}, status=404)

        if appointment.status == "Completed":
            print("⚠️ DEBUG: Appointment is already completed.")
            return Response({"message": "Appointment is already completed."}, status=400)

        appointment.status = "Completed"
        appointment.save()
        print("✅ DEBUG: Appointment marked as completed.")
        return Response({"message": "Appointment marked as completed."}, status=200)


class PatientAppointmentListView(generics.ListAPIView):
    """
    List all appointments for the logged-in patient.
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user.patient)
