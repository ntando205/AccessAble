import { useState, useEffect } from "react";
import "./Health.css";

function Healthcare() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const facilities = [
    { name: "Clinic A", type: "Clinic", lat: -26.2041, lng: 28.0473 },
    { name: "Hospital B", type: "Hospital", lat: -26.2050, lng: 28.0450 },
    { name: "Pharmacy C", type: "Pharmacy", lat: -26.2030, lng: 28.0480 }
  ];

  useEffect(() => {
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
      const distance = location
        ? calculateDistance(location.lat, location.lng, f.lat, f.lng)
        : null;
      return { ...f, distance };
    })
    .filter(
      (f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) &&
        (!location || f.distance <= 50)
    );

  return (
    <div className="resources-section">
      <div className="resources-container">
        <h2>Healthcare Facilities Near You</h2>
        <p className="resources-subtitle">
          Search for clinics, hospitals, and pharmacies in your area.
        </p>

        <div className="category-filters">
          <input
            type="text"
            className="category-btn"
            placeholder="Search facilities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {!location && !error && (
          <p className="loading-message">DetecClinicting your location...</p>
        )}

        <div className="resources-grid">
          {filteredResults.length > 0 ? (
            filteredResults.map((f, idx) => (
              <div className="resource-card" key={idx}>
                <div className="resource-icon">
                  {f.type === "Hospital"
                    ? "🏥"
                    : f.type === "Clinic"
                    ? "🩺"
                    : "💊"}
                </div>
                <h3>{f.name}</h3>
                <p>{f.type}</p>
                {f.distance !== null && (
                  <p>{f.distance.toFixed(1)} km away</p>
                )}
              </div>
            ))
          ) : (
            <p className="no-results">No facilities found nearby.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Healthcare;

