import { useState, useRef } from "react";
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

export default function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const nama = user?.name || "user";
    const [photo, setPhoto] = useState(user?.photo || null);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const inputRef = useRef(null);
    const { uploadPhoto, loading, message } = useProfile();

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
        <div className="flex flex-col items-center border border-black min-h-screen pt-10">
            <div className="flex flex-col items-center gap-8">

                {/* foto profile */}
                <div className="relative w-35 h-35">
                    <div className="w-35 h-35 border border-black rounded-full overflow-hidden">
                        {photo ? (
                            <img src={photo} alt="profile" className="w-full h-full object-cover"/>
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                No Photo
                            </div>
                        )}
                    </div>

                    {/* tombol pen */}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePilihFile}
                    />
                    <button
                        onClick={handleKlikPen}
                        className="absolute bottom-0 right-0 bg-main text-white rounded-full p-1 cursor-pointer"
                    >
                        <PenIcon className="w-4 h-4"/>
                    </button>
                </div>

                <div className="text-xl">{nama}</div>

                {message && (
                    <p className="text-sm text-green-500">{message}</p>
                )}
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