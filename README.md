# AccessAble
## Running the Backend
```bash
cd Backend/
source ../env/bin/activate
python manage.py runserver
```
## Running the Frontend
```bash
cd Frontend/accessable-app/
npm install
npm run dev
```
## Backend APIs
### Accessibility-Map : "http://127.0.0.1:8000/api/accessibility-maps/"
#### Data Format:
-none yet

### Job-Postings : "(http://127.0.0.1:8000/api/jobs/)"
#### Data Format:
```JSON
[
        {
            "job_position": "Private Service Advisor",
            "job_link": "https://za.linkedin.com/jobs/view/private-service-advisor-at-fnb-south-africa-4269210745?position=2&pageNum=0&refId=IVIR9mNN5e%2FFvejXKIegYQ%3D%3D&trackingId=M9P2lyv31UJ9iATi8ode1g%3D%3D",
            "job_id": "4269210745",
            "company_name": "FNB South Africa",
            "company_profile": "https://za.linkedin.com/company/fnbsa?trk=public_jobs_jserp-result_job-search-card-subtitle",
            "job_location": "Johannesburg, Gauteng, South Africa",
            "job_posting_date": "2025-09-04",
            "company_logo_url": "https://media.licdn.com/dms/image/v2/D4D0BAQFB5cMJvCFFdg/company-logo_100_100/B4DZXa8Bd4HwAQ-/0/1743134923343/fnbsa_logo?e=2147483647&v=beta&t=igFq7IlGdztrlX06ofYQC1cjEfQ0I128vpskF7RMQ5c"
        },
        {
            "job_position": "Sales Advisor",
            "job_link": "https://za.linkedin.com/jobs/view/sales-advisor-at-fnb-south-africa-4278217161?position=3&pageNum=0&refId=IVIR9mNN5e%2FFvejXKIegYQ%3D%3D&trackingId=2uaRz%2B7y8%2BmK%2B%2FuLfbSGtA%3D%3D",
            "job_id": "4278217161",
            "company_name": "FNB South Africa",
            "company_profile": "https://za.linkedin.com/company/fnbsa?trk=public_jobs_jserp-result_job-search-card-subtitle",
            "job_location": "Randburg, Gauteng, South Africa",
            "job_posting_date": "2025-09-04",
            "company_logo_url": "https://media.licdn.com/dms/image/v2/D4D0BAQFB5cMJvCFFdg/company-logo_100_100/B4DZXa8Bd4HwAQ-/0/1743134923343/fnbsa_logo?e=2147483647&v=beta&t=igFq7IlGdztrlX06ofYQC1cjEfQ0I128vpskF7RMQ5c"
        },
        ]
```
### Healthcare-Facilities : "http://127.0.0.1:8000/api/maps/search-results-all/"
#### Data Format:
```JSON
{
    "search_results": [
        {
            "title": "Hope Convalescent Home (Children) & Hope Training Home",
            "place_id": "ChIJ_____3sMlR4R2lOofe6pR8M",
            "data_id": "0x1e950c7bffffffff:0xc347a9ee7da853da",
            "data_cid": "-4375341671191653414",
            "reviews_link": "https://api.scrapingdog.com/google_maps/reviews?api_key=68ba128919083f73e724aaa0&data_id=0x1e950c7bffffffff:0xc347a9ee7da853da",
            "photos_link": "https://api.scrapingdog.com/google_maps/photos?api_key=68ba128919083f73e724aaa0&data_id=0x1e950c7bffffffff:0xc347a9ee7da853da",
            "posts_link": "https://api.scrapingdog.com/google_maps/posts?api_key=68ba128919083f73e724aaa0&data_id=0x1e950c7bffffffff:0xc347a9ee7da853da",
            "gps_coordinates": {
                "latitude": -26.164769399999997,
                "longitude": 28.024463899999997
            },
            "provider_id": "/g/11b5yt6_pt",
            "rating": 5.0,
            "reviews": 2,
            "type": "Nursing home",
            "types": [
                {
                    "type_name": "Nursing home"
                },
                {
                    "type_name": "Training center"
                }
            ],
            "address": "36 Pallinghurst Road, Westcliffe,Randburg,2193,South Africa",
            "open_state": null,
            "hours": null,
            "operating_hours": {
                "monday": null,
                "tuesday": null,
                "wednesday": null,
                "thursday": null,
                "friday": null,
                "saturday": null,
                "sunday": null
            },
            "phone": "+27116465810",
            "website": null,
            "thumbnail": null,
            "image": null,
            "google_maps_url": "https://www.google.com/maps/place/Hope+Convalescent+Home+(Children)+&+Hope+Training+Home/@-26.164769399999997,28.024463899999997,NaN/data=!3m1!1e3!4m6!3m5!1s0x1e950c7bffffffff:0xc347a9ee7da853da!8m2!3d-26.164769399999997!4d28.024463899999997!16s",
            "unclaimed_business": true
        },
}
```
