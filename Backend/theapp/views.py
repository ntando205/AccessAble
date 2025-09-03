from django.contrib.auth.models import Group, User
from rest_framework import viewsets
from .models import *
from .serializers import (
    UserSerializer, GroupSerializer,
    AccessibilityLocationSerializer, AccessibilityMapSerializer,
    JobPostingSerializer, HealthcareFacilitySerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class AccessibilityLocationViewSet(viewsets.ModelViewSet):
    queryset = AccessibilityLocation.objects.all()
    serializer_class = AccessibilityLocationSerializer


class AccessibilityMapViewSet(viewsets.ModelViewSet):
    queryset = AccessibilityMap.objects.all()
    serializer_class = AccessibilityMapSerializer


class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer


class HealthcareFacilityViewSet(viewsets.ModelViewSet):
    queryset = HealthcareFacility.objects.all()
    serializer_class = HealthcareFacilitySerializer
