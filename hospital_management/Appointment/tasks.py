from django.utils import timezone
import datetime
from celery import shared_task
from django.core.mail import send_mail
from twilio.rest import Client
from django.conf import settings
from Appointment.models import Appointment
import pytz
from django.db.models import Q

from celery import shared_task
from django.utils import timezone
import datetime
import pytz
from django.core.mail import send_mail
from twilio.rest import Client
from django.conf import settings
from celery import shared_task
from django.utils import timezone
import datetime
import pytz
from django.core.mail import send_mail
from twilio.rest import Client
from django.conf import settings
from django.utils.timezone import now
import datetime
import datetime
import pytz
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client
from django.utils.timezone import now
from Appointment.models import Appointment
from celery import shared_task
from django.utils.timezone import now
from datetime import datetime, timedelta
import pytz
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client
from .models import Appointment
from celery import shared_task
from django.utils.timezone import now
from datetime import datetime, timedelta
import pytz
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
@shared_task
def send_appointment_reminders():
    now_utc = now()
    one_hour_later_utc = now_utc + timedelta(hours=1)

    print(f"🔍 Checking appointments between {now_utc} and {one_hour_later_utc} UTC")

    upcoming_appointments = Appointment.objects.filter(
        status="Confirmed",
        available_time__date=now_utc.date(),  # Compare with today's date
        available_time__start_time__gte=now_utc.time(),
        available_time__start_time__lt=one_hour_later_utc.time()
    )

    if not upcoming_appointments.exists():
        print("❌ No upcoming appointments found.")
        return "No upcoming appointments found"

    for appointment in upcoming_appointments:
        doctor_tz = pytz.timezone(appointment.doctor.user.timezone)
        patient_tz = pytz.timezone(appointment.patient.user.timezone)

        # Directly use available_time.date since day is removed
        appointment_datetime_utc = datetime.combine(
            appointment.available_time.date,  # Use date directly
            appointment.available_time.start_time
        ).replace(tzinfo=pytz.utc)

        print(f"⏳ Appointment ID {appointment.id} UTC Time: {appointment_datetime_utc}")

        # Convert to doctor's and patient's timezone
        appointment_datetime_doctor = appointment_datetime_utc.astimezone(doctor_tz)
        appointment_datetime_patient = appointment_datetime_utc.astimezone(patient_tz)

        doctor_time = appointment_datetime_doctor.strftime("%I:%M %p")
        doctor_date = appointment_datetime_doctor.strftime("%A, %d %B %Y")
        patient_time = appointment_datetime_patient.strftime("%I:%M %p")
        patient_date = appointment_datetime_patient.strftime("%A, %d %B %Y")

        # Send reminders via email and SMS
        send_email_and_sms(appointment, doctor_date, doctor_time, patient_date, patient_time)

    return "Appointment reminders sent"


def send_email_and_sms(appointment, doctor_date, doctor_time, patient_date, patient_time):
    """Helper function to send email and SMS notifications"""
    patient_email = appointment.patient.user.email
    doctor_email = appointment.doctor.user.email
    patient_phone = appointment.patient.phone_number
    doctor_phone = appointment.doctor.contact_number

    # Email messages
    patient_subject = "Reminder: Your Upcoming Appointment"
    patient_message = f"""
    Dear {appointment.patient.user.name},

    This is a friendly reminder that you have an appointment with {appointment.doctor.user.name} 
    on {patient_date} at {patient_time} (your local time).

    Please be on time.

    Best Regards,  
    Your Healthcare Team
    """

    doctor_subject = "Reminder: Your Upcoming Patient Appointment"
    doctor_message = f"""
    Dear {appointment.doctor.user.name},

    You have an upcoming appointment with patient {appointment.patient.user.name} 
    on {doctor_date} at {doctor_time} (your local time).

    Please be prepared.

    Best Regards,  
    Your Healthcare Team
    """

    send_mail(patient_subject, patient_message, settings.EMAIL_HOST_USER, [patient_email], fail_silently=False)
    send_mail(doctor_subject, doctor_message, settings.EMAIL_HOST_USER, [doctor_email], fail_silently=False)

    # Send SMS notifications
    send_sms(doctor_phone, f"Reminder: You have an appointment with {appointment.patient.user.name} on {doctor_date} at {doctor_time}.")
    send_sms(patient_phone, f"Reminder: Your appointment with {appointment.doctor.user.name} is on {patient_date} at {patient_time}. Please be on time.")


def send_sms(phone_number, message_body):
    """Helper function to send SMS using Twilio"""
    if not phone_number:
        return
    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message = client.messages.create(body=message_body, from_=settings.TWILIO_PHONE_NUMBER, to=phone_number)
        print(f"✅ SMS Sent to {phone_number}, SID: {message.sid}")
    except TwilioRestException as e:
        print(f"❌ Twilio Error Sending SMS to {phone_number}: {e}")


