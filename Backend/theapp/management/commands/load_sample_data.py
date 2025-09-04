from django.core.management.base import BaseCommand
from theapp.models import JobListing, SearchResult, GPSCoordinates, OperatingHours, SearchResultType

class Command(BaseCommand):
    help = 'Load sample data for both job listings and maps search results'

    def handle(self, *args, **options):
        # Load sample job listings
        job_data = [
            {
                "job_position": "HR and Payroll Officer",
                "job_link": "https://za.linkedin.com/jobs/view/hr-and-payroll-officer-at-yokogawa-4235506621",
                "job_id": "4235506621",
                "company_name": "Yokogawa",
                "company_profile": "https://jp.linkedin.com/company/yokogawa",
                "job_location": "Johannesburg, Gauteng, South Africa",
                "job_posting_date": "2025-05-24",
                "company_logo_url": "https://media.licdn.com/dms/image/v2/C510BAQEIieCR9bgV7Q/company-logo_100_100/0/1630618745896/yokogawa_logo"
            },
            # Add other job listings...
        ]

        for data in job_data:
            JobListing.objects.create(**data)

        # Load sample maps search results
        maps_data = [
            {
                "title": "Bona Lesedi Disability Centre",
                "place_id": "ChIJ-f2X7R96lR4RxydtQZQUwPU",
                "data_id": "0x1e957a1fed97fdf9:0xf5c01494416d27c7",
                "data_cid": "-738567711903373369",
                "reviews_link": "https://api.scrapingdog.com/google_maps/reviews?api_key=68b85a6dd8a6124ad5827ce1&data_id=0x1e957a1fed97fdf9:0xf5c01494416d27c7",
                "photos_link": "https://api.scrapingdog.com/google_maps/photos?api_key=68b85a6dd8a6124ad5827ce1&data_id=0x1e957a1fed97fdf9:0xf5c01494416d27c7",
                "posts_link": "https://api.scrapingdog.com/google_maps/posts?api_key=68b85a6dd8a6124ad5827ce1&data_id=0x1e957a1fed97fdf9:0xf5c01494416d27c7",
                "gps_coordinates": {"latitude": -25.9136098, "longitude": 28.0360788},
                "provider_id": "/g/11b6_s8z2g",
                "rating": 4.5,
                "reviews": 4,
                "type": "Disability services and support organization",
                "types": ["Disability services and support organization", "Rehabilitation center"],
                "address": "Plot 14 Corner Koedoe Road and du Toit Street,Timsrand AH,Centurion,South Africa",
                "open_state": "Closed ⋅ Opens 8 AM Fri",
                "hours": "Closed ⋅ Opens 8 AM Fri",
                "operating_hours": {
                    "thursday": "8 AM–4 PM",
                    "friday": "8 AM–2 PM",
                    "saturday": "Closed",
                    "sunday": "Closed",
                    "monday": "8 AM–4 PM",
                    "tuesday": "8 AM–4 PM",
                    "wednesday": "8 AM–4 PM"
                },
                "phone": "+27114647341",
                "website": "https://www.bonalesedi.org.za/",
                "thumbnail": "https://lh3.googleusercontent.com/p/AF1QipPeudFnxgSF0_oGd-_oXJktyAAyfv-OH4026m-4=w114-h86-k-no",
                "image": "https://lh3.googleusercontent.com/p/AF1QipPeudFnxgSF0_oGd-_oXJktyAAyfv-OH4026m-4=w800-h600-k-no",
                "google_maps_url": "https://www.google.com/maps/place/Bona+Lesedi+Disability+Centre/@-25.9136098,28.0360788,NaN/data=!3m1!1e3!4m6!3m5!1s0x1e957a1fed97fdf9:0xf5c01494416d27c7!8m2!3d-25.9136098!4d28.0360788!16s"
            },
            # Add other maps data...
        ]

        for data in maps_data:
            # Create GPS coordinates
            gps_coords = GPSCoordinates.objects.create(**data.pop('gps_coordinates'))
            
            # Create operating hours
            operating_hours_data = data.pop('operating_hours', {})
            operating_hours = OperatingHours.objects.create(**operating_hours_data)
            
            # Get types and remove from data
            types = data.pop('types', [])
            
            # Create search result
            search_result = SearchResult.objects.create(
                gps_coordinates=gps_coords,
                operating_hours=operating_hours,
                **data
            )
            
            # Create types
            for type_name in types:
                SearchResultType.objects.create(
                    search_result=search_result,
                    type_name=type_name
                )
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded sample data for both APIs'))