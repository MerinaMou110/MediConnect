from rest_framework import serializers
from .models import User
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .utils import Util
from django.contrib.auth.tokens import default_token_generator
from .tasks import send_email_task  # Import Celery task
import pytz

# User Registration Serializer
class UserRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(max_length=200)
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    tc = serializers.BooleanField()
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
    license_number = serializers.CharField(max_length=50, required=False)
    timezone = serializers.ChoiceField(choices=[(tz, tz) for tz in pytz.all_timezones])  # Make timezone required

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Password and Confirm Password do not match.")
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("User with this email already exists.")

        # Additional validation for doctors
        if attrs['role'] == 'Doctor' and not attrs.get('license_number'):
            raise serializers.ValidationError("Doctors must provide a valid medical license number.")
        return attrs

    def create(self, validated_data):
        email = validated_data['email']
        name = validated_data['name']
        password = validated_data['password']
        tc = validated_data['tc']
        role = validated_data['role']
        license_number = validated_data.get('license_number')
        timezone = validated_data['timezone']  # Ensure timezone is required

        # Create user
        user = User.objects.create_user(
            email=email,
            name=name,
            password=password,
            tc=tc,
            role=role,
            license_number=license_number,
            timezone=timezone  # Assign timezone to user during creation
        )
        user.save()

        # Generate activation token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.id))
        activation_link = f"http://localhost:5173/activate/{uid}/{token}"  # ✅ Correct



        # Send email based on role
        if role == 'Doctor':
            body = (
                f"Hi {name}, use the link below to verify your email:\n{activation_link}\n"
                "Your account will require admin approval after activation."
            )
        else:
            body = f"Hi {name}, use the link below to verify your email:\n{activation_link}"

        data = {'subject': 'Activate Your Account', 'body': body, 'to_email': email}
        send_email_task.delay(data)  # Use Celery

        return {"msg": "Registration successful. Please check your email to activate your account."}



# User Activation Serializer
class UserActivationSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()

    def validate(self, attrs):
        try:
            uid = smart_str(urlsafe_base64_decode(attrs['uid']))
            user = User.objects.get(id=uid)

            # Check if the token is valid
            if not default_token_generator.check_token(user, attrs['token']):
                raise serializers.ValidationError("Invalid or expired token.")

            # If user is a doctor, set status to 'Pending' for admin approval
            if user.role == 'Doctor':
                user.status = 'Pending'  # Requires admin approval
                user.save()

                # Send email notification for admin approval
                email_data = {
                    'subject': 'Your Account is Pending Admin Approval',
                    'body': f"Hi {user.name}, your email has been verified. Your account is now awaiting admin approval. "
                            "You will be notified once your account is reviewed.",
                    'to_email': user.email,
                }
                send_email_task.delay(email_data)

                return {"msg": "Your account is pending admin approval. You will be notified once approved."}

            # For other users, activate account immediately
            user.status = 'Active'
            user.is_active = True
            user.save()

            # Send Welcome Email
            welcome_email = {
                'subject': 'Welcome to Our Platform',
                'body': f"Hi {user.name}, welcome! Your account has been activated successfully.",
                'to_email': user.email,
            }
            send_email_task.delay(welcome_email)

            return {"msg": "Your account has been activated. You can now log in."}

        except DjangoUnicodeDecodeError:
            raise serializers.ValidationError("Invalid token.")
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")


# User Login Serializer
class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        fields = ['email', 'password']


# User Profile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'status']


# User Change Password Serializer
class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password do not match.")
        user.set_password(password)
        user.save()
        return attrs


# Send Password Reset Email Serializer
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            link = f"http://127.0.0.1:5501/reset_pass.html?uid={uid}&token={token}"

            # Send email
            body = f"Click the following link to reset your password: {link}"
            data = {
                'subject': 'Reset Your Password',
                'body': body,
                'to_email': user.email,
            }
            send_email_task.delay(data)
            return attrs
        else:
            raise serializers.ValidationError("You are not a registered user.")


# User Password Reset Serializer
class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != password2:
                raise serializers.ValidationError("Password and Confirm Password do not match.")
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError("Token is not valid or expired.")
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError:
            raise serializers.ValidationError("Token is not valid or expired.")
