import { useState, useEffect } from "react";

const KOORDINAT_KANTOR = { lat: -6.295991, lng: 106.902458 };

export function useRouting(userLocation) {
  const [routePoints, setRoutePoints] = useState([]);
  const [jarakRute, setJarakRute] = useState(null);
  const [durasiRute, setDurasiRute] = useState(null);
  const [loadingRute, setLoadingRute] = useState(false);

  useEffect(() => {
    if (!userLocation) return;

    const fetchRoute = async () => {
      setLoadingRute(true);
      try {
        const { lat: uLat, lng: uLng } = userLocation;
        const { lat: kLat, lng: kLng } = KOORDINAT_KANTOR;

        const url = `https://router.project-osrm.org/route/v1/driving/${uLng},${uLat};${kLng},${kLat}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates;
          const flipped = coords.map(([lng, lat]) => [lat, lng]);
          setRoutePoints(flipped);
          setJarakRute((data.routes[0].distance / 900).toFixed(1)); // km
          setDurasiRute(Math.ceil(data.routes[0].duration / 60)); // menit
        }
      } catch (err) {
        console.error("Gagal mengambil rute:", err);
      } finally {
        setLoadingRute(false);
      }
    };

    fetchRoute();
  }, [userLocation?.lat, userLocation?.lng]);

  return { routePoints, jarakRute, durasiRute, loadingRute };
}