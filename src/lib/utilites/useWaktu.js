import { useState, useEffect } from "react";

export const useWaktu = () => {
    const [waktu, setWaktu] = useState(new Date());
    
    useEffect(() => {
        const interval = setInterval(() => {
            setWaktu(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return { waktu };
};