import { axiosInstance } from "@/lib/axios/axios";
import { useQuery } from "@tanstack/react-query";

export const getAllUser = ({onError})=>{
    return useQuery({
        queryFn: async()=>{
            const userData = await axiosInstance.get("/user");
            return userData;
        },
        queryKey: ["fetch.user"],
        onError,
    });
    
}