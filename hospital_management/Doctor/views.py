from rest_framework import generics, permissions,serializers,status
from rest_framework.exceptions import PermissionDenied
from .models import Doctor, Specialization, Designation, AvailableTime, Review
from .serializers import (
    DoctorSerializer,
    DoctorPublicSerializer,  # Import the public serializer
    SpecializationSerializer,
    DesignationSerializer,
    AvailableTimeSerializer,
    ReviewSerializer,
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter
from .filters import DoctorFilter
from rest_framework.filters import OrderingFilter
from django.utils import timezone
import pytz
from .serializers import AvailableTimeSerializer
from datetime import datetime
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from datetime import datetime  # Ensure this is imported

# Public Views
# class SpecializationListView(generics.ListAPIView):
#     """
#     Any user can view the list of specializations.
#     """
#     queryset = Specialization.objects.all()
#     serializer_class = SpecializationSerializer
#     permission_classes = [permissions.AllowAny]


# class DesignationListView(generics.ListAPIView):
#     """
#     Any user can view the list of designations.
#     """
#     queryset = Designation.objects.all()
#     serializer_class = DesignationSerializer
#     permission_classes = [permissions.AllowAny]


# class AvailableTimeListView(generics.ListAPIView):
#     """
#     Any user can view the list of available times.
#     """
#     queryset = AvailableTime.objects.all().order_by('date', 'start_time')  # Order by date and start time
#     serializer_class = AvailableTimeSerializer
#     permission_classes = [permissions.AllowAny]


from rest_framework import generics, permissions
from .models import AvailableTime
from .serializers import AvailableTimeSerializer

class AvailableTimeListForDoctorView(generics.ListAPIView):
    serializer_class = AvailableTimeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        doctor_id = self.kwargs.get("doctor_id")
        date = self.request.query_params.get("date")

        if date:
            return AvailableTime.objects.filter(doctor_id=doctor_id, date=date).order_by('start_time')
        return AvailableTime.objects.filter(doctor_id=doctor_id).order_by('date', 'start_time')

    def get_serializer_context(self):
        """Pass request context to serializer for time zone conversion."""
        return {"request": self.request}


class DoctorPagination(PageNumberPagination):
    page_size = 10 # items per page
    page_size_query_param = page_size
    max_page_size = 100

from django_filters import rest_framework as filters

class DoctorFilter(filters.FilterSet):
    designation = filters.CharFilter(field_name='designation__slug', lookup_expr='icontains')
    specialization = filters.CharFilter(field_name='specialization__slug', lookup_expr='icontains')

    class Meta:
        model = Doctor
        fields = ['designation', 'specialization']

class DoctorListView(generics.ListAPIView):
    """
    Any user can view the list of doctors.
    For public view, use DoctorPublicSerializer.
    """
    queryset = Doctor.objects.all().order_by('user__name')  # Order by doctor's name
    serializer_class = DoctorPublicSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DoctorFilter
    pagination_class = DoctorPagination
    search_fields = ['user__name', 'specialization__name', 'designation__name']
    ordering_fields = ['user__name', 'specialization__name']
    ordering = ['user__name']  # Default sorting by name



class DoctorDetailView(generics.RetrieveAPIView):
    """
    Any user can view the details of a specific doctor by ID.
    For public view, use DoctorPublicSerializer.
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorPublicSerializer  # Use the public serializer for doctor details
    permission_classes = [permissions.AllowAny]
    lookup_field = 'pk'  # Fetch doctor by ID



class ReviewListView(generics.ListAPIView):
    """
    Any user can view the list of reviews for doctors.
    """
    queryset = Review.objects.all().order_by('-created')  # Order by latest reviews first
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]


class ReviewCreateView(generics.CreateAPIView):
    """
    Patients can submit reviews for doctors after completing an appointment.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Attach the logged-in patient as the reviewer before saving."""
        serializer.save(reviewer=self.request.user.patient_profile)

# Specialization Views
class SpecializationAdminView(generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    """
    Admins can create, update, or delete specializations.
    Users can retrieve a list of specializations.
    """
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]  # Anyone can view the list
        return [permissions.IsAdminUser()]  # Only Admins can create, update, delete


# Designation Views
class DesignationAdminView(generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    """
    Admins can create, update, or delete designations.
    Users can retrieve a list of designations.
    """
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]  # Anyone can view the list
        return [permissions.IsAdminUser()]  # Only Admins can create, update, delete


from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied


class DoctorProfileView(generics.RetrieveUpdateAPIView, generics.CreateAPIView):
    """
    Doctors can:
    - View their profile (GET)
    - Create their profile after login (POST)
    - Update their profile (PATCH) (except ratings & reviews)
    """
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user

        if user.role != 'Doctor':
            raise PermissionDenied("You are not authorized to access this profile.")

        # Get or create doctor profile
        doctor_profile, created = Doctor.objects.get_or_create(user=user)
        return doctor_profile

    def post(self, request, *args, **kwargs):
        """Create a doctor profile if it doesn't exist."""
        user = request.user

        if user.role != 'Doctor':
            return Response({"detail": "You are not authorized to create a doctor profile."}, status=status.HTTP_403_FORBIDDEN)

        # Check if the profile already exists
        if Doctor.objects.filter(user=user).exists():
            return Response({"detail": "Doctor profile already exists."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)







# Create, Update, and Delete Available Time Slot Views
from django.utils import timezone
import pytz
from rest_framework import generics, permissions, serializers
from .models import AvailableTime, Doctor
from .serializers import AvailableTimeSerializer
from datetime import datetime, date
from .models import Doctor, AvailableTime


from rest_framework import generics, permissions
from .models import AvailableTime
from .serializers import AvailableTimeSerializer

class AvailableTimeListView(generics.ListAPIView):
    """
    List all available time slots for the logged-in doctor.
    """
    serializer_class = AvailableTimeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get the current doctor
        doctor = Doctor.objects.get(user=self.request.user)
        # Return only the available times for this doctor
        return AvailableTime.objects.filter(doctor=doctor)


class AvailableTimeCreateView(generics.CreateAPIView):
    """
    Doctors can create their available time slots. 
    Times are stored in UTC but displayed in the doctor's timezone.
    """
    serializer_class = AvailableTimeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Get the logged-in doctor
        try:
            doctor = Doctor.objects.get(user=self.request.user)
        except Doctor.DoesNotExist:
            raise serializers.ValidationError("Doctor profile not found for this user.")

        doctor_timezone = pytz.timezone(doctor.user.timezone)  # Get doctor's timezone

        # Extract start_time and end_time from the request data
        start_time_str = self.request.data.get("start_time")  # e.g., "9:00 AM"
        end_time_str = self.request.data.get("end_time")  # e.g., "9:30 AM"

        if not start_time_str or not end_time_str:
            raise serializers.ValidationError("Start time and end time are required.")

        try:
            # Convert from 12-hour format to datetime object (still naive)
            start_time = datetime.strptime(start_time_str, "%I:%M %p").time()
            end_time = datetime.strptime(end_time_str, "%I:%M %p").time()
        except ValueError:
            raise serializers.ValidationError("Invalid time format. Use 'HH:MM AM/PM' (e.g., '9:00 AM').")

        # ✅ Convert to full datetime in doctor's timezone
        today_local = timezone.now().astimezone(doctor_timezone).date()  
        start_datetime_local = doctor_timezone.localize(datetime.combine(today_local, start_time))
        end_datetime_local = doctor_timezone.localize(datetime.combine(today_local, end_time))

        # ✅ Convert to UTC before saving
        start_time_utc = start_datetime_local.astimezone(pytz.utc).time()
        end_time_utc = end_datetime_local.astimezone(pytz.utc).time()

        print(f"📅 Doctor Local Time: {start_datetime_local}, {end_datetime_local}")
        print(f"🌎 Converted to UTC: {start_time_utc}, {end_time_utc}")

        serializer.save(doctor=doctor, start_time=start_time_utc, end_time=end_time_utc)




class AvailableTimeUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """
    Doctors can update or delete their available time slots.
    """
    serializer_class = AvailableTimeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        doctor = Doctor.objects.get(user=user)
        return AvailableTime.objects.filter(doctor=doctor)

    def perform_update(self, serializer):
        """Ensure only the correct doctor updates their time slot and correctly save the time."""
        user = self.request.user
        doctor = Doctor.objects.get(user=user)

        if serializer.instance.doctor != doctor:
            raise PermissionDenied("You are not authorized to update this time slot.")

        # Get current instance
        instance = serializer.instance
        doctor_timezone = pytz.timezone(doctor.user.timezone)  # Get doctor's timezone

        # Convert times from AM/PM format to UTC before saving
        start_time_str = self.request.data.get("start_time")
        end_time_str = self.request.data.get("end_time")

        if start_time_str:
            try:
                start_time = datetime.strptime(start_time_str, "%I:%M %p").time()
                today_local = timezone.now().astimezone(doctor_timezone).date()
                start_datetime_local = doctor_timezone.localize(datetime.combine(today_local, start_time))
                instance.start_time = start_datetime_local.astimezone(pytz.utc).time()  # Convert to UTC
            except ValueError:
                raise serializers.ValidationError("Invalid time format. Use 'HH:MM AM/PM'.")

        if end_time_str:
            try:
                end_time = datetime.strptime(end_time_str, "%I:%M %p").time()
                today_local = timezone.now().astimezone(doctor_timezone).date()
                end_datetime_local = doctor_timezone.localize(datetime.combine(today_local, end_time))
                instance.end_time = end_datetime_local.astimezone(pytz.utc).time()  # Convert to UTC
            except ValueError:
                raise serializers.ValidationError("Invalid time format. Use 'HH:MM AM/PM'.")

        # Save the instance
        instance.save()


    def perform_destroy(self, instance):
        user = self.request.user
        doctor = Doctor.objects.get(user=user)
        if instance.doctor != doctor:
            raise PermissionDenied("You are not authorized to delete this time slot.")
        instance.delete()