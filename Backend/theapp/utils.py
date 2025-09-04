import requests
from django.conf import settings

def fetch_google_maps_data(query, location='Gauteng, South Africa'):
    """
    Fetch data from ScrapingDog Google Maps API
    """
    url = 'https://api.scrapingdog.com/google_maps/'
    params = {
        'api_key': settings.SCRAPINGDOG_API_KEY,
        'query': f'{query} in {location}',
        'll': '',
        'page': 0,
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching Google Maps data: {e}")
        return None

def fetch_linkedin_jobs(query, location='Gauteng, South Africa'):
    """
    Fetch data from ScrapingDog LinkedIn Jobs API
    """
    url = 'https://api.scrapingdog.com/linkedinjobs/'
    params = {
        'api_key': settings.SCRAPINGDOG_API_KEY,
        'field': f'{query} in {location}',
        'geoid': '',
        'location': '',
        'page': 1,
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching LinkedIn jobs data: {e}")
        return None