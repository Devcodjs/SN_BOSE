import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView({ coordinates, address, title }) {
  if (!coordinates || coordinates.length < 2) return null;
  
  // Coordinates are often stored as [longitude, latitude] in GeoJSON/MongoDB
  // Leaflet expects [latitude, longitude]
  const lat = coordinates[1];
  const lng = coordinates[0];

  return (
    <div style={{
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #bae6fd',
      height: '300px',
      width: '100%',
      boxShadow: '0 4px 12px rgba(2,132,199,0.08)'
    }}>
      <MapContainer 
        center={[lat, lng]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; OpenStreetMap contributors' 
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div style={{ padding: '4px' }}>
              <div style={{ fontWeight: 600, color: '#0c4a6e', marginBottom: '4px' }}>
                {title || 'Location'}
              </div>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                {address}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}