import requests
from ..models import AccessibilityLocation, HealthcareFacility

def fetch_and_save_healthcare_data(query="healthcare for the blind in Gauteng, South Africa"):
    api_key = "68b85a6dd8a6124ad5827ce1"  # (better: put in settings.py)
    url = "https://api.scrapingdog.com/google_maps"

    params = {
        "api_key": api_key,
        "query": query,
        "page": 0
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()

        places = data.get("search_results", [])

        for place in places:
            name = place.get("title") or "Unknown"
            address = place.get("address") or "Not provided"
            gps = place.get("gps_coordinates", {})
            latitude = gps.get("latitude", 0.0)
            longitude = gps.get("longitude", 0.0)
            description = place.get("type") or "Healthcare facility"
            phone = place.get("phone", "")
            website = place.get("website", "")

            # Create or update the AccessibilityLocation
            location, _ = AccessibilityLocation.objects.get_or_create(
                name=name,
                address=address,
                defaults={
                    "description": description,
                    "latitude": latitude,
                    "longitude": longitude,
                }
            )

            # Create or update the HealthcareFacility
            HealthcareFacility.objects.update_or_create(
                name=name,
                address=address,
                location=location,
                defaults={
                    "description": description,
                    "contact_number": phone,
                    "website": website,
                }
            )

        return f"Imported {len(places)} facilities"
    else:
        return f"Request failed with status code: {response.status_code}"
