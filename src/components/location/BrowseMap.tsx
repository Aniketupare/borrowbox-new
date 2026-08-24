import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
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

// Create a custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

interface BrowseMapProps {
  items: any[];
  center: [number, number];
  zoom?: number;
}

export const BrowseMap = ({ items, center, zoom = 13 }: BrowseMapProps) => {
  return (
    <div className="h-96 w-full rounded-xl overflow-hidden border border-border shadow-sm z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        
        {/* User/Search Location Marker */}
        <Marker position={center} icon={userIcon}>
          <Popup>Your selected location</Popup>
        </Marker>

        {/* Item Markers */}
        {items.map((item) => {
          if (!item.location?.coordinates || item.location.coordinates.length < 2) return null;
          const [lng, lat] = item.location.coordinates;
          return (
            <Marker key={item._id} position={[lat, lng]}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold text-primary">{item.title}</h4>
                  <p className="text-sm text-text">{item.category}</p>
                  <p className="text-sm font-semibold text-accent mb-2">₹{item.borrowingFee} / day</p>
                  <Link 
                    to={`/items/${item._id}`} 
                    className="block text-center bg-accent text-white text-xs font-semibold py-1.5 px-3 rounded hover:bg-accent-hover"
                  >
                    View Item
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
