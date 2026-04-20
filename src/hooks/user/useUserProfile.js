import { useState, useTransition } from "react";
import { axiosInstance } from "@/lib/axios/axios";

export const useProfile = () => {
    const [loading, setLoading] = useState(false);
    const [photoProfile,setPhotoProfile] = useState(null);
    const [message, setMessage] = useState("");
    const [totalDataAbsen,setTotalDataAbsen] = useState(0);
    const [totalDataAbsenIzin,setTotalDataAbsenIzin] = useState(0);
    const [totalDataAbsenTerlambat,setTotalDataAbsenTerlambat] = useState(0);
    const [infoRankUser,setInfoRankUser] = useState("");
    const getPhotoUser = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/user/me");
            setPhotoProfile(res.data.data.photo);
        } catch(err) {
            setMessage("gagal mengambil foto");
        } finally {
            setLoading(false);
        }
    }
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
        }
    };

    const fetchTotalAbsenUser = async () => {
        try{
            const res = await axiosInstance.get("/absen/absen-user");
            setTotalDataAbsen(res.data.data)
        }catch(err){
            setMessage("data gagal dipanggil");
        }
    }
    
    const fetchTotalAbsenUserIzin = async () => {
        try{
            const res = await axiosInstance.get("/absen/absen-user-izin");
            setTotalDataAbsenIzin(res.data.data);
        }catch(err){
            setMessage(err)
        }
    }
    const fetchTotalAbsenUserTerlambat = async () => {
        try{
            const res = await axiosInstance.get("/absen/absen-user-terlambat");
            setTotalDataAbsenTerlambat(res.data.data);
        }catch(err){
            setMessage(err)
        }
    }
    const infoRank = async () => {
        if (totalDataAbsen <= 240) {
            setInfoRankUser("Pekerja Keras");
        } else if (totalDataAbsen <= 360) {
            setInfoRankUser("Rajin");
        } else if (totalDataAbsen <= 720) {
            setInfoRankUser("Teladan");
        } else {
            setInfoRankUser("Loyal");
        }
    };
    return { 
        uploadPhoto, 
        loading,
        message,
        getPhotoUser,
        photoProfile,
        fetchTotalAbsenUser,
        totalDataAbsen,
        totalDataAbsenIzin,
        setTotalDataAbsenIzin,
        fetchTotalAbsenUserIzin,
        totalDataAbsenTerlambat,
        fetchTotalAbsenUserTerlambat,
        infoRank,
        infoRankUser
    };
};