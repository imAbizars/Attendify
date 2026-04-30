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
import {PenBox,FileDown,KeyRound} from "lucide-react"

export default function Profile() {
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const inputRef = useRef(null);
    const { 
        uploadPhoto,
        loading, 
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
            setOpenModal(false);
            setPreview(null);
            setSelectedFile(null);
        }
    };
    const handleKlikPen = () => {
        setPreview(photoProfile || null); 
        setOpenModal(true);
    };

    const handleBatal = () => {
        setOpenModal(false);
        setPreview(null);
        setSelectedFile(null);
        inputRef.current.value = ""; 
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-5 pb-8">
            <div className="w-full flex flex-col items-center gap-4 pt-8 p-4">
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
                        className="h-2 bg-main rounded-lg block border-2"
                        style={{ width: `${nama.length * 14}px` }}
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
                        <Button className="flex bg-background mt-2 text-xs"> <FileDown/> Ekspor PDF</Button>
                    </div>
                </Card>
                <Card className="w-full p-4 bg-main">
                    <h1 className="text-md">Data Pribadi</h1>
                    <div className="flex flex-col gap-2">
                        <div className="flex text-xs items-center justify-between ">
                            <div className="flex items-center min-w-0 flex-1">
                                <span className="w-25 shrink-0">Email</span>
                                <span className="truncate">: {email}</span>
                            </div>
                            <Button className="w-6 h-9 shrink-0"><PenBox/></Button>
                        </div>
                        <div className="flex text-xs items-center justify-between">
                            <div className="flex items-center min-w-0 flex-1">
                                <span className="w-25 shrink-0">No Telepon</span>
                                <span className="truncate">: {noTelepon}</span>
                            </div>
                            <Button className="w-6 h-9 shrink-0"><PenBox/></Button>
                        </div>
                        <Button className="flex bg-background mt-2 text-xs"
                        >
                            <KeyRound/>
                            Ganti Password
                        </Button>
                    </div>
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