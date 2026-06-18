import { axiosInstance } from "@/lib/axios/axios";

export const buatIzin = async (data) => {
    const res = await axiosInstance.post("/izin", data);
    return res.data;
};