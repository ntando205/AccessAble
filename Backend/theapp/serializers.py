from django.contrib.auth.models import Group, User
from .models import *
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class AccessibilityLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessibilityLocation
        fields = ['id', 'name', 'description', 'address', 'latitude', 'longitude']


class AccessibilityMapSerializer(serializers.ModelSerializer):
    location = AccessibilityLocationSerializer(read_only=True)

    class Meta:
        model = AccessibilityMap
        fields = ['id', 'location', 'is_accessible', 'accessibility_score']


class JobPostingSerializer(serializers.ModelSerializer):
    location = AccessibilityLocationSerializer(read_only=True)

    class Meta:
        model = JobPosting
        fields = [
            'id', 'job_id', 'title', 'description',
            'location_text', 'location',
            'company_name', 'company_profile', 'company_logo_url',
            'job_link', 'posted_date', 'is_active', 'source'
        ]


class HealthcareFacilitySerializer(serializers.ModelSerializer):
    location = AccessibilityLocationSerializer(read_only=True)

    class Meta:
        model = HealthcareFacility
        fields = [
            'id', 'place_id', 'name', 'description', 'address',
            'location', 'latitude', 'longitude',
            'contact_number', 'website',
            'rating', 'reviews_count', 'open_state', 'hours'
        ]
