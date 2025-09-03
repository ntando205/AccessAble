from django.shortcuts import render
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services.map_scraper import fetch_and_save_healthcare_data


from .serializers import *

# Create your views here.


# class TokenQueryParamAuthentication(BaseAuthentication):
#     def authenticate(self, request):
#         token = request.GET.get('Token')
#         if not token:
#             raise AuthenticationFailed('Authentication credentials were not provided.')
        
#         try:
#             token_obj = Token.objects.get(key=token)
#         except Token.DoesNotExist:
#             raise AuthenticationFailed('Invalid token.')
        
#         return (token_obj.user, token_obj)

class AccessibilityLocationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows accessibility locations to be viewed or edited.
    """
    queryset = AccessibilityLocation.objects.all()
    serializer_class = AccessibilityLocationSerializer
    #permission_classes = [permissions.IsAuthenticated]
    #authentication_classes = [TokenQueryParamAuthentication]

class AccessibilityMapViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows accessibility maps to be viewed or edited.
    """
    queryset = AccessibilityMap.objects.all()
    serializer_class = AccessibilityMapSerializer
    #permission_classes = [permissions.IsAuthenticated]
    #authentication_classes = [TokenQueryParamAuthentication]

class JobPostingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows job postings to be viewed or edited.
    """
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    #permission_classes = [permissions.IsAuthenticated]
    #authentication_classes = [TokenQueryParamAuthentication]

class HealthcareFacilityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows healthcare facilities to be viewed or edited.
    """
    def post(self, request):
        query = request.data.get("query", "healthcare for the blind")
        result = fetch_and_save_healthcare_data(query)
        return Response({"message": result}, status=status.HTTP_200_OK)

    queryset = HealthcareFacility.objects.all()
    serializer_class = HealthcareFacilitySerializer
    #permission_classes = [permissions.IsAuthenticated]
    #authentication_classes = [TokenQueryParamAuthentication]

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    #permission_classes = [permissions.IsAuthenticated]
    #authentication_classes = [TokenQueryParamAuthentication]

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    #permission_classes = [permissions.IsAuthenticated]
    #authentication_classes = [TokenQueryParamAuthentication]