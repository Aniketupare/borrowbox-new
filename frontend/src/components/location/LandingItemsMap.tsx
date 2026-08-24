import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

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

// Custom icon for user location (Red)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapController = ({ center, items }: { center: [number, number] | null, items: any[] }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    } else if (items.length > 0) {
      const bounds = L.latLngBounds(items.map(item => [item.location.coordinates[1], item.location.coordinates[0]]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [center, items, map]);

  return null;
};

interface LandingItemsMapProps {
  items: any[];
}

export const LandingItemsMap = ({ items }: LandingItemsMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleUseMyLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocationError('Unable to determine location. Please check browser permissions.');
      },
      { timeout: 10000 }
    );
  };

  const validItems = items.filter(item => item.location?.coordinates && item.location.coordinates.length === 2);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Explore available items on the map</h2>
        <button
          onClick={handleUseMyLocation}
          disabled={locating}
          className="px-4 py-2 bg-accent text-white dark:text-gray-900 rounded-lg text-sm font-semibold hover:bg-accent-hover shadow-sm flex items-center gap-2"
        >
          {locating ? 'Locating...' : '📍 Use My Location'}
        </button>
      </div>

      {locationError && <p className="text-sm text-red-500">{locationError}</p>}

      <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-border shadow-sm z-0">
        <MapContainer 
          center={[12.9716, 77.5946]} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={userLocation} items={validItems} />

          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {/* Item Markers */}
          {validItems.map((item) => (
            <Marker key={item._id} position={[item.location.coordinates[1], item.location.coordinates[0]]}>
              <Tooltip
                permanent
                direction="top"
                offset={[0, -25]}
                className="!bg-surface !border-border !text-primary !text-xs !font-semibold !rounded-lg !px-2 !py-1 !shadow-sm !max-w-[120px] !truncate"
              >
                {item.title}
              </Tooltip>
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <h4 className="font-bold text-primary text-sm mb-2">{item.title}</h4>
                  <Link to={`/items/${item._id}`} className="block text-center bg-accent text-white text-xs font-semibold py-1.5 px-3 rounded hover:bg-accent-hover">View Item</Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
