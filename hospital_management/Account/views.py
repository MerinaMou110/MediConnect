from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import (
    SendPasswordResetEmailSerializer,
    UserChangePasswordSerializer,
    UserLoginSerializer,
    UserPasswordResetSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer
)
from django.contrib.auth import authenticate
from .renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from .models import User
from django.contrib.auth.tokens import default_token_generator
from rest_framework.generics import ListAPIView
from .tasks import send_email_task
# Generate Token Manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = serializer.create(serializer.validated_data)

        if response["msg"].startswith("Registration successful"):
            role = request.data.get("role", "Patient")
            if role == "Doctor":
                return Response({
                    'msg': 'Registration successful. Your account will be reviewed by the admin for approval. Please check your email.'
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'msg': 'Registration successful. Please check your email to activate your account.'
                }, status=status.HTTP_201_CREATED)
        return Response({'error': 'Registration failed'}, status=status.HTTP_400_BAD_REQUEST)

class ActivateAccountView(APIView):
    def get(self, request, uid, token):
        try:
            uid_decoded = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=uid_decoded)

            # Verify the token
            if not default_token_generator.check_token(user, token):
                return Response({'error': 'Invalid or Expired Token'}, status=status.HTTP_400_BAD_REQUEST)

            # Return a success message without activating
            return Response({
                'msg': 'Email verification link is valid. Please proceed with account activation.'
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({'error': 'Something went wrong.'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, uid, token):
        try:
            uid_decoded = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=uid_decoded)

            # Verify the token again
            if not default_token_generator.check_token(user, token):
                return Response({'error': 'Invalid or Expired Token'}, status=status.HTTP_400_BAD_REQUEST)

            if user.is_active:
                return Response({'msg': 'User is already activated.'}, status=status.HTTP_200_OK)

            # Activate account based on role
            if user.role == 'Doctor':
                user.is_active = True
                user.status = 'Pending'  # Doctor activation requires admin approval
                user.save()
                return Response({
                    'msg': 'Your email is verified. Your account is pending admin approval.'
                }, status=status.HTTP_200_OK)

            # Activate other roles immediately
            user.is_active = True
            user.status = 'Active'
            user.save()
            return Response({'msg': 'Account activated successfully.'}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({'error': 'Activation failed. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)
        

        
class UserLoginView(APIView):
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data['email']
        password = serializer.data['password']
        user = authenticate(email=email, password=password)

        if user:
            if not user.is_active:
                return Response({'error': 'Account is not activated. Check your email.'}, status=status.HTTP_403_FORBIDDEN)
            elif user.role == 'Doctor' and user.status == 'Pending':
                return Response({'error': 'Your account is pending admin approval.'}, status=status.HTTP_403_FORBIDDEN)

            token = get_tokens_for_user(user)

            # Include user details in the response
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
            }

            return Response({'token': token, 'user': user_data, 'msg': 'Login successful'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset link sent. Please check your email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset Successfully'}, status=status.HTTP_200_OK)

class UserListView(ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]  # Only admins can access

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        status = self.request.query_params.get('status', None)

        if role:
            queryset = queryset.filter(role=role)
        if status:
            queryset = queryset.filter(status=status)

        return queryset




class AdminApproveUserView(APIView):
    """
    Allows an admin to approve or reject a user's account.
    Only users with the 'is_admin' permission can access this view.
    """
    permission_classes = [IsAdminUser]

    def patch(self, request, format=None):
        user_id = request.data.get("user_id")
        status_update = request.data.get("status")  # 'Active' or 'Rejected'

        if not user_id or not status_update:
            return Response({
                "error": "Both 'user_id' and 'status' are required."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id, role="Doctor")  # Only approve/reject doctors

            # Ensure the user is in 'Pending' status before allowing update
            if user.status != "Pending":
                return Response({
                    "error": "Only pending doctors can be approved or rejected."
                }, status=status.HTTP_400_BAD_REQUEST)

            if status_update not in ["Active", "Rejected"]:
                return Response({
                    "error": "Invalid status. Only 'Active' or 'Rejected' are allowed."
                }, status=status.HTTP_400_BAD_REQUEST)

            # Update the status and activation based on the input
            user.status = status_update
            if status_update == "Active":
                user.is_active = True
                email_subject = "Your Account Has Been Approved"
                email_body = f"Hi {user.name}, your account has been approved and activated. You can now log in."
            else:  # If rejected, deactivate the account
                user.is_active = False
                email_subject = "Your Account Has Been Rejected"
                email_body = f"Hi {user.name}, unfortunately, your account has been rejected. If you have any questions, please contact support."

            user.save()

            # Send email notification using Celery
            email_data = {
                'subject': email_subject,
                'body': email_body,
                'to_email': user.email,
            }
            send_email_task.delay(email_data)

            msg = f"User with ID {user_id} has been {'approved' if status_update == 'Active' else 'rejected'}."
            return Response({"msg": msg}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                "error": "User not found or not a Doctor."
            }, status=status.HTTP_404_NOT_FOUND)
