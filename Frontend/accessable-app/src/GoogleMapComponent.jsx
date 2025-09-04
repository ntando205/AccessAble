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
  //   axios.get("http://127.0.0.1:8000/api/jobpostings/")
  //     .then(res => {
  //       console.log("Job postings with coordinates:", 
  //         res.data.results.filter(j => j.location?.latitude && j.location?.longitude && j.location.latitude !== 0 && j.location.longitude !== 0)
  //       );
  //       setJobPostings(res.data.results);
  //     })
  //     .catch(err => console.error(err));
  // }, []);

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

        {/* Job Markers - only show those with valid coordinates
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
          ))} */}

          {/* Test markers in Johannesburg */}
          {[
            {lat: -26.2041, lng: 28.0473, title: "Test Marker 1 - Johannesburg"},
            {lat: -26.1941, lng: 28.0573, title: "Test Marker 2 - Johannesburg"},
          ].map((marker, index) => (
            <Marker
              key={`test-${index}`}
              position={{lat: marker.lat, lng: marker.lng}}
              onClick={() => {
                setSelectedMarker({title: marker.title, type: 'test'});
                setMapCenter({lat: marker.lat, lng: marker.lng});
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



// import { useState, useEffect } from "react";

// const LocationDataComponent = () => {
//   const [jobPostings, setJobPostings] = useState([]);
//   const [healthcareFacilities, setHealthcareFacilities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch job postings data
//         const jobsResponse = await fetch("http://127.0.0.1:8000/api/jobpostings/");
//         const jobsData = await jobsResponse.json();
        
//         // Fetch healthcare facilities data
//         const healthcareResponse = await fetch("http://127.0.0.1:8000/api/healthcare-facilities/");
//         const healthcareData = await healthcareResponse.json();
        
//         setJobPostings(jobsData.results || []);
//         setHealthcareFacilities(healthcareData.results || []);
        
//       } catch (err) {
//         setError("Failed to fetch data");
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       } axios.get("http://127.0.0.1:8000/api/jobpostings/")
  //     .then(res => {
  //       console.log("Job postings with coordinates:", 
  //         res.data.results.filter(j => j.location?.latitude && j.location?.longitude && j.location.latitude !== 0 && j.location.longitude !== 0)
  //       );
  //       setJobPostings(res.data.results);
  //     })
  //     .catch(err => console.error(err));
  // }, []);
//     };

//     fetchData();
//   }, []);

//   // Function to extract coordinates from job postings
//   const getJobCoordinates = (job) => {
//     return {
//       id: job.id || job.job_id,
//       title: job.title,
//       company: job.company_name,
//       locationText: job.location_text,
//       latitude: job.location?.latitude || 0,
//       longitude: job.location?.longitude || 0,
//       hasValidCoordinates: job.location?.latitude !== 0 && job.location?.longitude !== 0
//     };
//   };

//   // Function to extract coordinates from healthcare facilities
//   const getHealthcareCoordinates = (facility) => {
//     return {
//       id: facility.id || facility.place_id,
//       name: facility.name,
//       address: facility.address,
//       latitude: facility.latitude || facility.location?.latitude || 0,
//       longitude: facility.longitude || facility.location?.longitude || 0,
//       hasValidCoordinates: (facility.latitude !== 0 && facility.longitude !== 0) || 
//                           (facility.location?.latitude !== 0 && facility.location?.longitude !== 0)
//     };
//   };

//   if (loading) return <div>Loading data...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h2>Location Coordinates</h2>
      
//       {/* Job Postings Coordinates */}
//       <div>
//         <h3>Job Postings Coordinates ({jobPostings.length} jobs)</h3>
//         <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
//           {jobPostings.map(job => {
//             const coords = getJobCoordinates(job);
//             return (
//               <div key={coords.id} style={{
//                 border: '1px solid #ccc', 
//                 padding: '10px', 
//                 borderRadius: '5px',
//                 backgroundColor: coords.hasValidCoordinates ? '#e8f5e8' : '#ffe6e6'
//               }}>
//                 <strong>{coords.title}</strong>
//                 <p>Company: {coords.company}</p>
//                 <p>Location: {coords.locationText}</p>
//                 <p>Latitude: {coords.latitude}</p>
//                 <p>Longitude: {coords.longitude}</p>
//                 <p style={{color: coords.hasValidCoordinates ? 'green' : 'red'}}>
//                   {coords.hasValidCoordinates ? 'Valid Coordinates' : 'Invalid Coordinates (0,0)'}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Healthcare Facilities Coordinates */}
//       <div style={{marginTop: '20px'}}>
//         <h3>Healthcare Facilities Coordinates ({healthcareFacilities.length} facilities)</h3>
//         <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
//           {healthcareFacilities.map(facility => {
//             const coords = getHealthcareCoordinates(facility);
//             return (
//               <div key={coords.id} style={{
//                 border: '1px solid #ccc', 
//                 padding: '10px', 
//                 borderRadius: '5px',
//                 backgroundColor: coords.hasValidCoordinates ? '#e8f5e8' : '#ffe6e6'
//               }}>
//                 <strong>{coords.name}</strong>
//                 <p>Address: {coords.address}</p>
//                 <p>Latitude: {coords.latitude}</p>
//                 <p>Longitude: {coords.longitude}</p>
//                 <p style={{color: coords.hasValidCoordinates ? 'green' : 'red'}}>
//                   {coords.hasValidCoordinates ? 'Valid Coordinates' : 'Invalid Coordinates'}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Summary Statistics */}
//       <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px'}}>
//         <h3>Summary</h3>
//         <p>Total Job Postings: {jobPostings.length}</p>
//         <p>Jobs with Valid Coordinates: {
//           jobPostings.filter(job => 
//             job.location?.latitude !== 0 && job.location?.longitude !== 0
//           ).length
//         }</p>
//         <p>Total Healthcare Facilities: {healthcareFacilities.length}</p>
//         <p>Healthcare Facilities with Valid Coordinates: {
//           healthcareFacilities.filter(facility => 
//             (facility.latitude !== 0 && facility.longitude !== 0) || 
//             (facility.location?.latitude !== 0 && facility.location?.longitude !== 0)
//           ).length
//         }</p>
//       </div>
//     </div>
//   );
// };

// export default LocationDataComponent;)
  )}