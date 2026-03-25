import { useState, useEffect } from "react";
import { absenMasuk,absenKeluar,absenHariIni } from "./absen";
import {formatTerlambat} from "@/lib/hooks/useFormatJam";

export const useAbsen = () => {
    const [statusAbsen, setStatusAbsen] = useState({
        sudahMasuk: false,
        sudahKeluar: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [info,setInfo] = useState(null);
    const [isSuccess, setisSuccess] = useState(false);
    const [terlambat,setTerlambat] = useState(null);
    const clearMessage = () => setMessage("");
    const clearTerlambat = () => setTerlambat(null);
    const BATAS_JAM = 8;   
    const BATAS_MENIT = 0;
    
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
        setInfo(null);
        try {
            const res = await absenMasuk(latitude, longitude);
            setStatusAbsen((prev) => ({ ...prev, sudahMasuk: true }));
            setisSuccess(true);
            setMessage(res.message);

            const sekarang = new Date();
            const jam = sekarang.getHours();
            const menit = sekarang.getMinutes();

            const menitSekarang = jam * 60 + menit;           
            const menitBatas = BATAS_JAM * 60 + BATAS_MENIT; 

            if (menitSekarang > menitBatas) {
                const selisih = menitSekarang - menitBatas;
                setTerlambat(formatTerlambat(selisih));
            } else {
                setTerlambat(null);
            }

        } catch (err) {
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
            setInfo("Absen Berikutnya Pada Pukul 08:00")
        } catch (err) {
            setisSuccess(false);
            setMessage(err.response?.data?.message || "Absen keluar gagal");
        } finally {
            setLoading(false);
        }
    };
    
    return { statusAbsen, loading, message, handleAbsenMasuk, handleAbsenKeluar ,clearMessage,isSuccess,terlambat,clearTerlambat,info };
};