import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: typeof google;
  }
}



interface MapPreviewProps {
  pickup: string;
  dropOff: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ pickup, dropOff }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google || !pickup || !dropOff) return; // Property 'google' does not exist on type 'Window & typeof globalThis'

    const map = new window.google.maps.Map(mapRef.current!, {
      zoom: 7,
      center: { lat: 35.2271, lng: -80.8431 }, // Centered around Charlotte, NC
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: pickup,
        destination: dropOff,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  }, [pickup, dropOff]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "300px", marginTop: "1rem", borderRadius: "8px" }}
    ></div>
  );
};

export default MapPreview;
