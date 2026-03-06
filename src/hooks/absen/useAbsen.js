import { axiosInstance } from "@/lib/axios/axios";
import { useState, useEffect } from "react";
import { absenMasuk,absenKeluar } from "./absen";

export const useAbsen = () => {
    const [statusAbsen, setStatusAbsen] = useState({
        sudahMasuk: false,
        sudahKeluar: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const clearMessage = () => setMessage("");

    // Cek status absen hari ini saat komponen mount
    useEffect(() => {
        const cekStatusAbsen = async () => {
            try {
                const res = await axiosInstance.get("/absen/hari-ini");
                const data = res.data.data;

                if (data) {
                    setStatusAbsen({
                        sudahMasuk: !!data.jamMasuk,
                        sudahKeluar: !!data.jamKeluar,
                    });
                }
            } catch (error) {
                console.error("Gagal cek status absen", error);
            }
        };

        cekStatusAbsen();
    }, []);

    const handleAbsenMasuk = async (latitude, longitude) => {
        setLoading(true);
        setMessage("");
        try {
            const res = await absenMasuk(latitude, longitude);
            setStatusAbsen((prev) => ({ ...prev, sudahMasuk: true }));
            setMessage(res.message);
        } catch (err) {
            console.log("response error:", err.response); 
            console.log("pesan error:", err.response?.data);
            setMessage(err.response?.data?.message || "Absen masuk gagal");
        } finally {
            setLoading(false);
        }
    };

    const handleAbsenKeluar = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await absenKeluar();
            setStatusAbsen((prev) => ({ ...prev, sudahKeluar: true }));
            setMessage(res.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Absen keluar gagal");
        } finally {
            setLoading(false);
        }
    };

    return { statusAbsen, loading, message, handleAbsenMasuk, handleAbsenKeluar ,clearMessage};
};