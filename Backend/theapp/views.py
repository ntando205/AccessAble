from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from django.db.models import Q
from .models import JobListing, SearchResult, GPSCoordinates, OperatingHours, SearchResultType
from .serializers import JobListingSerializer, SearchResultSerializer
import requests
from django.conf import settings
from .utils import fetch_google_maps_data, fetch_linkedin_jobs

# Job Listing Views
class JobListingListCreateView(generics.ListCreateAPIView):
    """
    View to list all job listings or create a new job listing
    """
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer

class JobListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update or delete a specific job listing
    """
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer
    lookup_field = 'job_id'

@api_view(['GET'])
def job_listings_by_company(request, company_name):
    """
    Custom view to get job listings by company name
    """
    jobs = JobListing.objects.filter(company_name__icontains=company_name)
    serializer = JobListingSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def job_listings_by_location(request, location):
    """
    Custom view to get job listings by location
    """
    jobs = JobListing.objects.filter(job_location__icontains=location)
    serializer = JobListingSerializer(jobs, many=True)
    return Response(serializer.data)

# Google Maps Search Results Views
class SearchResultListCreateView(generics.ListCreateAPIView):
    """
    View to list all search results or create a new search result
    """
    queryset = SearchResult.objects.all().prefetch_related('types', 'gps_coordinates', 'operating_hours')
    serializer_class = SearchResultSerializer

class SearchResultDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update or delete a specific search result
    """
    queryset = SearchResult.objects.all().prefetch_related('types', 'gps_coordinates', 'operating_hours')
    serializer_class = SearchResultSerializer
    lookup_field = 'place_id'

@api_view(['GET'])
def search_results_by_type(request, type_name):
    """
    Custom view to get search results by type
    """
    results = SearchResult.objects.filter(
        Q(type__icontains=type_name) | 
        Q(types__type_name__icontains=type_name)
    ).distinct().prefetch_related('types', 'gps_coordinates', 'operating_hours')
    
    serializer = SearchResultSerializer(results, many=True)
    return Response({'search_results': serializer.data})

@api_view(['GET'])
def search_results_by_rating(request, min_rating):
    """
    Custom view to get search results with minimum rating
    """
    results = SearchResult.objects.filter(
        rating__gte=float(min_rating)
    ).prefetch_related('types', 'gps_coordinates', 'operating_hours')
    
    serializer = SearchResultSerializer(results, many=True)
    return Response({'search_results': serializer.data})

@api_view(['GET'])
def all_search_results(request):
    """
    View to get all search results in the required response format
    """
    results = SearchResult.objects.all().prefetch_related('types', 'gps_coordinates', 'operating_hours')
    serializer = SearchResultSerializer(results, many=True)
    return Response({'search_results': serializer.data})


@api_view(['GET'])
def api_root(request, format=None):
    """
    API root endpoint that provides links to all available endpoints
    """
    return Response({
        'job_listings': {
            'all_jobs': reverse('job-list-create', request=request, format=format),
            'jobs_by_company': reverse('jobs-by-company', request=request, format=format, kwargs={'company_name': 'company-name'}),
            'jobs_by_location': reverse('jobs-by-location', request=request, format=format, kwargs={'location': 'location'}),
        },
        'maps_search_results': {
            'all_search_results': reverse('all-search-results', request=request, format=format),
            'search_results_list': reverse('search-result-list-create', request=request, format=format),
            'search_results_by_type': reverse('search-results-by-type', request=request, format=format, kwargs={'type_name': 'type-name'}),
            'search_results_by_rating': reverse('search-results-by-rating', request=request, format=format, kwargs={'min_rating': '4.0'}),
        },
        'documentation': 'Visit each endpoint to see available parameters and response formats'
    })


