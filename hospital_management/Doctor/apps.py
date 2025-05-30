from django.apps import AppConfig


class DoctorConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "Doctor"

    def ready(self):
        import Doctor.signals  # Import the signals when the app is ready
