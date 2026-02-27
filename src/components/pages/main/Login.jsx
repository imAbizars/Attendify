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
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const payload = await authLogin(email, password);

            if (payload.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/home");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login gagal");
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
                <CardContent>
                    <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-6">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        </div>
                        <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                            Forgot your password?
                            </a>
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
                    <Button type="submit" className="w-full">
                    Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}