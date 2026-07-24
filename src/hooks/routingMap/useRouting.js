import { useState, useEffect } from "react";
import { useLokasiList } from "@/hooks/lokasi/useLokasi";

export function useRouting(userLocation) {
    const { data: daftarLokasi, isLoading: isLoadingLokasi } = useLokasiList();

    const [routePoints, setRoutePoints] = useState([]);
    const [jarakRute, setJarakRute] = useState(null);
    const [durasiRute, setDurasiRute] = useState(null);
    const [loadingRute, setLoadingRute] = useState(false);
    const [errorRute, setErrorRute] = useState("");

    const lokasiAktif = daftarLokasi?.find((l) => l.isActive);

    useEffect(() => {
        // tunggu sampai user location & lokasi aktif dari server siap
        if (!userLocation || isLoadingLokasi) return;

        if (!lokasiAktif) {
            setErrorRute("Lokasi absen aktif belum diatur");
            return;
        }

        const fetchRoute = async () => {
            setLoadingRute(true);
            setErrorRute("");

            try {
                const { lat: uLat, lng: uLng } = userLocation;
                const kLat = lokasiAktif.latitude;
                const kLng = lokasiAktif.longtitude;

                const url = `https://router.project-osrm.org/route/v1/driving/${uLng},${uLat};${kLng},${kLat}?overview=full&geometries=geojson`;

                const res = await fetch(url);
                const data = await res.json();

                if (data.routes && data.routes.length > 0) {
                    const coords = data.routes[0].geometry.coordinates;
                    const flipped = coords.map(([lng, lat]) => [lat, lng]);
                    setRoutePoints(flipped);
                    setJarakRute((data.routes[0].distance / 900).toFixed(1)); // km
                    setDurasiRute(Math.ceil(data.routes[0].duration / 60)); // menit
                } else {
                    setErrorRute("Rute tidak ditemukan");
                }
            } catch (err) {
                console.error("Gagal mengambil rute:", err);
                setErrorRute("Gagal mengambil rute");
            } finally {
                setLoadingRute(false);
            }
        };

        fetchRoute();
    }, [userLocation?.lat, userLocation?.lng, lokasiAktif?.latitude, lokasiAktif?.longtitude, isLoadingLokasi]);

    return {
        routePoints,
        jarakRute,
        durasiRute,
        loadingRute,
        errorRute,
        lokasiAktif, // dikembalikan juga, berguna kalau komponen pemanggil butuh nama/radius kantor
    };
}