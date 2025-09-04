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

### Job-Postings : "http://127.0.0.1:8000/api/jobpostings/"
#### Data Format:
```JSON
{
    "count": 11,
    "next": "http://127.0.0.1:8000/api/jobpostings/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "job_id": "4294398666",
            "title": "Office Manager, RSA",
            "description": "",
            "location_text": "City of Johannesburg, Gauteng, South Africa",
            "location": {
                "id": 8,
                "name": "City of Johannesburg, Gauteng, South Africa",
                "description": "Job location (auto-generated)",
                "address": "City of Johannesburg, Gauteng, South Africa",
                "latitude": 0.0,
                "longitude": 0.0
            },
            "company_name": "Dandy",
            "company_profile": "https://www.linkedin.com/company/dandyofficial?trk=public_jobs_jserp-result_job-search-card-subtitle",
            "company_logo_url": "https://media.licdn.com/dms/image/v2/C4E0BAQGbpEfk4uSBzQ/company-logo_100_100/company-logo_100_100/0/1669005247358/dandyofficial_logo?e=2147483647&v=beta&t=jYc-9oCwHTuVgwCsVpBAATM_MdVKKBQui1F5zjvoBZo",
            "job_link": "https://za.linkedin.com/jobs/view/office-manager-rsa-at-dandy-4294398666?position=1&pageNum=0&refId=p8AFagsEbwAzJbMHQFEIGQ%3D%3D&trackingId=cCJ7IX4wxkuCl7fUU6oztQ%3D%3D",
            "posted_date": "2025-09-02",
            "is_active": true,
            "source": "linkedin"
        },
        ]
}
```
### Healthcare-Facilities : "http://127.0.0.1:8000/api/healthcare-facilities/"
#### Data Format:
```JSON
{
    "count": 93,
    "next": "http://127.0.0.1:8000/api/healthcare-facilities/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "place_id": "ChIJ45OTCvNZwokRseRdDCdHBrc",
            "name": "VISIONS/Services for the Blind and Visually Impaired",
            "description": "Non-profit organization",
            "address": "500 Greenwich St Suite 302,New York, NY 10013",
            "location": {
                "id": 1,
                "name": "VISIONS/Services for the Blind and Visually Impaired",
                "description": "Non-profit organization",
                "address": "500 Greenwich St Suite 302,New York, NY 10013",
                "latitude": 40.725520499999995,
                "longitude": -74.009383
            },
            "latitude": 40.725520499999995,
            "longitude": -74.009383,
            "contact_number": "+12126251616",
            "website": "http://www.visionsvcb.org/",
            "rating": 3.3,
            "reviews_count": 10,
            "open_state": "Closed ⋅ Opens 9 AM Thu",
            "hours": {
                "wednesday": "9 AM–5 PM",
                "thursday": "9 AM–5 PM",
                "friday": "9 AM–5 PM",
                "saturday": "Closed",
                "sunday": "Closed",
                "monday": "9 AM–5 PM",
                "tuesday": "9 AM–5 PM"
            }
        },
        ]
}
```
