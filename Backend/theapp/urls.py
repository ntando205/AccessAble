from django.urls import path, include
from . import views

urlpatterns = [
    # API Root
    path('', views.api_root, name='api-root'),

    # Job Listing endpoints
    path('jobs/', views.JobListingListCreateView.as_view(), name='job-list-create'),
    path('jobs/<str:job_id>/', views.JobListingDetailView.as_view(), name='job-detail'),
    path('jobs/company/<str:company_name>/', views.job_listings_by_company, name='jobs-by-company'),
    path('jobs/location/<str:location>/', views.job_listings_by_location, name='jobs-by-location'),
    
    # Google Maps HealthCare locations Search Results endpoints
    path('maps/search-results/', views.SearchResultListCreateView.as_view(), name='search-result-list-create'),
    path('maps/search-results/<str:place_id>/', views.SearchResultDetailView.as_view(), name='search-result-detail'),
    path('maps/search-results/type/<str:type_name>/', views.search_results_by_type, name='search-results-by-type'),
    path('maps/search-results/rating/<str:min_rating>/', views.search_results_by_rating, name='search-results-by-rating'),
    path('maps/search-results-all/', views.all_search_results, name='all-search-results'),

    # Scraping endpoints
    path('scrape/google-maps/', views.scrape_and_save_google_maps, name='scrape-google-maps'),
    path('scrape/linkedin-jobs/', views.scrape_and_save_linkedin_jobs, name='scrape-linkedin-jobs'),
    path('scrape/all/', views.scrape_all_data, name='scrape-all'),

]