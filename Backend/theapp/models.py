from django.db import models

# Job Listing Models
class JobListing(models.Model):
    job_id = models.CharField(max_length=20, unique=True, primary_key=True)
    job_position = models.CharField(max_length=255)
    job_link = models.URLField(max_length=500)
    company_name = models.CharField(max_length=255)
    company_profile = models.URLField(max_length=500)
    job_location = models.CharField(max_length=255)
    job_posting_date = models.DateField()
    company_logo_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-job_posting_date', 'company_name']
        verbose_name = 'Job Listing'
        verbose_name_plural = 'Job Listings'

    def __str__(self):
        return f"{self.job_position} at {self.company_name}"

# Google Maps Search Results Models
class GPSCoordinates(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        verbose_name = 'GPS Coordinates'
        verbose_name_plural = 'GPS Coordinates'

    def __str__(self):
        return f"({self.latitude}, {self.longitude})"

class OperatingHours(models.Model):
    monday = models.CharField(max_length=50, blank=True, null=True)
    tuesday = models.CharField(max_length=50, blank=True, null=True)
    wednesday = models.CharField(max_length=50, blank=True, null=True)
    thursday = models.CharField(max_length=50, blank=True, null=True)
    friday = models.CharField(max_length=50, blank=True, null=True)
    saturday = models.CharField(max_length=50, blank=True, null=True)
    sunday = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        verbose_name = 'Operating Hours'
        verbose_name_plural = 'Operating Hours'

    def __str__(self):
        return f"Operating Hours {self.id}"

class SearchResult(models.Model):
    title = models.CharField(max_length=255)
    place_id = models.CharField(max_length=255, unique=True)
    data_id = models.CharField(max_length=255, blank=True, null=True)
    data_cid = models.CharField(max_length=255, blank=True, null=True)
    reviews_link = models.URLField(max_length=500, blank=True, null=True)
    photos_link = models.URLField(max_length=500, blank=True, null=True)
    posts_link = models.URLField(max_length=500, blank=True, null=True)
    gps_coordinates = models.OneToOneField(
        GPSCoordinates, 
        on_delete=models.CASCADE,
        related_name='search_result'
    )
    provider_id = models.CharField(max_length=255, blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    reviews = models.IntegerField(blank=True, null=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    open_state = models.CharField(max_length=100, blank=True, null=True)
    hours = models.CharField(max_length=100, blank=True, null=True)
    operating_hours = models.OneToOneField(
        OperatingHours,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='search_result'
    )
    phone = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(max_length=500, blank=True, null=True)
    thumbnail = models.URLField(max_length=500, blank=True, null=True)
    image = models.URLField(max_length=500, blank=True, null=True)
    google_maps_url = models.URLField(max_length=500, blank=True, null=True)
    unclaimed_business = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', '-reviews']
        verbose_name = 'Search Result'
        verbose_name_plural = 'Search Results'

    def __str__(self):
        return self.title

class SearchResultType(models.Model):
    search_result = models.ForeignKey(
        SearchResult, 
        on_delete=models.CASCADE, 
        related_name='types'
    )
    type_name = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Search Result Type'
        verbose_name_plural = 'Search Result Types'
        unique_together = ['search_result', 'type_name']

    def __str__(self):
        return f"{self.search_result.title} - {self.type_name}"