import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios/axios";

export const useRiwayatAbsen = () => {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return { month: now.getMonth() + 1, year: now.getFullYear() };
    });

    const { data, isLoading } = useQuery({
        queryKey: ["riwayatAbsen", selectedMonth.month, selectedMonth.year],
        queryFn: async () => {
            const res = await axiosInstance.get("/absen/riwayatabsen", {
                params: {
                    month: selectedMonth.month,
                    year: selectedMonth.year,
                }
            });
            return res.data.data;
        },
    });

    return { riwayat: data ?? [], loading: isLoading, selectedMonth, setSelectedMonth };
};