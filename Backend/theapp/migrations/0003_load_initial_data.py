# In your app/migrations/0002_load_initial_data.py
from django.db import migrations

def load_initial_data(apps, schema_editor):
    JobListing = apps.get_model('theapp', 'JobListing')
    
    initial_data = [
        {
            "job_position": "HR and Payroll Officer",
            "job_link": "https://za.linkedin.com/jobs/view/hr-and-payroll-officer-at-yokogawa-4235506621",
            "job_id": "4235506621",
            "company_name": "Yokogawa",
            "company_profile": "https://jp.linkedin.com/company/yokogawa",
            "job_location": "Johannesburg, Gauteng, South Africa",
            "job_posting_date": "2025-05-24",
            "company_logo_url": "https://media.licdn.com/dms/image/v2/C510BAQEIieCR9bgV7Q/company-logo_100_100/0/1630618745896/yokogawa_logo"
        },
        # Add all other job listings from your sample data
    ]
    
    for data in initial_data:
        JobListing.objects.create(**data)

class Migration(migrations.Migration):
    dependencies = [
        ('theapp', '0001_initial'), 
        ('theapp', '0002_joblisting_remove_jobposting_location_and_more'), # Replace with your actual initial migration
    ]

    operations = [
        migrations.RunPython(load_initial_data),
    ]