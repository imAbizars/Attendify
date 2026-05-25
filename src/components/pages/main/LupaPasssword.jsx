import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useVerifyEmail } from "@/hooks/user/index";

export default function LupaPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const { mutate: verifyEmail, isPending } = useVerifyEmail();

    const handleEmail = (e) => {
        e.preventDefault(); // ← form sekarang pakai onSubmit
        verifyEmail(email, {
            onSuccess: () => {
                setMessage("Link reset password sudah dikirim, cek email kamu!");
            },
            onError: () => {
                setMessage("Email tidak terdaftar, periksa kembali alamat email kamu.");
            }
        });
    };

    return (
        <div className="flex justify-center items-center border border-black min-h-screen w-full">
            <Card className="w-full max-w-sm mx-10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle /> Konfirmasi Reset Password
                    </CardTitle>
                    <CardDescription>
                        Masukkan alamat email anda. Kami akan mengirimkan link untuk me-reset password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmail} className="flex flex-col gap-2">
                        {message && (
                            <label className="text-sm text-muted-foreground">
                                {message}
                            </label>
                        )}
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Masukkan alamat email"
                            required
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Mengirim..." : "Kirim Link"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}