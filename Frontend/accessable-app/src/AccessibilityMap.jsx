import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
import GoogleMapComponent from './GoogleMapComponent';

function AccessibilityMap() {
  return (
    <div className="min-h-screen bg-grey-100">
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">
          Disability Resources - Gauteng
        </h1>
        <p className="text-center mt-2 opacity-90">
          Find healthcare facilities and job opportunities for people with disabilities
        </p>
      </header>
      <main className="container mx-auto p-6">
        <GoogleMapComponent />
      </main>
    </div>
  );
}

export default AccessibilityMap;


