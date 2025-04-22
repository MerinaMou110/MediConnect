from django.urls import path
from .views import (
    AvailableTimeListView, DoctorListView, DoctorDetailView,
    ReviewListView, SpecializationAdminView, DesignationAdminView, DoctorProfileView,
    AvailableTimeCreateView, AvailableTimeUpdateView,AvailableTimeListForDoctorView,ReviewCreateView
)

urlpatterns = [
    # Public endpoints

    # path('available-times/', AvailableTimeListView.as_view(), name='available-time-list'),
    path("doctors/<int:doctor_id>/available-times/", AvailableTimeListForDoctorView.as_view(), name="doctor-available-times"),
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),  # Changed from 'doctorslist/'
    path('doctors/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),  # Changed 'id' to 'pk'
    path('doctors/reviews/', ReviewListView.as_view(), name='review-list'),
     path('doctors/reviews/create/', ReviewCreateView.as_view(), name='review-create'),  # Submit a review (POST)

    # Admin can create,update or delete and other can view
    path('doctors/specializations/', SpecializationAdminView.as_view(), name='specialization-list-create'),
    path('doctors/designations/', DesignationAdminView.as_view(), name='designation-list-create'),
    path('doctors/specializations/<int:pk>/', SpecializationAdminView.as_view(), name='specialization-detail'),
    
    path('doctors/designations/<int:pk>/', DesignationAdminView.as_view(), name='designation-detail'),

    # Doctor-specific endpoints
    path('doctors/profile/', DoctorProfileView.as_view(), name='doctor-update'),
    path('doctors/me/available-times/list/', AvailableTimeListView.as_view(), name='available-time-list'),
    path('doctors/me/available-times/', AvailableTimeCreateView.as_view(), name='available-time-create'),
    path('doctors/me/available-times/<int:pk>/', AvailableTimeUpdateView.as_view(), name='available-time-update'),
]
