from django.urls import path
from .views import SendPasswordResetEmailView, UserChangePasswordView, UserLoginView, UserProfileView, UserRegistrationView, UserPasswordResetView, ActivateAccountView, UserListView,AdminApproveUserView
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('admin/approve/', AdminApproveUserView.as_view(), name='admin-approve-user'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('activate/<uid>/<token>/', ActivateAccountView.as_view(), name='activate-account'),
    path('user-list/', UserListView.as_view(), name='user-list'),
]