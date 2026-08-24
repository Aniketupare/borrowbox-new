import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { reverseGeocode } from '../../api/geocoding';

// Fix default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface ItemLocationMapProps {
  latitude: number;
  longitude: number;
}

export const ItemLocationMap = ({ latitude, longitude }: ItemLocationMapProps) => {
  const [locationName, setLocationName] = useState<string>('Loading...');

  useEffect(() => {
    reverseGeocode(latitude, longitude).then(setLocationName);
  }, [latitude, longitude]);

  return (
    <div className="flex flex-col gap-3">
      <div className="h-64 w-full rounded-xl overflow-hidden border border-border shadow-inner z-0">
        <MapContainer 
          center={[latitude, longitude]} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} />
        </MapContainer>
      </div>
      <p className="text-sm font-medium text-primary flex items-center gap-2">
        <span>📍</span> {locationName}
      </p>
    </div>
  );
};
