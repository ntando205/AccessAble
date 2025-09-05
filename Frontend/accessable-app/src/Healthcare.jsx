import { useState, useEffect } from "react";
import axios from "axios";
import "./Health.css";

function Healthcare() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Fetch facilities from Django API
  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/maps/search-results-all/");
      
      // Extract search_results from the API response
      const facilitiesData = response.data.search_results || [];
      
      // Map API data to component format
      const mappedFacilities = facilitiesData.map(facility => ({
        id: facility.place_id,
        name: facility.title,
        type: facility.type || "Healthcare Facility",
        lat: facility.gps_coordinates?.latitude,
        lng: facility.gps_coordinates?.longitude,
        address: facility.address,
        rating: facility.rating,
        reviews: facility.reviews,
        phone: facility.phone,
        website: facility.website,
        openState: facility.open_state,
        hours: facility.hours
      }));
      
      setFacilities(mappedFacilities);
      setApiError("");
    } catch (err) {
      console.error("Error fetching facilities:", err);
      setApiError("Failed to load healthcare facilities. Please try again later.");
      // Fallback to sample data
      setFacilities([
        { 
          id: 1, 
          name: "Clinic A", 
          type: "Clinic", 
          lat: -26.2041, 
          lng: 28.0473,
          address: "123 Main St, Johannesburg",
          rating: 4.5,
          reviews: 12
        },
        { 
          id: 2, 
          name: "Hospital B", 
          type: "Hospital", 
          lat: -26.2050, 
          lng: 28.0450,
          address: "456 Oak St, Johannesburg",
          rating: 4.8,
          reviews: 45
        },
        { 
          id: 3, 
          name: "Pharmacy C", 
          type: "Pharmacy", 
          lat: -26.2030, 
          lng: 28.0480,
          address: "789 Pine St, Johannesburg",
          rating: 4.2,
          reviews: 8
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }),
        () => setError("Location access denied. Please enable location services.")
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;
    
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredResults = facilities
    .map((f) => {
      const distance = location && f.lat && f.lng
        ? calculateDistance(location.lat, location.lng, f.lat, f.lng)
        : null;
      return { ...f, distance };
    })
    .filter(
      (f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.type.toLowerCase().includes(search.toLowerCase()) ||
        f.address?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(f => !location || f.distance === null || f.distance <= 50);

  const getFacilityIcon = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower.includes('hospital')) return "🏥";
    if (typeLower.includes('clinic')) return "🩺";
    if (typeLower.includes('pharmacy')) return "💊";
    if (typeLower.includes('nursing')) return "👵";
    if (typeLower.includes('care')) return "❤️";
    if (typeLower.includes('rehabilitation')) return "♿";
    return "🏥"; // default icon
  };

  if (loading) {
    return (
      <div className="resources-section">
        <div className="resources-container">
          <h2>Healthcare Facilities Near You</h2>
          <p className="resources-subtitle">
            Search for clinics, hospitals, and healthcare facilities in your area.
          </p>
          <p className="loading-message">Loading healthcare facilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-section">
      <div className="resources-container">
        <h2>Healthcare Facilities Near You</h2>
        <p className="resources-subtitle">
          Search for clinics, hospitals, and healthcare facilities in your area.
        </p>

        {apiError && (
          <div style={{ 
            backgroundColor: '#fee', 
            border: '1px solid #fcc', 
            color: '#c33', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            {apiError}
            <button 
              onClick={fetchFacilities}
              style={{
                marginLeft: '10px',
                padding: '0.5rem 1rem',
                backgroundColor: '#c33',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Retry
            </button>
          </div>
        )}

        <div className="category-filters">
          <input
            type="text"
            className="category-btn"
            placeholder="Search facilities by name, type, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ cursor: 'text' }}
          />
        </div>

        {error && (
          <p style={{ 
            color: '#c33', 
            textAlign: 'center', 
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#fee',
            borderRadius: '8px',
            border: '1px solid #fcc'
          }}>
            {error}
          </p>
        )}
        
        {!location && !error && (
          <p style={{ 
            color: '#666', 
            textAlign: 'center', 
            marginBottom: '2rem',
            fontStyle: 'italic'
          }}>
            Detecting your location...
          </p>
        )}

        <div className="resources-grid">
          {filteredResults.length > 0 ? (
            filteredResults.map((f) => (
              <div className="resource-card" key={f.id}>
                <div className="resource-icon">
                  {getFacilityIcon(f.type)}
                </div>
                <h3>{f.name}</h3>
                <p style={{ color: '#666', fontWeight: '500', margin: '0.5rem 0' }}>
                  {f.type}
                </p>
                
                {f.rating && (
                  <p style={{ color: '#e67e22', margin: '0.5rem 0', fontSize: '0.95rem' }}>
                    ⭐ {f.rating} ({f.reviews} reviews)
                  </p>
                )}
                
                {f.address && (
                  <p style={{ color: '#7f8c8d', margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    📍 {f.address}
                  </p>
                )}
                
                {f.distance !== null && (
                  <p style={{ color: '#27ae60', margin: '0.5rem 0', fontWeight: '600' }}>
                    🚗 {f.distance.toFixed(1)} km away
                  </p>
                )}
                
                {f.phone && (
                  <p style={{ color: '#3498db', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    📞 {f.phone}
                  </p>
                )}
                
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {f.website && (
                    <a 
                      href={f.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        background: '#4f46e5',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#3730a3'}
                      onMouseOut={(e) => e.target.style.background = '#4f46e5'}
                    >
                      Visit Website
                    </a>
                  )}
                  {f.lat && f.lng && (
                    <button 
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#059669'}
                      onMouseOut={(e) => e.target.style.background = '#10b981'}
                      onClick={() => {
                        window.open(`https://www.google.com/maps?q=${f.lat},${f.lng}`, '_blank');
                      }}
                    >
                      View on Map
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              color: '#666', 
              fontStyle: 'italic',
              padding: '2rem'
            }}>
              {search ? `No facilities found matching "${search}"` : 'No facilities found nearby.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Healthcare;