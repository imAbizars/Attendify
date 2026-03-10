import { axiosInstance } from "@/lib/axios/axios";
import { useState, useEffect } from "react";
import { absenMasuk,absenKeluar,absenHariIni } from "./absen";

export const useAbsen = () => {
    const [statusAbsen, setStatusAbsen] = useState({
        sudahMasuk: false,
        sudahKeluar: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setisSuccess] = useState(false);
    const clearMessage = () => setMessage("");
    
    useEffect(() => {
        const cekStatusAbsen = async () => {
            try {
                const dataAbsen = await absenHariIni();
                

                if (dataAbsen) {
                    setStatusAbsen({
                        sudahMasuk: !!dataAbsen.jamMasuk,
                        sudahKeluar: !!dataAbsen.jamKeluar,
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
            setisSuccess(true);
            setMessage(res.message);
        } catch (err) {
            console.log("response error:", err.response); 
            console.log("pesan error:", err.response?.data);
            setisSuccess(false);
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
            setisSuccess(true);
            setMessage(res.message);
        } catch (err) {
            setisSuccess(false);
            setMessage(err.response?.data?.message || "Absen keluar gagal");
        } finally {
            setLoading(false);
        }
    };

    return { statusAbsen, loading, message, handleAbsenMasuk, handleAbsenKeluar ,clearMessage,isSuccess};
};