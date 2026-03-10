import { axiosInstance } from "@/lib/axios/axios";

export const absenMasuk = async (latitude, longitude) => {
    const res = await axiosInstance.post("/absen/masuk", { latitude, longitude });
    return res.data;
};

export const absenKeluar = async () => {
    const res = await axiosInstance.post("/absen/keluar");
    return res.data;
};  
export const absenHariIni = async () =>{
    const res = await axiosInstance.get("/absen/hari-ini");
    return res.data.data;
}