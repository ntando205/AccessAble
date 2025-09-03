# services/linkedin_jobs.py
import requests
from datetime import datetime
from ..models import JobPosting
from Backend.AccessAble.settings import api_keyy


def fetch_and_save_jobs(query="disability jobs", location="Johannesburg,South Africa"):
    api_key = api_keyy
    url = "https://api.scrapingdog.com/linkedinjobs"

    params = {
        "api_key": api_key,
        "field": query,
        "location": location,
        "page": 1,
        "sort_by": "",
        "job_type": "",
        "exp_level": "",
        "work_type": "",
        "filter_by_company": ""
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        jobs = response.json()

        for job in jobs:
            JobPosting.objects.update_or_create(
                job_id=job.get("job_id"),
                defaults={
                    "title": job.get("job_position"),
                    "company_name": job.get("company_name"),
                    "company_profile": job.get("company_profile"),
                    "company_logo_url": job.get("company_logo_url"),
                    "location_text": job.get("job_location"),
                    "job_link": job.get("job_link"),
                    "posted_date": (
                        datetime.strptime(job.get("job_posting_date"), "%Y-%m-%d").date()
                        if job.get("job_posting_date") else None
                    ),
                    "description": "",  # LinkedIn API doesn’t give full JD
                    "is_active": True,
                    "source": "linkedin"
                }
            )

        return f"Imported {len(jobs)} jobs from LinkedIn"
    else:
        return f"Request failed: {response.status_code}"
