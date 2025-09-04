from django.contrib import admin
from .models import AccessibilityLocation, AccessibilityMap, JobPosting, HealthcareFacility

# Register your models here.
admin.site.register(AccessibilityLocation)
admin.site.register(AccessibilityMap)
admin.site.register(JobPosting)
admin.site.register(HealthcareFacility)
