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

class AccessibilityLocationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AccessibilityLocation
        fields = ['url', 'name', 'description', 'address', 'latitude', 'longitude']

class AccessibilityMapSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AccessibilityMap
        fields = ['url', 'location', 'is_accessible', 'accessibility_score']

class JobPostingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = JobPosting
        fields = ['url', 'title', 'description', 'location', 'posted_date', 'is_active']

class HealthcareFacilitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = HealthcareFacility
        fields = ['url', 'name', 'description', 'address', 'location', 'contact_number', 'website']