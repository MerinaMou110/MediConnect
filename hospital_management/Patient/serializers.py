from rest_framework import serializers
from .models import Patient


from rest_framework import serializers
from .models import Patient

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Patient

User = get_user_model()

from rest_framework import serializers
from .models import Patient
from django.core.files.base import ContentFile
from PIL import Image
from io import BytesIO

from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', required=False)  
    user_email = serializers.EmailField(source='user.email', required=False)
    user_timezone = serializers.CharField(source='user.timezone', required=False)  
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'user_name', 'user_email', 'user_timezone', 'date_of_birth', 
            'gender', 'phone_number', 'address', 'emergency_contact_name', 
            'emergency_contact_number', 'medical_history', 'allergies', 
            'blood_group', 'image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_image(self, value):
        """Validate that uploaded file is an image."""
        try:
            img = Image.open(value)
            img.verify()  # Verify the image
        except Exception:
            raise serializers.ValidationError("Invalid image file.")
        return value

    def create(self, validated_data):
        """Create a new patient profile."""
        user = self.context['request'].user  

        if Patient.objects.filter(user=user).exists():
            raise serializers.ValidationError("Profile already exists.")

        validated_data['user'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Allow updating name, email, timezone, and profile info."""
        user_data = validated_data.pop('user', {})

        if isinstance(user_data, dict):
            user = instance.user
            if 'name' in user_data:
                user.name = user_data['name']
            if 'email' in user_data:
                user.email = user_data['email']
            if 'timezone' in user_data:
                user.timezone = user_data['timezone']
            user.save()

        # Handle image resizing if an image is provided
        if 'image' in validated_data:
            validated_data['image'] = self.resize_image(validated_data['image'])

        return super().update(instance, validated_data)

    def resize_image(self, image):
        """Resize profile image before saving."""
        try:
            img = Image.open(image)
            img = img.convert("RGB")  # Convert to RGB to avoid issues with some formats
            img.thumbnail((300, 300))  # Resize to max 300x300

            # Extract image name and extension
            image_name, image_ext = image.name.rsplit('.', 1)
            image_ext = image_ext.lower()

            # Save in the same format as uploaded
            img_format = "JPEG" if image_ext in ["jpg", "jpeg"] else "PNG"
            new_image_name = f"{image_name}_resized.{image_ext}"

            img_io = BytesIO()
            img.save(img_io, format=img_format, quality=90)
            return ContentFile(img_io.getvalue(), name=new_image_name)
        except Exception:
            raise serializers.ValidationError("Failed to process image.")



from rest_framework import serializers
from .models import MedicalRecord

class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.user.name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.user.name", read_only=True)

    class Meta:
        model = MedicalRecord
        fields = ["id", "patient", "patient_name", "doctor", "doctor_name", "visit_date", "diagnosis", "prescriptions", "test_results", "additional_notes"]
