import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map initialization and updates
function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    // Force map to recognize its container size
    const forceResize = () => {
      // First, make sure the container has dimensions
      const container = map.getContainer();
      if (container) {
        const rect = container.getBoundingClientRect();
        console.log('Map container size:', rect.width, 'x', rect.height);
      }
      
      // Then invalidate
      map.invalidateSize(true);
    };
    
    // Immediate resize
    forceResize();
    
    // Delayed resizes to handle async rendering
    const timer1 = setTimeout(forceResize, 100);
    const timer2 = setTimeout(forceResize, 300);
    const timer3 = setTimeout(forceResize, 600);
    
    // Handle window resize
    const handleResize = () => {
      setTimeout(forceResize, 50);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', forceResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', forceResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [map]);
  
  // Update view when center changes
  useEffect(() => {
    if (center) {
      map.setView(center, 10);
      setTimeout(() => map.invalidateSize(true), 100);
    }
  }, [center, map]);
  
  return null;
}

function MapView({ latitude, longitude, cityName }) {
  if (!latitude || !longitude) {
    return null;
  }

  const position = [latitude, longitude];
  // Use coordinates as key to force complete remount when city changes
  const mapKey = `map-${latitude}-${longitude}`;

  return (
    <div className="map-view-inline" style={{ display: 'block', position: 'relative' }}>
      <MapContainer 
        key={mapKey}
        center={position} 
        zoom={10} 
        style={{ 
          height: '100%', 
          width: '100%', 
          borderRadius: '15px',
          minHeight: '250px',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
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
