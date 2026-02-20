import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios/axios";

export const createUser = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/user", data);
      return res.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fetch.user"] });
      onSuccess?.(data);
    },
  });
};
