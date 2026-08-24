export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`, {
      headers: { 'Accept-Language': 'en' }
    });
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    
    // Prefer neighbourhood, locality, city
    const addr = data.address;
    const parts = [
      addr.neighbourhood || addr.suburb || addr.quarter,
      addr.city || addr.town || addr.village,
      addr.state
    ].filter(Boolean);
    
    return parts.join(', ') || data.display_name.split(',')[0];
  } catch (err) {
    console.error('Reverse geocoding error:', err);
    return 'Location unavailable';
  }
};
