#!/bin/sh


# Wait for DB to be ready (optional, if using Compose)
# echo "Waiting for DB..."
# sleep 10

echo "Running migrations..."
python manage.py migrate

echo "Loading fixtures..."
python manage.py loaddata data.json

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec gunicorn hospital_management.wsgi:application --bind 0.0.0.0:8000
