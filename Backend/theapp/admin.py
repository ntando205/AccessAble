from django.contrib import admin

# Register your models here.
from .models import AccessibilityLocation, HealthcareFacility, JobPosting
from .services.map_scraper import fetch_and_save_healthcare_data
from django.http import HttpResponse
from django.urls import path
from django.shortcuts import redirect   
from django.contrib import messages
from django.utils.html import format_html
from django.urls import reverse
from django.template.response import TemplateResponse
from django import forms
from django.core.paginator import Paginator
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from django.contrib.admin import SimpleListFilter
from django.contrib.admin.views.main import ChangeList
from django.contrib.admin import DateFieldListFilter
from django.utils.safestring import mark_safe
from django.contrib.admin import TabularInline, StackedInline
from django.contrib.admin import ModelAdmin

admin.site.register(AccessibilityLocation)
admin.site.register(HealthcareFacility)
admin.site.register(JobPosting)