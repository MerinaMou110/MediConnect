import django_filters
from .models import Doctor

class DoctorFilter(django_filters.FilterSet):
    specialization = django_filters.CharFilter(field_name="specialization__name", lookup_expr='icontains')
    designation = django_filters.CharFilter(field_name="designation__name", lookup_expr='icontains')
    country = django_filters.CharFilter(field_name="country", lookup_expr='iexact')

    class Meta:
        model = Doctor
        fields = ['specialization', 'designation', 'country']
