import { axiosInstance } from "@/lib/axios/axios";

export const authLogin = async(email,password)=>{
        const res = await axiosInstance.post("/auth/login",{ email, password });
        const {token} = res.data;

        localStorage.setItem("token",token);
        //payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload
};