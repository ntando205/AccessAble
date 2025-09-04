import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: -26.2041,
  lng: 28.0473
};

const markerIcons = {
  healthcare: {
    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    scaledSize: { width: 32, height: 32 }
  },
  jobs: {
    url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    scaledSize: { width: 32, height: 32 }
  }
};

const GoogleMapComponent = () => {
  const [viewMode, setViewMode] = useState('healthcare');
  const [healthcareData, setHealthcareData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);

  const api_key = import.meta.env.VITE_SCRAPINGDOG_API_KEY;
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const fetchHealthcareFacilities = useCallback(async () => {
    try {
      const url = 'https://api.scrapingdog.com/google_maps/';
      const params = {
        api_key: api_key,
        query: 'healthcare facilities for disabled people in Gauteng',
        ll: '',
        page: 0,
      };

      const response = await axios.get(url, { params });
      
      if (response.status === 200) {
        setHealthcareData(response.data.search_results || []);
      } else {
        throw new Error(`Healthcare request failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching healthcare facilities:', err);
      setError('Failed to load healthcare facilities');
    }
  }, [api_key]);

  const fetchJobs = useCallback(async () => {
    try {
      const url = 'https://api.scrapingdog.com/linkedinjobs/';
      const params = {
        api_key: api_key,
        field: 'disability jobs in Gauteng, South Africa',
        geoid: '',
        location: '',
        page: 3,
      };

      const response = await axios.get(url, { params });
      
      if (response.status === 200) {
        setJobsData(response.data || []);
      } else {
        throw new Error(`Jobs request failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job listings');
    }
  }, [api_key]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchHealthcareFacilities(),
        fetchJobs()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchHealthcareFacilities, fetchJobs]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const onMarkerClick = useCallback((item, markerType) => {
  console.log('Marker clicked:', item, markerType);
  setSelectedItem({ ...item, markerType }); // Use a different property name
}, []);

  const onInfoWindowClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getCoordinatesForJob = useCallback((jobLocation) => {
    const locationMap = {
      'johannesburg': { lat: -26.2041, lng: 28.0473 },
      'sandton': { lat: -26.1076, lng: 28.0567 },
      'pretoria': { lat: -25.7479, lng: 28.2293 },
      'midrand': { lat: -25.9964, lng: 28.1373 },
      'germiston': { lat: -26.2183, lng: 28.1678 },
      'randburg': { lat: -26.0941, lng: 27.9963 },
      'centurion': { lat: -25.8589, lng: 28.1855 },
      'krugersdorp': { lat: -26.1015, lng: 27.8066 },
      'springs': { lat: -26.2584, lng: 28.4713 },
      'muldersdrif': { lat: -25.9833, lng: 27.8667 }
    };

    const location = jobLocation.toLowerCase();
    for (const [key, coords] of Object.entries(locationMap)) {
      if (location.includes(key)) {
        return coords;
      }
    }

    return defaultCenter;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg">Loading data...</div>
      </div>
    );
  }

  const currentData = viewMode === 'healthcare' ? healthcareData : jobsData;

  return (
    <div className="w-full">
      {/* Toggle Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setViewMode('healthcare')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            viewMode === 'healthcare'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Healthcare Facilities
        </button>
        <button
          onClick={() => setViewMode('jobs')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            viewMode === 'jobs'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Disability Jobs
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={fetchAllData}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Healthcare Markers */}
          {viewMode === 'healthcare' && healthcareData.map((facility) => (
            <Marker
              key={`healthcare-${facility.place_id}`}
              position={{
                lat: facility.gps_coordinates.latitude,
                lng: facility.gps_coordinates.longitude
              }}
              onClick={() => onMarkerClick(facility, 'healthcare')}
              title={facility.title}
              icon={markerIcons.healthcare}
            />
          ))}

          {/* Job Markers */}
          {viewMode === 'jobs' && jobsData.map((job) => (
            <Marker
              key={`job-${job.job_id}`}
              position={getCoordinatesForJob(job.job_location)}
              onClick={() => onMarkerClick(job, 'job')}
              title={job.job_position}
              icon={markerIcons.jobs}
            />
          ))}

          {/* Debug info - remove in production */}
          {selectedItem && (
            <div className="fixed top-4 right-4 bg-white p-4 border rounded shadow-lg z-50 max-w-xs">
              <h4 className="font-bold">Debug Info:</h4>
              <p>Type: {selectedItem.type}</p>
              <p>Data: {JSON.stringify(selectedItem, null, 2)}</p>
            </div>
          )}

          {/* Info Window */}
          {selectedItem && (
            <InfoWindow
              position={
                selectedItem.markerType === 'healthcare' // Use markerType instead of type
                  ? {
                      lat: selectedItem.gps_coordinates.latitude,
                      lng: selectedItem.gps_coordinates.longitude
                    }
                  : getCoordinatesForJob(selectedItem.job_location)
              }
              onCloseClick={onInfoWindowClose}
            >
              <div className="p-2 max-w-xs">
                {selectedItem.markerType === 'healthcare' ? ( // Use markerType here
                  <>
                    <h3 className="font-bold text-lg mb-2 text-blue-700">{selectedItem.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Rating:</strong> {selectedItem.rating} ⭐ ({selectedItem.reviews} reviews)
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Type:</strong> {selectedItem.type} {/* This is the original type from API */}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Address:</strong> {selectedItem.address}
                    </p>
                    {selectedItem.phone && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Phone:</strong> {selectedItem.phone}
                      </p>
                    )}
                    {selectedItem.website && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Website:</strong>{' '}
                        <a
                          href={selectedItem.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Visit website
                        </a>
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-lg mb-2 text-green-700">{selectedItem.job_position}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Company:</strong> {selectedItem.company_name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Location:</strong> {selectedItem.job_location}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Posted:</strong> {selectedItem.job_posting_date}
                    </p>
                    {selectedItem.company_logo_url && (
                      <img
                        src={selectedItem.company_logo_url}
                        alt={selectedItem.company_name}
                        className="w-12 h-12 mt-2 rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="mt-2">
                      <a
                        href={selectedItem.job_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        View Job
                      </a>
                    </div>
                  </>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Data List */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">
          {viewMode === 'healthcare' 
            ? 'Healthcare Facilities' 
            : 'Jobs'
          }
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentData.map((item) => (
            <div
              key={viewMode === 'healthcare' ? item.place_id : item.job_id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                const markerType = viewMode === 'healthcare' ? 'healthcare' : 'job';
                onMarkerClick(item, markerType);
                if (map) {
                  const position = viewMode === 'healthcare'
                    ? {
                        lat: item.gps_coordinates.latitude,
                        lng: item.gps_coordinates.longitude
                      }
                    : getCoordinatesForJob(item.job_location);
                  
                  map.panTo(position);
                  map.setZoom(14);
                }
              }}
            >
              {viewMode === 'healthcare' ? (
                <>
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Rating: {item.rating} ⭐ ({item.reviews} reviews)
                  </p>
                  <p className="text-sm text-gray-600 mb-1">{item.type}</p>
                  <p className="text-sm text-gray-600 truncate">{item.address}</p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg mb-2 text-green-700">{item.job_position}</h3>
                  <p className="text-sm text-gray-600 mb-1">{item.company_name}</p>
                  <p className="text-sm text-gray-600 mb-1">{item.job_location}</p>
                  <p className="text-sm text-gray-600">Posted: {item.job_posting_date}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapComponent;