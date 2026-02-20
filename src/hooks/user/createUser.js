import { axiosInstance } from "@/lib/axios/axios";
import { useMutation } from "@tanstack/react-query";

export const createUser = ({onSuccess})=>{
    return useMutation({
        mutationFn : async (body) => {
            const responseData = await axiosInstance.post("/user",body);
            return responseData;
        },
        onSuccess
    });
};