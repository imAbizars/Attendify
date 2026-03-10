import { useState, useEffect } from "react";

export const useGeolocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Browser tidak mendukung GPS");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const loc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setLocation(loc);
                setError("");
            },
            (err) => {
                setLocation(null);
                if (err.code === 1) setError("Izin lokasi ditolak");
                else if (err.code === 2) setError("Lokasi tidak tersedia");
                else if (err.code === 3) setError("GPS kamu sedang mati");
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return { location, error };
};