import { useState, useRef, useEffect } from "react";
import { useProfile } from "@/hooks/user/useUserProfile";
import { Loader2, PenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {PenBox,KeyRound,CircleCheck,XCircle,LogOut} from "lucide-react"
import { Input } from "../../components/ui/input";
import { axiosInstance } from "@/lib/axios/axios";
import {Alert,AlertDescription} from "@/components/ui/alert";
export default function Profile() {
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [openModalPhoto, setOpenModalPhoto] = useState(false);
    const [openModalPassword,setOpenModalPassword] = useState(false);
    const [openModalEmail,setOpenModalEmail] = useState(false);
    const inputRef = useRef(null);
    const [oldPassword,setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("");
    const [konfirmasiPassword,setkonfirmasiPassword] = useState("");
    const [emailUser,setEmailUser] = useState("");
    const [loading,setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isLeaving, setIsLeaving] = useState(false);
    const showAlert = (message, type = "success") => {
        setIsLeaving(false);
        setAlert({ message, type });

        setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => setAlert(null), 300);
        }, 2000);
    };
    const { 
        uploadPhoto,
        loading :loadUser, 
        fetchInfoUser,
        photoProfile,
        fetchStatistikAbsen,
        totalHadir,
        totalIzin,
        totalTerlambat,
        infoRank,
        infoRankUser,
        email,
        nama,
        noTelepon
    } = useProfile();

    useEffect(() => {
        fetchInfoUser();
        fetchStatistikAbsen();
        infoRank();
    }, []);
    // saat pilih file, tampilkan preview
    const handleKlikPen = () => {
        setPreview(photoProfile || null); 
        setOpenModalPhoto(true);
    };
    const handleOpenModalPw = () =>{
        setOpenModalPassword(true);
    }
    const handleOpenModalEmail = ()=>{
        setOpenModalEmail(true)    
    }

    const handlePilihFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl); 
    };

    const handleSimpan = async () => {
        if (!selectedFile) return;

        const newPhoto = await uploadPhoto(selectedFile);
        if (newPhoto) {
            setPhoto(newPhoto);
            setOpenModalPhoto(false);
            setPreview(null);
            setSelectedFile(null);
        }
    };

    const handleBatal = () => {
        setOpenModalPhoto(false);
        setPreview(null);
        setSelectedFile(null);
        inputRef.current.value = ""; 
    };
    // handle reset pw
    const matchingPass = newPassword !== "" && konfirmasiPassword !== "" && newPassword == konfirmasiPassword;
    const handleResetPw = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post("/settings/gantiPassword", {
                oldPassword,
                newPassword,
            });
            showAlert("Password Diupdate", "success");
            setOldPassword("");
            setNewPassword("");
            setkonfirmasiPassword("");
        } catch (error) {
            showAlert(error?.response?.data?.message || "Gagal update password", "error");
        } finally {
            setLoading(false);
        }
    };
    
    // handle reset email
    const handleResetEmail = async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            await axiosInstance.patch("/user/gantiEmail",{
                emailUser
            });
            fetchInfoUser();
            setEmailUser("");
            showAlert("Email Diupdate","success");
        }catch(error){
            showAlert(error?.response?.data?.message || "Gagal update email", "error");
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="flex flex-col items-center min-h-screen px-4 pb-8">
            <div className="w-full flex flex-col items-center gap-4 p-4">
                <div className="flex w-full justify-end">
                    <Button size="sm" className="[&_svg]:size-[25px]">
                        <LogOut/>
                    </Button>
                </div>
                <div className="relative w-40 h-40">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-black">
                        {photoProfile ? (
                            <img src={photoProfile} alt="profile" className="w-full h-full object-cover"/>
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                No Photo
                            </div>
                        )}
                    </div>
                    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handlePilihFile}/>
                    <Button
                        onClick={handleKlikPen}
                        variant="noShadow"
                        className="absolute bottom-0 right-0 bg-main text-white rounded-full p-3"
                    >
                        <PenIcon className="w-4 h-4"/>
                    </Button>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl font-bold">{nama}</div>
                    <span
                        className="h-2 w-15 bg-main rounded-lg block border-2"
                        
                    />
                </div>
                <span className="text-xs px-3 py-1 bg-main text-white rounded-full font-medium shadow-sm border-2 border-black">
                        🏆 {infoRankUser}
                </span>
                
                <Card className="w-full p-4 bg-main">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-md ">Ringkasan Kehadiran Kamu</h1>

                        {[
                            { label: "Total Hadir", value: totalHadir},
                            { label: "Total Izin", value: totalIzin },
                            { label: "Total Terlambat", value: totalTerlambat},
                        ].map(({ label, value }) => (
                            <div key={label} className="flex text-xs">
                                <span className="w-25">{label}</span>
                                <span>: {value}</span>
                            </div>
                        ))}
                    </div>
                    <span className="h-2 w-full mt-5 mb-5 bg-white rounded-lg block border-2"/>
                    <h1 className="text-md">Data Pribadi</h1>
                    <div className="flex flex-col gap-2">
                        <div className="flex text-xs items-center justify-between ">
                            <div className="flex items-center min-w-0 flex-1">
                                <span className="w-25 shrink-0">Email</span>
                                <span className="truncate">: {email}</span>
                            </div>
                            <Button
                            onClick={handleOpenModalEmail}
                            className="w-6 h-9 shrink-0"
                            ><PenBox/>
                            </Button>
                        </div>
                        <div className="flex text-xs items-center justify-between">
                            <div className="flex items-center min-w-0 flex-1">
                                <span className="w-25 shrink-0">No Telepon</span>
                                <span className="truncate">: {noTelepon}</span>
                            </div>
                            <Button className="w-6 h-9 shrink-0"><PenBox/></Button>
                        </div>
                        <Button
                        onClick={handleOpenModalPw} 
                        className="flex bg-background mt-2 text-xs"
                        >
                            <KeyRound/>
                            Ganti Password
                        </Button>
                    </div>
                </Card>

            </div>

            {/* modal password */}
            <Dialog open={openModalPassword} onOpenChange={setOpenModalPassword}>
                <DialogContent className="px-15 py-13">
                    <DialogHeader>
                        <DialogTitle>Masukkan Password Baru</DialogTitle>
                    </DialogHeader>
                    <form className="flex flex-col gap-2" onSubmit={handleResetPw}>
                        <Input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Password lama"
                        />
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Password baru"
                        />
                        <Input
                            type="password"
                            value={konfirmasiPassword}
                            onChange={(e) => setkonfirmasiPassword(e.target.value)}
                            placeholder="Konfirmasi Password"
                        />
                        {konfirmasiPassword && !matchingPass && (
                            <p className="text-red-500 text-sm">Password tidak cocok</p>
                        )}
                        <Button type="submit" disabled={loading || !matchingPass}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin w-4 h-4" />
                                </div>
                            ) : (
                                "Reset"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            {alert && (
                <div className="fixed inset-0 flex w-60 h-15 top-10 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
                    <Alert
                        className={`flex text-center justify-center items-center gap-2 shadow-xl ${isLeaving ? "animate-slideUp" : "animate-slideDown"} ${
                            alert.type === "error"
                                ? "bg-white border-red-500"
                                : "bg-white border-green-500"
                        }`}
                    >
                        {alert.type === "error" ? (
                            <XCircle strokeWidth={3.5} style={{color:"red"}} />
                        ) : (
                            <CircleCheck strokeWidth={3.5} className="text-green-500" />
                        )}
                        <AlertDescription
                            className={`font-bold text-base ${
                                alert.type === "error" ? "text-red-500" : "text-black"
                            }`}
                        >
                            {alert.message}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Modal photo Preview */}
            <Dialog open={openModalPhoto} onOpenChange={setOpenModalPhoto}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Preview Foto Profile</DialogTitle>
                    </DialogHeader>

                    {preview && (
                        <div className="flex justify-center">
                            <img
                                src={preview}
                                alt="preview"
                                className="w-48 h-48 rounded-full object-cover border-2 border-main"
                            />
                        </div>
                    )}
                    

                    <Button onClick={() => inputRef.current.click()}>
                        Pilih Foto
                    </Button>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleBatal}
                            disabled={loadUser}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSimpan}
                            disabled={loadUser}
                            >
                            {loadUser ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin w-4 h-4"/>
                                    Menyimpan...
                                </div>
                            ) : "Simpan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* modal ganti email */}
            <Dialog open={openModalEmail} onOpenChange={setOpenModalEmail} >
                <DialogContent className="px-15 py-13">
                    <DialogHeader>
                        <DialogTitle>Masukkan Email Valid</DialogTitle>
                    </DialogHeader>
                    <form 
                    onSubmit={handleResetEmail}
                    className="flex flex-col gap-2">
                        <Input
                        type="email"
                        value={emailUser}
                        onChange={(e)=>setEmailUser(e.target.value)}
                        placeholder="Masukkan Email Baru"
                        />
                        <Button
                        type="submit"
                        disabled={loading}
                        >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin w-4 h-4" />
                            </div>
                        ) : (
                            "Simpan"
                        )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            {alert && (
                <div className="fixed inset-0 flex w-60 h-15 top-10 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
                    <Alert
                        className={`flex text-center justify-center items-center gap-2 shadow-xl ${isLeaving ? "animate-slideUp" : "animate-slideDown"} ${
                            alert.type === "error"
                                ? "bg-white border-red-500"
                                : "bg-white border-green-500"
                        }`}
                    >
                        {alert.type === "error" ? (
                            <XCircle strokeWidth={3.5} style={{color:"red"}} />
                        ) : (
                            <CircleCheck strokeWidth={3.5} className="text-green-500" />
                        )}
                        <AlertDescription
                            className={`font-bold text-base ${
                                alert.type === "error" ? "text-red-500" : "text-black"
                            }`}
                        >
                            {alert.message}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

        </div>
    );
}