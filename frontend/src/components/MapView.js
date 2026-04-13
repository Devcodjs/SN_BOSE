import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css'; // Reuse map styles

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapView = ({ coordinates, address, title }) => {
  // coordinates = [longitude, latitude] (GeoJSON format)
  if (!coordinates || coordinates.length < 2 || (coordinates[0] === 0 && coordinates[1] === 0)) {
    return null;
  }

  const position = [coordinates[1], coordinates[0]]; // [lat, lng]

  return (
    <div className="map-view-container" id="map-view">
      <MapContainer
        center={position}
        zoom={15}
        className="map-view"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>{title || 'Issue Location'}</strong>
            {address && <br />}
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
