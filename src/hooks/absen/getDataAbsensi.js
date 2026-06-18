import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios/axios";

export const getDataAbsensi = () => {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return { month: now.getMonth() + 1, year: now.getFullYear() };
    });

    const { data, isLoading } = useQuery({
        queryKey: ["riwayatAbsenSemua", selectedMonth.month, selectedMonth.year],
        queryFn: async () => {
            const res = await axiosInstance.get("/absen/riwayatabsen/semua", {
                params: {
                    month: selectedMonth.month,
                    year: selectedMonth.year,
                }
            });
            return res.data.data; 
        },
    });

    return { 
        absensiData: data ?? [], 
        isLoading, 
        selectedMonth, 
        setSelectedMonth 
    };
};