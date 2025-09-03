// MapPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import AccessibleMap from './AccessibleMap';

export default function MapPage() {
  const [healthcareFacilities, setHealthcareFacilities] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/healthcare-facilities/')
      .then(
        console.log(res.data),
        res => setHealthcareFacilities(res.data)
    )
      .catch(err => console.error(err));

    axios.get('http://127.0.0.1:8000/api/jobpostings/')
      .then(res => setJobPostings(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Accessible Map: Healthcare & Jobs</h1>
      <AccessibleMap healthcareFacilities={healthcareFacilities} jobPostings={jobPostings} />
      
      {/* Optional: Text alternatives / list view */}
      <h2>Healthcare Facilities</h2>
      <ul>
        {healthcareFacilities.map(f => (
          <li key={f.place_id}>
            {f.name} — {f.address} {f.contact_number && ` — ${f.contact_number}`}
          </li>
        ))}
      </ul>

      <h2>Job Postings</h2>
      <ul>
        {jobPostings.map(j => (
          <li key={j.job_id}>
            {j.title} — {j.company_name} — {j.location_text}
          </li>
        ))}
      </ul>
    </div>
  );
}
