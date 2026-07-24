import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios/axios";

// GET semua lokasi
const getAllLokasi = async () => {
    const res = await axiosInstance.get("/lokasi");
    return res.data.data;
};

export const useLokasiList = () => {
    return useQuery({
        queryKey: ["lokasi"],
        queryFn: getAllLokasi,
    });
};

// POST lokasi baru
const createLokasi = async (data) => {
    const res = await axiosInstance.post("/lokasi", data);
    return res.data;
};

export const useCreateLokasi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLokasi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lokasi"] });
        },
    });
};

// PUT edit lokasi
const updateLokasi = async ({ id, ...data }) => {
    const res = await axiosInstance.put(`/lokasi/${id}`, data);
    return res.data;
};

export const useUpdateLokasi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateLokasi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lokasi"] });
        },
    });
};

// DELETE lokasi
const deleteLokasi = async (id) => {
    const res = await axiosInstance.delete(`/lokasi/${id}`);
    return res.data;
};

export const useDeleteLokasi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteLokasi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lokasi"] });
        },
    });
};

// PATCH set lokasi aktif
const setLokasiAktif = async (id) => {
    const res = await axiosInstance.patch(`/lokasi/${id}/aktif`);
    return res.data;
};

export const useSetLokasiAktif = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: setLokasiAktif,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lokasi"] });
        },
    });
};