@api_view(['POST'])
def scrape_and_save_google_maps(request):
    """
    Scrape Google Maps data and save to database
    """
    query = request.data.get('query', 'healthcare facilities for disabled people')
    location = request.data.get('location', 'Gauteng, South Africa')
    
    # Fetch data from ScrapingDog
    data = fetch_google_maps_data(query, location)
    
    if not data or 'search_results' not in data:
        return Response(
            {'error': 'Failed to fetch data from ScrapingDog API'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    saved_count = 0
    errors = []
    
    for item in data['search_results']:
        try:
            # Check if item already exists
            if SearchResult.objects.filter(place_id=item.get('place_id')).exists():
                continue
            
            # Create GPS coordinates
            gps_data = item.get('gps_coordinates', {})
            gps_coordinates = GPSCoordinates.objects.create(
                latitude=gps_data.get('latitude', 0),
                longitude=gps_data.get('longitude', 0)
            )
            
            # Create operating hours
            operating_hours_data = item.get('operating_hours', {})
            operating_hours = OperatingHours.objects.create(
                monday=operating_hours_data.get('monday'),
                tuesday=operating_hours_data.get('tuesday'),
                wednesday=operating_hours_data.get('wednesday'),
                thursday=operating_hours_data.get('thursday'),
                friday=operating_hours_data.get('friday'),
                saturday=operating_hours_data.get('saturday'),
                sunday=operating_hours_data.get('sunday')
            )
            
            # Create search result
            search_result = SearchResult.objects.create(
                title=item.get('title', ''),
                place_id=item.get('place_id', ''),
                data_id=item.get('data_id'),
                data_cid=item.get('data_cid'),
                reviews_link=item.get('reviews_link'),
                photos_link=item.get('photos_link'),
                posts_link=item.get('posts_link'),
                gps_coordinates=gps_coordinates,
                provider_id=item.get('provider_id'),
                rating=item.get('rating'),
                reviews=item.get('reviews'),
                type=item.get('type'),
                address=item.get('address'),
                open_state=item.get('open_state'),
                hours=item.get('hours'),
                operating_hours=operating_hours,
                phone=item.get('phone'),
                website=item.get('website'),
                thumbnail=item.get('thumbnail'),
                image=item.get('image'),
                google_maps_url=item.get('google_maps_url'),
                unclaimed_business=item.get('unclaimed_business', False)
            )
            
            # Create types
            types_list = item.get('types', [])
            for type_name in types_list:
                SearchResultType.objects.create(
                    search_result=search_result,
                    type_name=type_name
                )
            
            saved_count += 1
            
        except Exception as e:
            errors.append(f"Error saving item {item.get('title')}: {str(e)}")
            continue
    
    return Response({
        'message': f'Successfully saved {saved_count} items',
        'errors': errors,
        'total_fetched': len(data['search_results'])
    })

@api_view(['POST'])
def scrape_and_save_linkedin_jobs(request):
    """
    Scrape LinkedIn Jobs data and save to database
    """
    query = request.data.get('query', 'disability jobs')
    location = request.data.get('location', 'Gauteng, South Africa')
    
    # Fetch data from ScrapingDog
    data = fetch_linkedin_jobs(query, location)
    
    if not data or not isinstance(data, list):
        return Response(
            {'error': 'Failed to fetch data from ScrapingDog API or invalid response format'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    saved_count = 0
    errors = []
    
    for item in data:
        try:
            # Check if item already exists
            if JobListing.objects.filter(job_id=item.get('job_id')).exists():
                continue
            
            # Create job listing
            job_listing = JobListing.objects.create(
                job_position=item.get('job_position', ''),
                job_link=item.get('job_link', ''),
                job_id=item.get('job_id', ''),
                company_name=item.get('company_name', ''),
                company_profile=item.get('company_profile', ''),
                job_location=item.get('job_location', ''),
                job_posting_date=item.get('job_posting_date'),
                company_logo_url=item.get('company_logo_url')
            )
            
            saved_count += 1
            
        except Exception as e:
            errors.append(f"Error saving job {item.get('job_position')}: {str(e)}")
            continue
    
    return Response({
        'message': f'Successfully saved {saved_count} jobs',
        'errors': errors,
        'total_fetched': len(data)
    })

@api_view(['POST'])
def scrape_all_data(request):
    """
    Scrape both Google Maps and LinkedIn Jobs data
    """
    google_maps_query = request.data.get('google_maps_query', 'healthcare facilities for disabled people')
    linkedin_query = request.data.get('linkedin_query', 'disability jobs')
    location = request.data.get('location', 'Gauteng, South Africa')
    
    # Scrape Google Maps data
    google_response = scrape_and_save_google_maps(request._request)
    google_data = google_response.data if hasattr(google_response, 'data') else {}
    
    # Scrape LinkedIn Jobs data
    linkedin_response = scrape_and_save_linkedin_jobs(request._request)
    linkedin_data = linkedin_response.data if hasattr(linkedin_response, 'data') else {}
    
    return Response({
        'google_maps': google_data,
        'linkedin_jobs': linkedin_data,
        'message': 'Scraping completed'
    })