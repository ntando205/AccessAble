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

### Job-Postings : "http://127.0.0.1:8000/api/job-postings/"
#### Data Format:
```JSON
[
    {
        "url": "http://127.0.0.1:8000/api/job-postings/1/",
        "title": "Office Manager, RSA",
        "description": "",
        "location": "http://127.0.0.1:8000/api/accessibility-locations/8/",
        "posted_date": "2025-09-02",
        "is_active": true
    },
    {
        "url": "http://127.0.0.1:8000/api/job-postings/2/",
        "title": "Assistant Artisan",
        "description": "",
        "location": "http://127.0.0.1:8000/api/accessibility-locations/9/",
        "posted_date": "2025-09-02",
        "is_active": true
    },
]
```
### Healthcare-Facilities : "http://127.0.0.1:8000/api/healthcare-facilities/"
#### Data Format:
```JSON
[
    {
        "url": "http://127.0.0.1:8000/api/healthcare-facilities/1/",
        "name": "VISIONS/Services for the Blind and Visually Impaired",
        "description": "Social services organization",
        "address": "500 Greenwich St Suite 302,New York, NY 10013",
        "location": "http://127.0.0.1:8000/api/accessibility-locations/1/",
        "contact_number": "+12126251616",
        "website": "http://www.visionsvcb.org/"
    },
    {
        "url": "http://127.0.0.1:8000/api/healthcare-facilities/2/",
        "name": "NYS Commission for the Blind",
        "description": "State government office",
        "address": "80 Maiden Ln # 401,New York, NY 10038",
        "location": "http://127.0.0.1:8000/api/accessibility-locations/2/",
        "contact_number": "+12128255710",
        "website": "https://ocfs.ny.gov/programs/nyscb/"
    },
]
```
