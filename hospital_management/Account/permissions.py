from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "Admin"

class IsDoctor(permissions.BasePermission):
    """
    Allows access only to doctors.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "Doctor"

class IsPatient(permissions.BasePermission):
    """
    Allows access only to patients.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "Patient"
