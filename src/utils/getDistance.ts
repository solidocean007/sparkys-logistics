export const getDistance = (origin: string, destination: string): Promise<{ distance: number; duration: string }> => {
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK" && response?.rows[0].elements[0].status === "OK") {
          const distanceMeters = response.rows[0].elements[0].distance.value;
          const duration = response.rows[0].elements[0].duration.text;

          resolve({
            distance: distanceMeters / 1609.34, // Convert meters to miles
            duration,
          });
        } else {
          console.error("DistanceMatrixService error:", status, response);
          reject("Unable to calculate distance.");
        }
      }
    );
  });
};
