from django.db import models

# Create your models here.
class AccessibilityLocation(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

class AccessibilityMap(models.Model):##Map of location 
    location = models.ForeignKey(AccessibilityLocation, on_delete=models.CASCADE)
    is_accessible = models.BooleanField(default=False)
    accessibility_score = models.IntegerField(default=0)

# models.py

class JobPosting(models.Model):
    # core fields
    job_id = models.CharField(max_length=50, blank=True, null=True, unique=True)  
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    location_text = models.CharField(max_length=200, blank=True, null=True)  # free-text location (e.g., LinkedIn)
    location = models.ForeignKey('AccessibilityLocation', on_delete=models.CASCADE, blank=True, null=True)

    # company info
    company_name = models.CharField(max_length=200, blank=True, null=True)
    company_profile = models.URLField(blank=True, null=True)
    company_logo_url = models.URLField(blank=True, null=True)

    # metadata
    job_link = models.URLField(blank=True, null=True)
    posted_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    # origin
    source = models.CharField(max_length=50, default="local")  
    # values: "local", "linkedin", "scrapingdog", etc.

    def __str__(self):
        return f"{self.title} at {self.company_name or 'Unknown'}"



class HealthcareFacility(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255)
    location = models.ForeignKey(AccessibilityLocation, on_delete=models.CASCADE)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(max_length=200, blank=True, null=True)
    
    # new fields
    rating = models.FloatField(blank=True, null=True)
    reviews_count = models.IntegerField(blank=True, null=True)
    open_state = models.CharField(max_length=100, blank=True, null=True)   # e.g., "Open ⋅ Closes 5 PM"
    hours = models.JSONField(blank=True, null=True)  # store operating_hours JSON

    def __str__(self):
        return f"{self.name} ({self.rating or 'No rating'})"
