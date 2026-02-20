import { axiosInstance } from "@/lib/axios/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteUser = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/user/${id}`);
      return res.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["fetch.user"] });
      onSuccess?.(data);
    },
  });
};
