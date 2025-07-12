const HOME_BASE = { lat: 36.5204, lng: -76.1613 };
const MAX_PICKUP_RADIUS_MILES = 80;

export const isWithinRadius = (pickupLatLng: google.maps.LatLngLiteral) => {
  const earthRadius = 3958.8; // miles
  const dLat = (pickupLatLng.lat - HOME_BASE.lat) * (Math.PI / 180);
  const dLng = (pickupLatLng.lng - HOME_BASE.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(HOME_BASE.lat * (Math.PI / 180)) *
      Math.cos(pickupLatLng.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance <= MAX_PICKUP_RADIUS_MILES;
};
