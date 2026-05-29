import { useState } from "react";
import {useSearchParams} from "react-router-dom";
import {axiosInstance} from "@/lib/axios/axios";
import { Button } from "@/components/ui/button";
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword(){
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); 
    const [password, setPassword] = useState("");
    const [konfirmasiPassword,setkonfirmasiPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading,setLoading] = useState(false);
    const [success,setSuccess] = useState(false);
    const navigate = useNavigate();
    
    // matching pw
    const matchingPass = password !== "" && konfirmasiPassword !== "" && password == konfirmasiPassword;
    
    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post("/settings/resetPassword", { token, password });
            setMessage("Password berhasil direset, silakan");
            setSuccess(true);
            setPassword("");
            setkonfirmasiPassword("");
        } catch (error) {
            setMessage("Link sudah expired atau tidak valid, silahkan kirim ulang link ke email");
            setSuccess(false);
        }
        setLoading(false);
    };
    return(
        <div className="flex justify-center items-center border border-black min-h-screen w-full">
            <Card className="w-full max-w-sm mx-10">
                <CardHeader>
                    <CardTitle>
                        Reset Password
                    </CardTitle>
                    <CardDescription>
                        Buat password baru yang aman untuk akunmu.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                    className="flex flex-col gap-2"
                    onSubmit={handleReset}>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password baru"
                    />
                    <Input
                        type ="password"
                        value={konfirmasiPassword}
                        onChange={(e)=>setkonfirmasiPassword(e.target.value)}
                        placeholder="Konfirmasi Password"
                    />
                    {konfirmasiPassword && !matchingPass &&(
                        <p className="text-red-500 text-sm">Password tidak cocok</p>
                    )}
                    
                    <Button type="submit" disabled={!matchingPass || loading}>{loading ? <Loader2 className="animate-spin"/> : "Reset Password"}</Button>
                    {message && <p className="flex items-center gap-2">{message}
                        <Button 
                        type="button"
                        onClick={()=>navigate(success ? "/" : "/lupapassword")}>
                            {success ? "Login" : "Kirim Ulang"}
                        </Button>
                        </p>}
                </form>
                </CardContent>
            </Card>
        </div>
    )
}