import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ onChange, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || null);
  const [center] = useState(initialPosition || [20.5937, 78.9629]); // Default: India center

  useEffect(() => {
    if (position && onChange) {
      onChange({ latitude: position[0], longitude: position[1] });
    }
  }, [position, onChange]);

  // Try to get user's current location
  useEffect(() => {
    if (!initialPosition && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        () => {
          // Geolocation denied — use default
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [initialPosition]);

  return (
    <div className="map-picker-container" id="map-picker">
      <div className="map-picker-hint">
        📍 Click on the map to mark the issue location
      </div>
      <MapContainer
        center={center}
        zoom={5}
        className="map-picker"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      {position && (
        <div className="map-picker-coords">
          Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default MapPicker;
