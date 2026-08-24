import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getItems } from '../api/items';
import { BrowseItemCard } from '../components/ui/BrowseItemCard';
import { Skeleton } from '../components/ui/Skeleton';
import { BrowseMap } from '../components/location/BrowseMap';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const BrowsePage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<NominatimResult[]>([]);
  const [selectedLocationName, setSelectedLocationName] = useState('');
  const [radiusKm, setRadiusKm] = useState<string>('10');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Debounced geocoding search using OpenStreetMap Nominatim
  useEffect(() => {
    if (!locationQuery || locationQuery.length < 2 || locationQuery === selectedLocationName) {
      setLocationSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=5`, {
          headers: { 'Accept-Language': 'en' }
        });
        if (res.ok) {
          const data: NominatimResult[] = await res.json();
          setLocationSuggestions(data);
        }
      } catch (err) {
        console.error('Geocoding error:', err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [locationQuery, selectedLocationName]);

  const handleSelectLocation = (place: NominatimResult) => {
    setUserLocation({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon)
    });
    setSelectedLocationName(place.display_name.split(',')[0]);
    setLocationQuery(place.display_name.split(',')[0]);
    setLocationSuggestions([]);
  };

  const queryParams: any = {};
  if (userLocation && radiusKm) {
    queryParams.lat = userLocation.lat;
    queryParams.lng = userLocation.lng;
    queryParams.maxDistance = Number(radiusKm) * 1000; // km to meters
  }

  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items', queryParams],
    queryFn: () => getItems(queryParams),
  });

  const handleUseMyLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setSelectedLocationName('Current Location');
        setLocationQuery('Current Location');
        setLocating(false);
        if (!radiusKm) setRadiusKm('10');
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied.');
        } else {
          setLocationError('Unable to retrieve location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredItems = items?.filter(item => 
    (category === 'All' || item.category.toLowerCase() === category.toLowerCase()) &&
    item.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const categories = ['All', ...new Set(items?.map(i => i.category) || [])];

  if (error) return <p className="text-center text-red-500">Error loading items.</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Browse Items</h1>
      
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm mb-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="Search..." 
            className="p-3 border border-border rounded-lg bg-surface text-primary" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="p-3 border border-border rounded-lg bg-surface text-primary" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="relative">
            <input 
              type="text"
              placeholder="Search location (e.g. Pune, Mumbai)..."
              className="w-full p-3 border border-border rounded-lg bg-surface text-primary"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                if (selectedLocationName && e.target.value !== selectedLocationName) {
                  setUserLocation(null);
                  setSelectedLocationName('');
                }
              }}
            />
            {locationSuggestions.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {locationSuggestions.map(place => (
                  <li 
                    key={place.place_id} 
                    onClick={() => handleSelectLocation(place)}
                    className="p-3 hover:bg-background cursor-pointer text-sm text-primary border-b border-border last:border-b-0"
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <select 
            className="p-3 border border-border rounded-lg bg-surface text-primary" 
            value={radiusKm} 
            onChange={(e) => setRadiusKm(e.target.value)}
          >
            <option value="1">1 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
          </select>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {locating ? 'Getting Location...' : '📍 Use My Location'}
          </button>
          
          {userLocation ? (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ Location active: {selectedLocationName || 'Coordinates'} ({userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)}) • Within {radiusKm} km
            </span>
          ) : (
            <span className="text-xs text-text">
              Enter a location or use current location for nearby items
            </span>
          )}
        </div>

        {locationError && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-900">
            {locationError}
          </p>
        )}
      </div>

      {userLocation && (
        <div className="mb-8">
          <BrowseMap items={filteredItems} center={[userLocation.lat, userLocation.lng]} />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => <BrowseItemCard key={item._id} item={item as any} />)}
        </div>
      ) : (
        <p className="text-center text-text py-12">No items match your criteria or search radius.</p>
      )}
    </div>
  );
};
