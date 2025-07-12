export const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("✅ Google Maps JS API loaded.");
      resolve();
    };
    script.onerror = () => reject("❌ Failed to load Google Maps JS API");
    document.head.appendChild(script);
  });
};
