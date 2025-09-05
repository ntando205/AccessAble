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
    .filter(f => !location || f.distance === null || f.distance <= 50); // Show all if no location, otherwise filter by distance

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
          <div className="error-message" style={{marginBottom: '1rem'}}>
            {apiError}
            <button 
              onClick={fetchFacilities}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
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
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {!location && !error && (
          <p className="loading-message">Detecting your location...</p>
        )}

        <div className="resources-grid">
          {filteredResults.length > 0 ? (
            filteredResults.map((f) => (
              <div className="resource-card" key={f.id}>
                <div className="resource-icon">
                  {getFacilityIcon(f.type)}
                </div>
                <h3>{f.name}</h3>
                <p className="facility-type">{f.type}</p>
                
                {f.rating && (
                  <p className="facility-rating">
                    ⭐ {f.rating} ({f.reviews} reviews)
                  </p>
                )}
                
                {f.address && (
                  <p className="facility-address">
                    📍 {f.address}
                  </p>
                )}
                
                {f.distance !== null && (
                  <p className="facility-distance">
                    🚗 {f.distance.toFixed(1)} km away
                  </p>
                )}
                
                {f.phone && (
                  <p className="facility-phone">
                    📞 {f.phone}
                  </p>
                )}
                
                <div className="facility-actions">
                  {f.website && (
                    <a 
                      href={f.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="facility-link"
                    >
                      Visit Website
                    </a>
                  )}
                  <button 
                    className="facility-link"
                    onClick={() => {
                      if (f.lat && f.lng) {
                        window.open(`https://www.google.com/maps?q=${f.lat},${f.lng}`, '_blank');
                      }
                    }}
                  >
                    View on Map
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">
              {search ? `No facilities found matching "${search}"` : 'No facilities found nearby.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Healthcare;