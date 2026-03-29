import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios/axios";

const timeRefetch = 1000 * 60 * 60 * 24 * 2;

export const useStatistikAbsen = () => {
    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ["statistikAbsen"],
        queryFn: async () => {
            const res = await axiosInstance.get("/absen/statistik");
            return res.data.data;
        },
        staleTime: timeRefetch,
        refetchIntervalInBackground: false,
    });

    return { chartData: data ?? [],  isLoading, refetch, isFetching };
};