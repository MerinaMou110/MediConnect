from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserModelAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model
    list_display = ('id', 'email', 'name', 'role', 'tc', 'license_number', 'timezone','is_admin', 'is_active', 'status')  # Added 'status'
    list_filter = ('role', 'is_admin', 'is_active', 'status')  # Filtering by status

    fieldsets = (
        ('User Credentials', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'tc', 'role', 'license_number', 'status')}),  # Added 'status'
        ('Permissions', {'fields': ('is_admin', 'is_active')}),
    )

    # Add fieldsets for creating a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'role', 'tc', 'license_number','timezone' 'status', 'password1', 'password2'),  # Added 'status'
        }),
    )

    search_fields = ('email', 'name', 'role', 'license_number')  # Made 'license_number' searchable
    ordering = ('email', 'id')
    filter_horizontal = ()

    # Allow inline editing of status
    list_editable = ('status',)


# Register the updated UserModelAdmin
admin.site.register(User, UserModelAdmin)
