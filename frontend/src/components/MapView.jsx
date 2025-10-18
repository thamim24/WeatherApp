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

// Component to update map center when coordinates change
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10, {
        duration: 1.5
      });
    }
  }, [center, map]);
  
  return null;
}

function MapView({ latitude, longitude, cityName }) {
  if (!latitude || !longitude) {
    return null;
  }

  const position = [latitude, longitude];

  return (
    <div className="map-view-inline">
      <MapContainer 
        center={position} 
        zoom={10} 
        style={{ height: '300px', width: '100%', borderRadius: '15px' }}
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
        <MapUpdater center={position} />
      </MapContainer>
    </div>
  );
}

export default MapView;