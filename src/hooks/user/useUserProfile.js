import { useState } from "react";
import { axiosInstance } from "@/lib/axios/axios";

export const useProfile = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const uploadPhoto = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("photo", file);

            const res = await axiosInstance.patch("/user/photo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const user = JSON.parse(localStorage.getItem("user"));
            user.photo = res.data.photo;
            localStorage.setItem("user", JSON.stringify(user));

            setMessage("Foto berhasil diupload");
            return res.data.photo;
        } catch (err) {
            setMessage(err.response?.data?.message || "Gagal upload foto");
        } finally {
            setLoading(false);
        }
    };

    return { uploadPhoto, loading, message };
};