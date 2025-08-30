from django.db import models

# Create your models here.
class AccessibilityLocation(models.Model):##Accessible location
    name = models.CharField(max_length=100)
    description = models.TextField()
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()

class AccessibilityMap(models.Model):##Map of location 
    location = models.ForeignKey(AccessibilityLocation, on_delete=models.CASCADE)
    is_accessible = models.BooleanField(default=False)
    accessibility_score = models.IntegerField(default=0)

class JobPosting(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    location = models.ForeignKey(AccessibilityLocation, on_delete=models.CASCADE)
    posted_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

class HealthcareFacility(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    address = models.CharField(max_length=255)
    location = models.ForeignKey(AccessibilityLocation, on_delete=models.CASCADE)
    contact_number = models.CharField(max_length=15)
    website = models.URLField(max_length=200)