import { axiosInstance } from "@/lib/axios/axios";
import { useMutation } from "@tanstack/react-query"; // ← useMutation bukan useQuery

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: async (email) => {
            const res = await axiosInstance.get("/settings/emailUser", {
                params: { email } // kirim sebagai query param
            });
            return res.data;
        }
    });
};