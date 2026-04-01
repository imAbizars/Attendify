import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios/axios";
import { useState } from "react";

const timeRefetch = 1000 * 60 * 60 * 24 * 2;

export const useStatistikAbsen = () => {
    const [selectedMonth,setSelectedMonth] = useState(()=>{
        const now = new Date();
        const init = { month: now.getMonth() + 1, year: now.getFullYear() };
        console.log("initial selectedMonth:", init); // cek nilainya
        return init;
    });
    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ["statistikAbsen"],
        queryFn: async () => {
            console.log("selectedMonth saat request:", selectedMonth);
            const res = await axiosInstance.get("/absen/statistik",{
                params:{
                    month : selectedMonth.month,
                    year : selectedMonth.year
                }
            });
            
            return res.data.data;
        },
        staleTime: timeRefetch,
        refetchIntervalInBackground: false,
    });

    return { chartData: data ?? [],  isLoading, refetch, isFetching,selectedMonth,setSelectedMonth};
};