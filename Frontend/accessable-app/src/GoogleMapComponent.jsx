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
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    // Fetch healthcare facilities
    axios.get("http://127.0.0.1:8000/api/healthcare-facilities/")
      .then(res => {
        console.log("Healthcare facilities with coordinates:", 
          res.data.results.filter(f => f.latitude && f.longitude && f.latitude !== 0 && f.longitude !== 0)
        );
        setHealthcareFacilities(res.data.results);
      })
      .catch(err => console.error(err));

    // Fetch job postings
    axios.get("http://127.0.0.1:8000/api/jobpostings/")
      .then(res => {
        console.log("Job postings with coordinates:", 
          res.data.results.filter(j => j.location?.latitude && j.location?.longitude && j.location.latitude !== 0 && j.location.longitude !== 0)
        );
        setJobPostings(res.data.results);
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
        center={mapCenter}
      >
        {/* Healthcare Markers - only show those with valid coordinates */}
        {healthcareFacilities
          .filter(f => f.latitude && f.longitude && f.latitude !== 0 && f.longitude !== 0)
          .map((f, index) => (
            <Marker
              key={`healthcare-${f.id || f.place_id || index}`}
              position={{
                lat: Number(f.latitude),
                lng: Number(f.longitude),
              }}
              icon={healthcareIcon}
              onClick={() => {
                setSelectedMarker({...f, type: 'healthcare'});
                setMapCenter({
                  lat: Number(f.latitude),
                  lng: Number(f.longitude)
                });
              }}
            />
          ))}

        {/* Job Markers - only show those with valid coordinates */}
        {jobPostings
          .filter(j => j.location?.latitude && j.location?.longitude && j.location.latitude !== 0 && j.location.longitude !== 0)
          .map((j, index) => (
            <Marker
              key={`job-${j.id || j.job_id || index}`}
              position={{
                lat: Number(j.location.latitude),
                lng: Number(j.location.longitude),
              }}
              icon={jobIcon}
              onClick={() => {
                setSelectedMarker({...j, type: 'job'});
                setMapCenter({
                  lat: Number(j.location.latitude),
                  lng: Number(j.location.longitude)
                });
              }}
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
        {healthcareFacilities.map((f, index) => (
          <li key={`healthcare-list-${f.id || f.place_id || index}`}>
            {f.name} — {f.address} {f.contact_number && ` — ${f.contact_number}`}
            {(!f.latitude || !f.longitude || f.latitude === 0 || f.longitude === 0) && 
              <span style={{color: 'red', marginLeft: '10px'}}>(No coordinates)</span>
            }
          </li>
        ))}
      </ul>

      <h3>Job Postings</h3>
      <ul>
        {jobPostings.map((j, index) => (
          <li key={`job-list-${j.id || j.job_id || index}`}>
            {j.title} — {j.company_name} — {j.location_text}
            {(!j.location?.latitude || !j.location?.longitude || j.location.latitude === 0 || j.location.longitude === 0) && 
              <span style={{color: 'red', marginLeft: '10px'}}>(No coordinates)</span>
            }
          </li>
        ))}
      </ul>
    </div>
  );
}