@shared_task
def send_appointment_confirmation(appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return "Appointment not found"

    doctor_tz = pytz.timezone(appointment.doctor.user.timezone)
    patient_tz = pytz.timezone(appointment.patient.user.timezone)

    # Directly use available_time.date since day is removed
    appointment_datetime_utc = datetime.combine(
        appointment.available_time.date,
        appointment.available_time.start_time
    ).replace(tzinfo=pytz.utc)

    appointment_datetime_doctor = appointment_datetime_utc.astimezone(doctor_tz)
    appointment_datetime_patient = appointment_datetime_utc.astimezone(patient_tz)

    doctor_time = appointment_datetime_doctor.strftime("%I:%M %p")
    doctor_date = appointment_datetime_doctor.strftime("%A, %d %B %Y")
    patient_time = appointment_datetime_patient.strftime("%I:%M %p")
    patient_date = appointment_datetime_patient.strftime("%A, %d %B %Y")

    # Send confirmation emails
    send_mail(
        "Appointment Confirmation",
        f"Dear {appointment.patient.user.name},\n\nYour appointment with Dr. {appointment.doctor.user.name} on {patient_date} at {patient_time} (your local time) has been confirmed.",
        settings.EMAIL_HOST_USER, [appointment.patient.user.email], fail_silently=False
    )

    send_mail(
        "New Appointment Scheduled",
        f"Dear Dr. {appointment.doctor.user.name},\n\nA new appointment has been scheduled with {appointment.patient.user.name} on {doctor_date} at {doctor_time} (your local time).",
        settings.EMAIL_HOST_USER, [appointment.doctor.user.email], fail_silently=False
    )

    return f"Sent confirmation for appointment {appointment_id}"



from celery import shared_task
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
import os
import tempfile
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

@shared_task
def send_medical_record_pdf(patient_email, doctor_name, diagnosis, visit_date, prescriptions, test_results, additional_notes, record_id,is_update=False):
    """
    Generate a well-formatted PDF for the medical record and send it via email.
    """

    # ✅ Create a temporary PDF file
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_file:
        pdf_path = temp_file.name

    # ✅ Create PDF document
    doc = SimpleDocTemplate(pdf_path, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    # ✅ Title
    title = Paragraph("<b>Medical Prescription</b>", styles["Title"])
    elements.append(title)
    elements.append(Spacer(1, 12))

    # ✅ Doctor and Patient Info
    info = [
        ["Doctor:", doctor_name],
        ["Patient Email:", patient_email],
        ["Visit Date:", visit_date]
    ]
    table = Table(info, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.black),
        ("TEXTCOLOR", (1, 0), (1, -1), colors.darkblue),
        ("FONTSIZE", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 12))

    # ✅ Diagnosis
    elements.append(Paragraph(f"<b>Diagnosis:</b> {diagnosis}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    # ✅ Prescription Table
    prescription_data = [["Medicine", "Dosage"]]
    for pres in prescriptions.split(","):
        prescription_data.append([pres.strip(), ""])  # Empty column for flexibility

    pres_table = Table(prescription_data, colWidths=[250, 150])
    pres_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]))
    elements.append(Paragraph("<b>Prescriptions:</b>", styles["Normal"]))
    elements.append(pres_table)
    elements.append(Spacer(1, 12))

    # ✅ Test Results
    elements.append(Paragraph(f"<b>Test Results:</b> {test_results}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    # ✅ Additional Notes
    elements.append(Paragraph(f"<b>Additional Notes:</b> {additional_notes}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    # ✅ Confidential Notice
    elements.append(Spacer(1, 12))
    elements.append(Paragraph("<i>This document is confidential.</i>", styles["Italic"]))

    # ✅ Build PDF
    doc.build(elements)

   # ✅ Set email subject dynamically
    email_subject = "Updated Medical Record" if is_update else "Your Medical Record"
    email_body = render_to_string("emails/medical_record_email.html", {
        "doctor_name": doctor_name,
        "diagnosis": diagnosis,
        "visit_date": visit_date,
        "prescriptions": prescriptions,
        "test_results": test_results,
        "additional_notes": additional_notes
    })

    email = EmailMessage(
        subject=email_subject,
        body=email_body,
        from_email=settings.EMAIL_HOST_USER,
        to=[patient_email]
    )

    email.content_subtype = "html"
    email.attach_file(pdf_path)
    email.send()

    # ✅ Cleanup the temporary PDF file
    os.remove(pdf_path)
