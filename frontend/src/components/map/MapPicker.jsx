import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Navigation, Crosshair } from 'lucide-react';

/* ─── Leaflet default marker fix ─────────────────────────────────────── */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ─── Internal click-marker handler ──────────────────────────────────── */
function ClickMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

/* ─── Styles ──────────────────────────────────────────────────────────── */
const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 100%)',
    borderRadius: '12px',
    border: '1px solid #d6ddff',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '13px',
    color: '#5566aa',
    fontWeight: '500',
    fontFamily: "'DM Sans', sans-serif",
  },
  gpsBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    background: 'linear-gradient(135deg, #3b5bdb 0%, #4c6ef5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    letterSpacing: '0.3px',
    transition: 'opacity 0.15s, transform 0.12s',
    boxShadow: '0 2px 8px rgba(59,91,219,0.35)',
  },
  mapShell: {
    borderRadius: '14px',
    overflow: 'hidden',
    border: '2px solid #d6ddff',
    height: '280px',
    boxShadow: '0 4px 20px rgba(59,91,219,0.12)',
    background: '#e8eeff',
  },
  coordBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  coordText: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '12px',
    color: '#0284c7',
    letterSpacing: '0.4px',
    fontWeight: '500',
  },
  coordDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 6px rgba(74,222,128,0.6)',
    flexShrink: 0,
  },
};

/* ─── Component ───────────────────────────────────────────────────────── */
export default function MapPicker({ onChange, center = [20.5937, 78.9629] }) {
  const [position, setPosition] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const handlePosition = useCallback((pos) => {
    setPosition(pos);
    onChange?.({ latitude: pos[0], longitude: pos[1] });
  }, [onChange]);

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handlePosition([pos.coords.latitude, pos.coords.longitude]);
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div style={styles.wrapper}>
      {/* Header bar */}
      <div style={styles.header}>
        <span style={styles.headerLeft}>
          <MapPin size={14} color="#3b5bdb" />
          Click on the map to drop a pin
        </span>
        <button
          type="button"
          onClick={handleGPS}
          disabled={gpsLoading}
          style={{
            ...styles.gpsBtn,
            opacity: gpsLoading ? 0.7 : 1,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = gpsLoading ? '0.7' : '1'}
        >
          <Crosshair size={13} />
          {gpsLoading ? 'Locating…' : 'Use my GPS'}
        </button>
      </div>

      {/* Map */}
      <div style={styles.mapShell}>
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ClickMarker position={position} setPosition={handlePosition} />
        </MapContainer>
      </div>

      {/* Coordinates badge */}
      {position && (
        <div style={styles.coordBadge}>
          <div style={styles.coordDot} />
          <span style={styles.coordText}>
            {position[0].toFixed(6)},&nbsp;&nbsp;{position[1].toFixed(6)}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#4d6599', fontFamily: 'inherit' }}>
            WGS 84
          </span>
        </div>
      )}
    </div>
  );
}