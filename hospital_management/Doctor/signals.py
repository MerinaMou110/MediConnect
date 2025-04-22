from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Review, Doctor

@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_doctor_rating(sender, instance, **kwargs):
    """Update the doctor's average rating and total reviews whenever a review is added, updated, or deleted."""
    doctor = instance.doctor
    doctor.calculate_average_rating()
