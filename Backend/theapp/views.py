from django.shortcuts import render
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets

from .serializers import *

# Create your views here.

class AccessibilityLocationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows accessibility locations to be viewed or edited.
    """
    queryset = AccessibilityLocation.objects.all()
    serializer_class = AccessibilityLocationSerializer
    permission_classes = [permissions.IsAuthenticated]

class AccessibilityMapViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows accessibility maps to be viewed or edited.
    """
    queryset = AccessibilityMap.objects.all()
    serializer_class = AccessibilityMapSerializer
    permission_classes = [permissions.IsAuthenticated]

class JobPostingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows job postings to be viewed or edited.
    """
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [permissions.IsAuthenticated]

class HealthcareFacilityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows healthcare facilities to be viewed or edited.
    """
    queryset = HealthcareFacility.objects.all()
    serializer_class = HealthcareFacilitySerializer
    permission_classes = [permissions.IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]