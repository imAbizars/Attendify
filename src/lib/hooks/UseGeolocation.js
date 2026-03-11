import { useState, useEffect } from "react";

const KANTOR_LAT = -6.295991;
const KANTOR_LNG = 106.902458;
const BATAS_JARAK_METER = 100;

const hitungJarak = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

export const useGeolocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");
    const [jarakKeKantor, setJarakKeKantor] = useState(null);
    const [dalamJangkauan, setDalamJangkauan] = useState(false);

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

                // hitung jarak setiap update lokasi
                const jarak = hitungJarak(loc.lat, loc.lng, KANTOR_LAT, KANTOR_LNG);
                setJarakKeKantor(jarak);
                setDalamJangkauan(jarak <= BATAS_JARAK_METER);
            },
            (err) => {
                setLocation(null);
                if (err.code === 1) setError("Izin lokasi ditolak");
                else if (err.code === 2) setError("Lokasi tidak tersedia");
                else if (err.code === 3) setError("GPS kamu sedang mati");
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return { location, error, jarakKeKantor, dalamJangkauan };
};