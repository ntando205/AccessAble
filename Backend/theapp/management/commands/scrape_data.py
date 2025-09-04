from django.core.management.base import BaseCommand
from django.conf import settings
from theapp.utils import fetch_google_maps_data, fetch_linkedin_jobs
from theapp.models import JobListing, SearchResult, GPSCoordinates, OperatingHours, SearchResultType

class Command(BaseCommand):
    help = 'Scrape data from ScrapingDog APIs and save to database'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--type',
            type=str,
            choices=['google-maps', 'linkedin-jobs', 'all'],
            default='all',
            help='Type of data to scrape'
        )
        parser.add_argument(
            '--query',
            type=str,
            help='Custom search query'
        )
        parser.add_argument(
            '--location',
            type=str,
            default='Gauteng, South Africa',
            help='Location to search in'
        )

    def handle(self, *args, **options):
        scrape_type = options['type']
        query = options['query']
        location = options['location']
        
        if scrape_type in ['google-maps', 'all']:
            self.stdout.write('Scraping Google Maps data...')
            self.scrape_google_maps(
                query or 'healthcare facilities for disabled people', 
                location
            )
        
        if scrape_type in ['linkedin-jobs', 'all']:
            self.stdout.write('Scraping LinkedIn Jobs data...')
            self.scrape_linkedin_jobs(
                query or 'disability jobs', 
                location
            )
        
        self.stdout.write(self.style.SUCCESS('Scraping completed!'))

    def scrape_google_maps(self, query, location):
        data = fetch_google_maps_data(query, location)
        
        if not data or 'search_results' not in data:
            self.stdout.write(self.style.ERROR('Failed to fetch Google Maps data'))
            return
        
        saved_count = 0
        for item in data['search_results']:
            try:
                if SearchResult.objects.filter(place_id=item.get('place_id')).exists():
                    continue
                
                gps_data = item.get('gps_coordinates', {})
                gps_coordinates = GPSCoordinates.objects.create(
                    latitude=gps_data.get('latitude', 0),
                    longitude=gps_data.get('longitude', 0)
                )
                
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
                
                types_list = item.get('types', [])
                for type_name in types_list:
                    SearchResultType.objects.create(
                        search_result=search_result,
                        type_name=type_name
                    )
                
                saved_count += 1
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error saving item: {e}"))
                continue
        
        self.stdout.write(self.style.SUCCESS(f'Saved {saved_count} Google Maps items'))

    def scrape_linkedin_jobs(self, query, location):
        data = fetch_linkedin_jobs(query, location)
        
        if not data or not isinstance(data, list):
            self.stdout.write(self.style.ERROR('Failed to fetch LinkedIn Jobs data'))
            return
        
        saved_count = 0
        for item in data:
            try:
                if JobListing.objects.filter(job_id=item.get('job_id')).exists():
                    continue
                
                JobListing.objects.create(
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
                self.stdout.write(self.style.ERROR(f"Error saving job: {e}"))
                continue
        
        self.stdout.write(self.style.SUCCESS(f'Saved {saved_count} LinkedIn Jobs'))