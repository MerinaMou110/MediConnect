from django.urls import path
from .views import PatientListView, PatientDetailView,EMRDetailView,EMRListCreateView,MedicalRecordPDFView, PatientProfileView

urlpatterns = [
    path('patients/', PatientListView.as_view(), name='patient-list'),
    path('patients/<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),
    path('patient/profile/', PatientProfileView.as_view(), name='patient-profile'),

    


    path("emr/", EMRListCreateView.as_view(), name="emr-list"),
    path("emr/<int:pk>/pdf/", MedicalRecordPDFView.as_view(), name="medical-record-pdf"),

    path("emr/<int:pk>/", EMRDetailView.as_view(), name="emr-detail"),


]
