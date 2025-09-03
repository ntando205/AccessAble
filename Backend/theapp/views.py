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
from .models import HealthcareFacility, AccessibilityLocation

api_key = "68b85a6dd8a6124ad5827ce1"


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
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer

    def list(self, request, *args, **kwargs):
        import requests
        from datetime import datetime
        from .models import JobPosting, AccessibilityLocation

        url = "https://api.scrapingdog.com/linkedinjobs"
        params = {
            "api_key": api_key,
            "field": "disability jobs",
            "location": "Johannesburg, South Africa",
            "page": 1
        }

        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                jobs = response.json()
                print("Fetched jobs:", len(jobs))

                for j in jobs:
                    # 🔹 Parse posted_date safely
                    posted_date = None
                    try:
                        posted_date = datetime.fromisoformat(j.get("job_posting_date")).date()
                    except Exception:
                        pass

                    #Normalize location (if only text available)
                    location_text = j.get("job_location", "")
                    location_obj = None
                    if location_text:
                        location_obj, _ = AccessibilityLocation.objects.get_or_create(
                            name=location_text,
                            defaults={
                                "description": "Job location (auto-generated)",
                                "address": location_text,
                                "latitude": 0.0,
                                "longitude": 0.0,
                            }
                        )

                    #Save/update job posting
                    JobPosting.objects.update_or_create(
                        job_id=j.get("job_id"),
                        defaults={
                            "title": j.get("job_position", ""),
                            "description": "",  # LinkedIn usually doesn't expose description via scraping
                            "location_text": location_text,
                            "location": location_obj,
                            "company_name": j.get("company_name", ""),
                            "company_profile": j.get("company_profile", ""),
                            "company_logo_url": j.get("company_logo_url", ""),
                            "job_link": j.get("job_link", ""),
                            "posted_date": posted_date,
                            "is_active": True,
                            "source": "linkedin",
                        }
                    )

        except Exception as e:
            print("Job fetch failed:", e)

        # Always return everything in DB
        queryset = JobPosting.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class HealthcareFacilityViewSet(viewsets.ModelViewSet):
    queryset = HealthcareFacility.objects.all()
    serializer_class = HealthcareFacilitySerializer

    # inside HealthcareFacilityViewSet.list()


    def list(self, request, *args, **kwargs):
        import requests

        url = "https://api.scrapingdog.com/google_maps"
        params = {
            "api_key": api_key,
            "query": "healthcare for the blind",
            "page": 0
        }

        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                facilities = data.get("search_results", [])
                print("Fetched facilities:", len(facilities))

                for f in facilities:
                    lat = f.get("gps_coordinates", {}).get("latitude")
                    lon = f.get("gps_coordinates", {}).get("longitude")

                    # 1️⃣ create or update AccessibilityLocation first
                    location_obj, _ = AccessibilityLocation.objects.update_or_create(
                        name=f.get("title", ""),
                        address=f.get("address", ""),
                        defaults={
                            "description": f.get("type", ""),
                            "latitude": lat if lat else 0,
                            "longitude": lon if lon else 0,
                        }
                    )

                    # 2️⃣ then create/update HealthcareFacility linked to that location
                    HealthcareFacility.objects.update_or_create(
                        place_id=f.get("place_id"),
                        defaults={
                            "name": f.get("title", ""),
                            "description": f.get("type", ""),
                            "address": f.get("address", ""),
                            "location": location_obj,
                            "latitude": lat if lat else 0,
                            "longitude": lon if lon else 0,
                            "contact_number": f.get("phone", ""),
                            "website": f.get("website", ""),
                            "rating": f.get("rating"),
                            "reviews_count": f.get("reviews"),
                            "open_state": f.get("open_state"),
                            "hours": f.get("operating_hours", {}),
                        }
                    )

        except Exception as e:
            print("Healthcare fetch failed:", e)

        # ✅ always return everything in DB
        queryset = HealthcareFacility.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



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