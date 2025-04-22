from django.contrib import admin

# Register your models here.

from .models import Patient,MedicalRecord

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_of_birth', 'gender', 'phone_number', 'blood_group')
    search_fields = ('user__email', 'user__name', 'blood_group')


admin.site.register(MedicalRecord)
