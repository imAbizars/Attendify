import { useState, useTransition } from "react";
import { axiosInstance } from "@/lib/axios/axios";

export const useProfile = () => {

    const [loading, setLoading] = useState(false);
    const [photoProfile,setPhotoProfile] = useState(null);
    const [message, setMessage] = useState("");
    const [totalHadir,setTotalHadir] = useState(0);
    const [totalIzin,setTotalIzin] = useState(0);
    const [totalTerlambat,setTotalTerlambat] = useState(0);
    const [infoRankUser,setInfoRankUser] = useState("");
    const [email,setEmail] = useState("");
    const [nama,setNama]  = useState("");
    const [noTelepon,setNoTelepon] = useState("");


    const fetchInfoUser = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/user/me");
            const {email : emailUser ,name : nama, phonenumber : noTelepon ,photo : photoUser} = res.data.data;
            setEmail(emailUser);
            setNama(nama);
            setNoTelepon(noTelepon);
            setPhotoProfile(photoUser);
        } catch(err) {
            setMessage("gagal mengambil data");
        } finally {
            setLoading(false);
        };
    };
    const uploadPhoto = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("photo", file);

            const res = await axiosInstance.patch("/user/photo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            await getPhotoUser()

            setMessage("Foto berhasil diupload");
            return res.data.photo;
        } catch (err) {
            setMessage(err.response?.data?.message || "Gagal upload foto");
        } finally {
            setLoading(false);
        };
    };

    const fetchStatistikAbsen = async () => {
        try {
            const res = await axiosInstance.get("absen/statistik-absen-user");
            const { hadir, terlambat, izin, totalHadir } = res.data.data;

            setTotalHadir(totalHadir);
            setTotalIzin(izin);
            setTotalTerlambat(terlambat);
        } catch (error) {
            console.error(error);
        };
    };
    const infoRank = async () => {
        if (totalHadir <= 240) {
            setInfoRankUser("Pekerja Keras");
        } else if (totalHadir <= 360) {
            setInfoRankUser("Rajin");
        } else if (totalHadir <= 720) {
            setInfoRankUser("Teladan");
        } else {
            setInfoRankUser("Loyal");
        };
    };
    
    return { 
        uploadPhoto, 
        loading,
        message,
        fetchInfoUser,
        photoProfile,
        fetchStatistikAbsen,
        totalHadir,
        totalIzin,
        totalTerlambat,
        infoRank,
        infoRankUser,
        email,
        nama,
        noTelepon,

        
    };
};