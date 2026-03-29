import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios/axios";

export const getAllAbsenToday = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["absenHariIni"],
        queryFn: async () => {
            const res = await axiosInstance.get("/absen/semua-absen");
            return res.data.data;
        },
        refetchInterval: 30000,
        refetchIntervalInBackground: false, 
    });

    return { 
        dataAbsen: data ?? [], 
        loading: isLoading 
    };
};
