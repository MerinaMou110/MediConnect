from django.contrib import admin

# Register your models here.

from .models import Appointment

class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id','patient', 'doctor', 'available_time', 'appointment_type', 'status', 'created_at')
    list_filter = ('status', 'appointment_type')
    search_fields = ('patient__user__name', 'doctor__user__name')
    ordering = ('-created_at',)

admin.site.register(Appointment, AppointmentAdmin)
