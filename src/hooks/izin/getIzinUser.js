import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios/axios"

export const useIzinSaya = () => {
    return useQuery({
        queryKey: ["fetch.izin"],
        queryFn: async () => {
            const res = await axiosInstance.get("/izin/izinSaya");
            return res.data.data;
        },
    });
};

export const useAllIzin = () =>{
    return useQuery({
        queryKey:["fetch.semuaIzin"],
        queryFn:async () => {
            const res = await axiosInstance.get("/izin/semuaIzin");
            return res.data.data
        },
    });
};