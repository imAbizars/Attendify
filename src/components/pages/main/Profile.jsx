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

export default function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const nama = user?.nama || "user";
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const inputRef = useRef(null);
    const { 
        uploadPhoto,
        loading, 
        getPhotoUser,
        photoProfile,
        fetchTotalAbsenUser,
        totalDataAbsen,
        totalDataAbsenIzin,
        fetchTotalAbsenUserIzin,
        totalDataAbsenTerlambat,
        fetchTotalAbsenUserTerlambat
    } = useProfile();

    useEffect(() => {
        getPhotoUser();
        fetchTotalAbsenUser();
        fetchTotalAbsenUserIzin();
        fetchTotalAbsenUserTerlambat();
    }, []);
    // saat pilih file, tampilkan preview
    const handlePilihFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        };

    // saat klik simpan
    const handleSimpan = async () => {
        if (!selectedFile) return;

        const newPhoto = await uploadPhoto(selectedFile);
        if (newPhoto) {
            setPhoto(newPhoto);
            setOpenModal(false);
            setPreview(null);
            setSelectedFile(null);
        }
    };
    const handleKlikPen = () => {
        setOpenModal(true);
    };
    // saat klik batal
    const handleBatal = () => {
        setOpenModal(false);
        setPreview(null);
        setSelectedFile(null);
        inputRef.current.value = ""; // reset input file
    };

    return (
        <div className="flex flex-col items-center min-h-screen pt-10">
            <div className="w-full flex flex-col items-center gap-6 pt-10 p-4">
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
                    {/* lebar span mengikuti panjang nama */}
                    <span
                        className="h-2 bg-main rounded-lg block border-2"
                        style={{ width: `${nama.length * 14}px` }} 
                    />
                </div>

                <Card className="w-full text-xs p-2">
                    <h1>Ringkasan Kehadiran Kamu</h1>
                    <p>Total Keseluruhan Hadir : {totalDataAbsen}</p>
                    <p>Total Keseluruhan Izin :{totalDataAbsenIzin} </p>
                    <p>Total Keseluruhan Terlambat: {totalDataAbsenTerlambat}</p>
                </Card>
            </div>

            {/* Modal Preview */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
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
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSimpan}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin w-4 h-4"/>
                                    Menyimpan...
                                </div>
                            ) : "Simpan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}