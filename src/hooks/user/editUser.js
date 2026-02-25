import { axiosInstance } from "@/lib/axios/axios";
import { useMutation,useQueryClient } from "@tanstack/react-query";

export const editUser = ({ onSuccess } = {}) =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async ({id,userData})=>{
            const res = await axiosInstance.patch(`/user/${id}`,userData);
            return res.data;
        },
        onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["fetch.user"] });
        onSuccess?.(data);
        },
    });
};