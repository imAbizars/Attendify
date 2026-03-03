import { axiosInstance } from "@/lib/axios/axios";

export const authLogin = async(email,password)=>{
        const res = await axiosInstance.post("/auth/login",{ email, password });
        const {token,user} = res.data;

        localStorage.setItem("token",token);
        localStorage.setItem("user", JSON.stringify(user));
        //payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload
};