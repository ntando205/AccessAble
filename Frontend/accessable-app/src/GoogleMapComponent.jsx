// GoogleMapComponent.jsx
import { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: -26.2041, // Johannesburg default center
  lng: 28.0473,
};

// Optional: marker icons
const healthcareIcon = "/icons/healthcare.png";
const jobIcon = "/icons/job.png";

export default function GoogleMapComponent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDROu_I_JZ9gb7AwxgStvovSs67AeYfWZo", // use your .env key
  });

  const [healthcareFacilities, setHealthcareFacilities] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    // Fetch healthcare facilities
    axios.get("http://127.0.0.1:8000/api/healthcare-facilities/")
      .then(res => {
      console.log("Healthcare facilities:", res.data);
      setHealthcareFacilities(res.data);
    })
    .catch(err => console.error(err));


    // Fetch job postings
    axios.get("http://127.0.0.1:8000/api/jobpostings/")
      .then(res => {
      console.log("Job postings:", res.data);
      setJobPostings(res.data);
    })
      .catch(err => console.error(err));
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
      >
        {/* Healthcare Markers */}
        {healthcareFacilities
          .filter(f => f.latitude && f.longitude)
          .map(f => (
            <Marker
              key={`healthcare-${f.place_id || f.name}-${f.latitude}-${f.longitude}`}
              position={{
                lat: Number(f.latitude),
                lng: Number(f.longitude),
              }}
              icon={healthcareIcon}
              onClick={() => setSelectedMarker({...f, type: 'healthcare'})}
            />
          ))}

        {/* Job Markers */}
        {jobPostings
          .filter(j => j.location?.latitude && j.location?.longitude)
          .map(j => (
            <Marker
              key={`job-${j.job_id || j.title}-${j.location.latitude}-${j.location.longitude}`}
              position={{
                lat: Number(j.location.latitude),
                lng: Number(j.location.longitude),
              }}
              icon={jobIcon}
              onClick={() => setSelectedMarker({...j, type: 'job'})}
            />
          ))}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: Number(
                selectedMarker.type === 'healthcare' 
                  ? selectedMarker.latitude 
                  : selectedMarker.location?.latitude
              ),
              lng: Number(
                selectedMarker.type === 'healthcare' 
                  ? selectedMarker.longitude 
                  : selectedMarker.location?.longitude
              ),
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              {selectedMarker.type === 'healthcare' ? (
                <>
                  <strong>{selectedMarker.name}</strong><br />
                  {selectedMarker.address}<br />
                  {selectedMarker.contact_number && <>Contact: {selectedMarker.contact_number}<br /></>}
                  {selectedMarker.website && <a href={selectedMarker.website} target="_blank" rel="noopener noreferrer">Website</a>}
                </>
              ) : (
                <>
                  <strong>{selectedMarker.title}</strong><br />
                  {selectedMarker.company_name && <>Company: {selectedMarker.company_name}<br /></>}
                  {selectedMarker.location_text && <>Location: {selectedMarker.location_text}<br /></>}
                  {selectedMarker.job_link && <a href={selectedMarker.job_link} target="_blank" rel="noopener noreferrer">View Job</a>}
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* List Views */}
      <h3>Healthcare Facilities</h3>
      <ul>
        {healthcareFacilities.map(f => (
          <li key={`healthcare-list-${f.place_id || f.name}`}>
            {f.name} — {f.address} {f.contact_number && ` — ${f.contact_number}`}
          </li>
        ))}
      </ul>

      <h3>Job Postings</h3>
      <ul>
        {jobPostings.map(j => (
          <li key={`job-list-${j.job_id || j.title}`}>
            {j.title} — {j.company_name} — {j.location_text}
          </li>
        ))}
      </ul>
    </div>
  );
}