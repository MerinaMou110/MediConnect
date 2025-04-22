from django.urls import path
from .views import AppointmentCreateView, PatientAppointmentListView,CompleteAppointmentView

urlpatterns = [
    path('book-appointment/', AppointmentCreateView.as_view(), name='book-appointment'),
    path('my-appointments/', PatientAppointmentListView.as_view(), name='my-appointments'),
    path('<int:pk>/complete/', CompleteAppointmentView.as_view(), name="complete-appointment"),

]
