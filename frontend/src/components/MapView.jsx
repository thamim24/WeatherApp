import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map events and updates
function MapController({ center }) {
  const map = useMap();
  
  // Handle initial load and resize
  useEffect(() => {
    // Multiple invalidations to ensure map renders on all devices
    const invalidateMap = () => {
      map.invalidateSize();
    };
    
    // Immediate invalidation
    invalidateMap();
    
    // Set up resize handler with debounce
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        invalidateMap();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', invalidateMap);
    
    // Multiple delayed invalidations for different scenarios
    const timers = [
      setTimeout(invalidateMap, 100),
      setTimeout(invalidateMap, 300),
      setTimeout(invalidateMap, 500)
    ];
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', invalidateMap);
      clearTimeout(resizeTimer);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [map]);
  
  // Update center when coordinates change
  useEffect(() => {
    if (center) {
      map.setView(center, 10);
      // Invalidate size after view change
      setTimeout(() => map.invalidateSize(), 100);
    }
  }, [center, map]);
  
  return null;
}

function MapView({ latitude, longitude, cityName }) {
  const [mapReady, setMapReady] = useState(false);
  
  if (!latitude || !longitude) {
    return null;
  }

  const position = [latitude, longitude];

  return (
    <div className="map-view-inline">
      <MapContainer 
        center={position} 
        zoom={10} 
        style={{ 
          height: '100%', 
          width: '100%', 
          borderRadius: '15px',
          minHeight: '250px'
        }}
        scrollWheelZoom={false}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>{cityName}</strong><br />
            Lat: {latitude.toFixed(4)}<br />
            Lon: {longitude.toFixed(4)}
          </Popup>
        </Marker>
        <MapController center={position} />
      </MapContainer>
    </div>
  );
}

export default MapView;
