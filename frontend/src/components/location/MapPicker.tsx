import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  height?: string;
}

const LocationMarker = ({ position, setPosition, onChange }: { position: [number, number], setPosition: (pos: [number, number]) => void, onChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
};

const MapRecenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const MapPicker = ({ latitude, longitude, onChange, height = '350px' }: MapPickerProps) => {
  const defaultLat = latitude || 12.9716;
  const defaultLng = longitude || 77.5946;
  const [position, setPosition] = useState<[number, number]>([defaultLat, defaultLng]);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handleUseCurrentLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setPosition([lat, lng]);
        onChange(lat, lng);
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please allow location access in your browser settings.');
        } else {
          setLocationError('Unable to retrieve your location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locating}
          className="px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          {locating ? 'Locating...' : '📍 Use My Current Location'}
        </button>
        <span className="text-xs text-text">
          Selected: {Number(position[0]).toFixed(4)}, {Number(position[1]).toFixed(4)}
        </span>
      </div>

      {locationError && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-900">
          {locationError}
        </p>
      )}

      <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-border z-0 shadow-inner">
        <MapContainer 
          center={position} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} onChange={onChange} />
          <MapRecenter center={position} />
        </MapContainer>
      </div>
    </div>
  );
};
