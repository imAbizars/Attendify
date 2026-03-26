import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authLogin } from "@/hooks/auth/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert,AlertDescription } from "@/components/ui/alert";
import Lottie from "lottie-react";
import SuccessAnimation from "@/assets/animation/Successfull Animation.json";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const [alertSuccess,setAlertSuccess] = useState(false);
    const [userRole, setUserRole] = useState("");
    const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!email && !password) return setError("Email dan password tidak boleh kosong");
    if (!email) return setError("Email tidak boleh kosong");
    if (!password) return setError("Password tidak boleh kosong");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Format email tidak valid");

    setLoading(true); 
    try {
        const payload = await authLogin(email, password);
        setUserRole(payload.role);
        setAlertSuccess(true);
        
    } catch (err) {
        const message = err.response?.data?.message;
        if (message === "Email tidak terdaftar") {
            setError("Email tidak terdaftar");
        } else if (message === "Password salah") {
            setError("Password salah");
        } else {
            setError("Terjadi kesalahan, coba lagi");
        }
    } finally {
        setLoading(false);
    }
};
    return(
        <div className="flex min-h-screen justify-center items-center">
            <Card className="w-full max-w-sm m-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Attendify </CardTitle>
                    <CardDescription className="text-md">
                    Silahkan Login Terlebih Dahulu
                    </CardDescription>
                </CardHeader>
                <CardContent className="mb-4">
                    <form >
                    <div className="flex flex-col gap-6">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        </div>
                        <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            
                        </div>
                        <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button 
                    onClick={handleLogin} 
                    className="w-full"
                    disabled={loading}
                    >
                    {loading?<Loader2 className="animate-spin"/>: "Login"}
                    </Button>
                </CardFooter>
            </Card>
            {/* todo : add animation login */}
            {alertSuccess && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <Alert className="w-50 h-50 flex items-center justify-center bg-white">
                        <AlertDescription className="flex flex-col items-center justify-center text-xl">
                            <Lottie
                            animationData={SuccessAnimation}
                            loop={false}
                            style={{width:200,height:200}}
                            onComplete={() => {
                                if (userRole === "ADMIN") {
                                    navigate("/dashboard");
                                } else {
                                    navigate("/home");
                                }
                            }}
                            />
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    )
}