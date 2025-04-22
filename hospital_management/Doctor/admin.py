from django.contrib import admin
from .models import Doctor, Specialization, Designation, AvailableTime, Review

# ✅ Register Specialization
@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

# ✅ Register Designation
@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

# ✅ Register AvailableTime
@admin.register(AvailableTime)
class AvailableTimeAdmin(admin.ModelAdmin):
    list_display = ('id', 'doctor', 'date', 'get_start_time', 'get_end_time')  # ✅ Fixed: Used custom methods
    search_fields = ('doctor__user__name', 'date')
    list_filter = ('date', 'doctor')
    ordering = ('doctor', 'date', 'start_time')

    def get_start_time(self, obj):
        return obj.start_time.strftime("%I:%M %p")  # "09:00 AM"

    def get_end_time(self, obj):
        return obj.end_time.strftime("%I:%M %p")  # "10:30 PM"

    get_start_time.short_description = "Start Time"
    get_end_time.short_description = "End Time"

# ✅ Inline AvailableTime for Doctor
class AvailableTimeInline(admin.TabularInline):
    model = AvailableTime
    extra = 1  
    fk_name = 'doctor'

# ✅ Register Doctor
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'get_license_number', 'fee', 'average_rating', 'is_available')
    search_fields = ('user__name', 'user__email', 'specialization__name')
    list_filter = ('is_available',)
    filter_horizontal = ('designation', 'specialization')  
    readonly_fields = ('average_rating', 'total_reviews')
    inlines = [AvailableTimeInline]  

    def get_license_number(self, obj):
        return obj.user.license_number  
    get_license_number.short_description = 'License Number'

# ✅ Register Review
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'reviewer', 'doctor', 'rating', 'created')
    search_fields = ('reviewer__user__name', 'doctor__user__name')
    list_filter = ('rating',)
    ordering = ('-created',)
