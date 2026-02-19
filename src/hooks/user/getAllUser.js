import { axiosInstance } from "@/lib/axios/axios";
import { useQuery } from "@tanstack/react-query";

export const getAllUser = ({ onError }) => {
    return useQuery({
        queryFn: async () => {
            const res = await axiosInstance.get("/user");
            return res.data.data; 
        },
        queryKey: ["fetch.user"],
        onError,
    });
};

