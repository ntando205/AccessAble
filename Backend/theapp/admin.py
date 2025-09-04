from django.contrib import admin
from .models import JobListing, SearchResult, GPSCoordinates, OperatingHours, SearchResultType

# Job Listing Admin
class JobListingAdmin(admin.ModelAdmin):
    list_display = ['job_position', 'company_name', 'job_location', 'job_posting_date']
    list_filter = ['company_name', 'job_location', 'job_posting_date']
    search_fields = ['job_position', 'company_name', 'job_location']
    readonly_fields = ['created_at', 'updated_at']

# Google Maps Search Results Admin
class SearchResultTypeInline(admin.TabularInline):
    model = SearchResultType
    extra = 1

class SearchResultAdmin(admin.ModelAdmin):
    list_display = ['title', 'type', 'rating', 'reviews', 'address']
    list_filter = ['type', 'rating', 'unclaimed_business']
    search_fields = ['title', 'address', 'type']
    inlines = [SearchResultTypeInline]
    readonly_fields = ['created_at', 'updated_at']

class GPSCoordinatesAdmin(admin.ModelAdmin):
    list_display = ['latitude', 'longitude']
    search_fields = ['latitude', 'longitude']

class OperatingHoursAdmin(admin.ModelAdmin):
    list_display = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

# Register all models
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(SearchResult, SearchResultAdmin)
admin.site.register(GPSCoordinates, GPSCoordinatesAdmin)
admin.site.register(OperatingHours, OperatingHoursAdmin)
admin.site.register(SearchResultType)