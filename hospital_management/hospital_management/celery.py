from __future__ import absolute_import, unicode_literals
import os
import multiprocessing
from celery import Celery
from celery.schedules import crontab

# Ensure compatibility with Windows
if multiprocessing.get_start_method(allow_none=True) != 'spawn':
    multiprocessing.set_start_method('spawn', force=True)

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hospital_management.settings')

app = Celery('hospital_management')

# Load task modules from all registered Django app configs
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks
app.autodiscover_tasks()

# Celery Beat Schedule (runs every hour)
app.conf.beat_schedule = {
   'send-reminder-every-30-minutes': {  # Update task name for clarity
    'task': 'Appointment.tasks.send_appointment_reminders',
    'schedule': crontab(minute='*/5'),  # Runs every 30 minutes
}
}


# Ensure Celery runs with proper worker settings on Windows
if __name__ == '__main__':
    app.start()
