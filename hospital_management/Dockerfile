# Base Image
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy everything
COPY . /app/

# Add and set permission for entrypoint
RUN chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 8000

# Use entrypoint script
CMD ["/app/entrypoint.sh"]
