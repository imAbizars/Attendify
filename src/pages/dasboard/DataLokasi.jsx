import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    useLokasiList,
    useCreateLokasi,
    useSetLokasiAktif,
    useUpdateLokasi,
    useDeleteLokasi,
} from "@/hooks/lokasi/useLokasi";
import { getAllUser } from "@/hooks/user/index"
import { MapPin, Pencil, Trash2, LocateFixed, Loader2, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoMil from '@/assets/images/Logo-MilBay-Green.png';

const FORM_KOSONG = {
    nama: "",
    latitude: "",
    longtitude: "",
    radius: "",
};

// ==== Info perusahaan untuk header PDF ====
const COMPANY_INFO = {
    logo: logoMil,
    alamat: "Jl. Mandor Hasan No.79, RT.7/RW.6, Cipayung, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13840",
    telepon: "0812-8047-4074",
    instagram: "@milandbay",
};




const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Gagal memuat logo dari ${url} (status ${response.status})`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const getImageDimensions = (base64) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Gagal memuat dimensi gambar logo (format tidak valid)"));
        img.src = base64;
    });
};

export default function DataLokasi() {
    const { data: daftarLokasi, isLoading, isError } = useLokasiList();
    const { mutate: createLokasi, isPending: isCreating } = useCreateLokasi();
    const { mutate: setLokasiAktif, isPending: isSaving } = useSetLokasiAktif();
    const { mutate: updateLokasi, isPending: isUpdating } = useUpdateLokasi();
    const { mutate: deleteLokasi, isPending: isDeleting } = useDeleteLokasi();
    const { data: users} = getAllUser({});

    const [form, setForm] = useState(FORM_KOSONG);
    const [selectedId, setSelectedId] = useState(null);

    const [editOpen, setEditOpen] = useState(false);
    const [editForm, setEditForm] = useState(FORM_KOSONG);
    const [editId, setEditId] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState("");

    const [isLocatingEdit, setIsLocatingEdit] = useState(false);
    const [locationErrorEdit, setLocationErrorEdit] = useState("");

    // ==================== CETAK PDF ====================
    const [isPrinting, setIsPrinting] = useState(false);

    const handleCetakPDF = async () => {
        if (!daftarLokasi || daftarLokasi.length === 0) return;
        if (!users || users.length === 0) return;
        try {
            setIsPrinting(true);
            const hrdUser = users.find((u) =>
                u.jabatan?.toLowerCase().trim() === "hrd"
            );
        
            const namaHRD = hrdUser ? hrdUser.name : "( Nama Lengkap )";
            const logoBase64 = await getBase64FromUrl(COMPANY_INFO.logo);
            const { width: imgW, height: imgH } = await getImageDimensions(logoBase64);

            const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const primaryColor = [61, 92, 75];

            // ---------- Header: logo ----------
            const logoWidth = 42;
            const logoHeight = (imgH / imgW) * logoWidth;
            doc.addImage(logoBase64, "PNG", 14, 10, logoWidth, logoHeight);

            // ---------- Header: info perusahaan (kanan) ----------
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(90, 90, 90);
            const infoX = pageWidth - 14;
            doc.text(COMPANY_INFO.alamat, infoX, 14, { align: "right", maxWidth: 130 });
            doc.text(`${COMPANY_INFO.telepon}   |   ${COMPANY_INFO.instagram}`, infoX, 26, { align: "right" });

            // ---------- Garis pemisah header ----------
            const headerBottom = Math.max(10 + logoHeight, 30) + 4;
            doc.setDrawColor(...primaryColor);
            doc.setLineWidth(0.6);
            doc.line(14, headerBottom, pageWidth - 14, headerBottom);

            // ---------- Judul dokumen ----------
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(...primaryColor);
            doc.text("DATA LOKASI ABSENSI", 14, headerBottom + 9);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(110, 110, 110);
            const tanggalCetak = new Date().toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric"
            });
            doc.text(
                `Dicetak pada: ${tanggalCetak}   |   Total Lokasi: ${daftarLokasi.length}`,
                14,
                headerBottom + 15
            );

            // ---------- Tabel data lokasi ----------
            autoTable(doc, {
                startY: headerBottom + 20,
                head: [["Id Lokasi", "Nama Lokasi", "Latitude", "Longitude", "Radius (meter)", "Status"]],
                body: daftarLokasi.map((lokasi) => [
                    lokasi.kodeLokasi,
                    lokasi.nama,
                    lokasi.latitude,
                    lokasi.longtitude,
                    `${lokasi.radius} m`,
                    lokasi.isActive ? "Aktif" : "Tidak Aktif",
                ]),
                theme: "grid",
                headStyles: {
                    fillColor: primaryColor,
                    textColor: 255,
                    fontStyle: "bold",
                    halign: "center",
                    valign: "middle",
                    fontSize: 9,
                    cellPadding: 4,
                },
                alternateRowStyles: { fillColor: [244, 247, 245] },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    textColor: [40, 40, 40],
                    lineColor: [220, 220, 220],
                    valign: "middle",
                    overflow: "linebreak",
                },
                columnStyles: {
                    0: { cellWidth: 31, halign: "center" },  // No
                    1: { cellWidth: 56,halign: "center"},                     // Nama Lokasi
                    2: { cellWidth: 46, halign: "center" },  // Latitude
                    3: { cellWidth: 46, halign: "center" },  // Longitude
                    4: { cellWidth: 46, halign: "center" },  // Radius
                    5: { cellWidth: 44, halign: "center" },  // Status
                },
                tableWidth: "wrap",
                margin: { left: 14, right: 14, bottom: 20 },
                didParseCell: (data) => {
                    // Warnai status Aktif/Tidak Aktif
                    if (data.section === "body" && data.column.index === 5) {
                        const status = data.cell.raw;
                        if (status === "Aktif") {
                            data.cell.styles.textColor = [22, 101, 52];
                            data.cell.styles.fontStyle = "bold";
                        } else {
                            data.cell.styles.textColor = [120, 120, 120];
                        }
                    }
                },
                didDrawPage: () => {
                    const pageCount = doc.internal.getNumberOfPages();
                    const currentPageNum = doc.internal.getCurrentPageInfo().pageNumber;
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.setTextColor(140, 140, 140);
                    doc.text(`Halaman ${currentPageNum} dari ${pageCount}`, 14, pageHeight - 10);
                },
            });

            // ---------- Blok tanda tangan HRD ----------
            const jakartaDate = new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            let signY = doc.lastAutoTable.finalY + 20;
            const signBlockHeight = 45;

            if (signY + signBlockHeight > pageHeight - 15) {
                doc.addPage();
                signY = 25;

                const pageCount = doc.internal.getNumberOfPages();
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(140, 140, 140);
                doc.text(`Halaman ${pageCount} dari ${pageCount}`, 14, pageHeight - 10);
            }

            const signX = pageWidth - 14;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(40, 40, 40);

            doc.text(`Jakarta, ${jakartaDate}`, signX, signY, { align: "right" });

            doc.text("Mengetahui,", signX, signY + 7, { align: "right" });
            doc.setFont("helvetica", "bold");
            doc.text("HRD Mil & Bay", signX, signY + 14, { align: "right" });

            const signLineY = signY + 35;
            doc.setDrawColor(80, 80, 80);
            doc.setLineWidth(0.3);
            doc.line(signX - 55, signLineY, signX, signLineY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(90, 90, 90);
            doc.text(
                hrdUser ? `( ${namaHRD} )` : "( Nama HRD belum diatur )",
                signX,
                signLineY + 5,
                { align: "right" }
            );

            doc.save(`Data-Lokasi-MilBay-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsPrinting(false);
        }
    };
    // =====================================================

    useEffect(() => {
        if (daftarLokasi?.length) {
            const aktif = daftarLokasi.find((l) => l.isActive);
            setSelectedId(aktif?.id ?? daftarLokasi[0].id);
        }
    }, [daftarLokasi]);

    const lokasiAktifSaatIni = daftarLokasi?.find((l) => l.isActive);
    const adaPerubahan = selectedId && selectedId !== lokasiAktifSaatIni?.id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleTambahLokasi = () => {
        createLokasi(
            {
                nama: form.nama,
                latitude: parseFloat(form.latitude),
                longtitude: parseFloat(form.longtitude),
                radius: parseInt(form.radius),
            },
            {
                onSuccess: () => {
                    setForm(FORM_KOSONG);
                    setLocationError("");
                },
            }
        );
    };

    const handleSimpanAktif = () => {
        if (!selectedId) return;
        setLokasiAktif(selectedId);
    };

    const openEdit = (lokasi) => {
        setEditId(lokasi.id);
        setEditForm({
            nama: lokasi.nama,
            latitude: lokasi.latitude,
            longtitude: lokasi.longtitude,
            radius: lokasi.radius,
        });
        setLocationErrorEdit("");
        setEditOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSimpanEdit = () => {
        updateLokasi(
            {
                id: editId,
                nama: editForm.nama,
                latitude: parseFloat(editForm.latitude),
                longtitude: parseFloat(editForm.longtitude),
                radius: parseInt(editForm.radius),
            },
            {
                onSuccess: () => setEditOpen(false),
            }
        );
    };

    const handleHapus = () => {
        if (!deleteTarget) return;
        deleteLokasi(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const handleGunakanLokasiSekarang = () => {
        if (!navigator.geolocation) {
            setLocationError("Browser tidak mendukung geolocation");
            return;
        }

        setIsLocating(true);
        setLocationError("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setForm((prev) => ({
                    ...prev,
                    latitude: latitude.toFixed(6),
                    longtitude: longitude.toFixed(6),
                }));
                setIsLocating(false);
            },
            (error) => {
                let pesan = "Gagal mengambil lokasi";
                if (error.code === error.PERMISSION_DENIED) {
                    pesan = "Izin lokasi ditolak. Aktifkan izin lokasi di browser.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    pesan = "Lokasi tidak tersedia saat ini";
                } else if (error.code === error.TIMEOUT) {
                    pesan = "Waktu pengambilan lokasi habis, coba lagi";
                }
                setLocationError(pesan);
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const handleGunakanLokasiSekarangEdit = () => {
        if (!navigator.geolocation) {
            setLocationErrorEdit("Browser tidak mendukung geolocation");
            return;
        }

        setIsLocatingEdit(true);
        setLocationErrorEdit("");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setEditForm((prev) => ({
                    ...prev,
                    latitude: latitude.toFixed(6),
                    longtitude: longitude.toFixed(6),
                }));
                setIsLocatingEdit(false);
            },
            (error) => {
                let pesan = "Gagal mengambil lokasi";
                if (error.code === error.PERMISSION_DENIED) {
                    pesan = "Izin lokasi ditolak. Aktifkan izin lokasi di browser.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    pesan = "Lokasi tidak tersedia saat ini";
                } else if (error.code === error.TIMEOUT) {
                    pesan = "Waktu pengambilan lokasi habis, coba lagi";
                }
                setLocationErrorEdit(pesan);
                setIsLocatingEdit(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const formValid =
        form.nama && form.latitude !== "" && form.longtitude !== "" && form.radius !== "";
    const editFormValid =
        editForm.nama &&
        editForm.latitude !== "" &&
        editForm.longtitude !== "" &&
        editForm.radius !== "";

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full p-6 lg:items-stretch lg:h-[500px]">
            {/* KIRI: Form tambah lokasi */}
            <div className="w-full lg:w-1/2 shrink-0 flex flex-col lg:h-full">
                <h2 className="text-xl font-semibold mb-4">Tambah Lokasi</h2>

                <div className="space-y-4 flex-1">
                    <div>
                        <Label htmlFor="nama">Nama Lokasi</Label>
                        <Input
                            id="nama"
                            name="nama"
                            placeholder="Contoh: Kantor Pusat"
                            value={form.nama}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Button
                            type="button"
                            className="w-full"
                            onClick={handleGunakanLokasiSekarang}
                            disabled={isLocating}
                        >
                            {isLocating ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Mengambil lokasi...
                                </>
                            ) : (
                                <>
                                    <LocateFixed size={16} className="mr-2" />
                                    Gunakan Lokasi Sekarang
                                </>
                            )}
                        </Button>
                        {locationError && (
                            <p className="text-sm text-red-600 mt-1">{locationError}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                placeholder="-6.29"
                                value={form.latitude}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="longtitude">Longitude</Label>
                            <Input
                                id="longtitude"
                                name="longtitude"
                                type="number"
                                step="any"
                                placeholder="106.90"
                                value={form.longtitude}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="radius">Radius Absen (meter)</Label>
                        <Input
                            id="radius"
                            name="radius"
                            type="number"
                            placeholder="100"
                            value={form.radius}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <Button
                    className="w-full mt-6"
                    size="lg"
                    disabled={!formValid || isCreating}
                    onClick={handleTambahLokasi}
                >
                    {isCreating ? "Menambahkan..." : "Tambah Lokasi"}
                </Button>
            </div>

            {/* KANAN: Pilih lokasi aktif */}
            <div className="w-full flex flex-col lg:h-full">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                        <h2 className="text-xl font-semibold">Pilih Lokasi Aktif</h2>
                        <p className="text-sm text-muted-foreground">
                            Pilih lokasi yang akan digunakan sebagai pusat absen
                        </p>
                    </div>
                    <Button
                        className="bg-chart-2 font-bold shrink-0"
                        onClick={handleCetakPDF}
                        disabled={isPrinting || isLoading || !daftarLokasi?.length}
                    >
                        {isPrinting ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Printer size={18} />
                        )}
                        <span className="ml-2">Cetak PDF</span>
                    </Button>
                </div>

                {/* Info lokasi aktif sekarang */}
                {lokasiAktifSaatIni && (
                    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 mb-4 mt-3">
                        <div className="rounded-full bg-green-500 text-white p-2 shrink-0">
                            <MapPin size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">Lokasi aktif saat ini</p>
                            <p className="font-medium truncate">
                                {lokasiAktifSaatIni.nama}{" "}
                                <span className="text-muted-foreground font-normal">
                                    ({lokasiAktifSaatIni.latitude}, {lokasiAktifSaatIni.longtitude} · radius{" "}
                                    {lokasiAktifSaatIni.radius}m)
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                {isLoading && <p>Memuat data lokasi...</p>}
                {isError && <p>Gagal memuat data lokasi.</p>}

                {!isLoading && !isError && daftarLokasi?.length === 0 && (
                    <p className="text-sm text-muted-foreground flex-1">
                        Belum ada data lokasi. Tambahkan lokasi terlebih dahulu.
                    </p>
                )}

                {!isLoading && daftarLokasi?.length > 0 && (
                    <>
                        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                                {daftarLokasi.map((lokasi) => {
                                const isSelected = selectedId === lokasi.id;

                                return (
                                    <Card
                                        key={lokasi.id}
                                        onClick={() => setSelectedId(lokasi.id)}
                                        className={cn(
                                            "p-4 cursor-pointer transition-all border-2",
                                            isSelected
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-transparent hover:border-muted-foreground/20"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={cn(
                                                    "rounded-full p-2 shrink-0",
                                                    isSelected
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-muted"
                                                )}
                                            >
                                                <MapPin size={18} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium truncate">
                                                        {lokasi.nama}
                                                    </p>
                                                    {lokasi.isActive && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                            Aktif
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {lokasi.latitude}, {lokasi.longtitude}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Radius {lokasi.radius} meter
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-1 shrink-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEdit(lokasi);
                                                    }}
                                                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                                    title="Edit lokasi"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteTarget(lokasi);
                                                    }}
                                                    className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600"
                                                    title="Hapus lokasi"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                                })}
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6"
                            size="lg"
                            disabled={!adaPerubahan || isSaving}
                            onClick={handleSimpanAktif}
                        >
                            {isSaving ? "Menyimpan..." : "Simpan Lokasi Aktif"}
                        </Button>
                    </>
                )}
            </div>

            {/* Dialog Edit Lokasi */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Lokasi</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-nama">Nama Lokasi</Label>
                            <Input
                                id="edit-nama"
                                name="nama"
                                value={editForm.nama}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleGunakanLokasiSekarangEdit}
                                disabled={isLocatingEdit}
                            >
                                {isLocatingEdit ? (
                                    <>
                                        <Loader2 size={16} className="mr-2 animate-spin" />
                                        Mengambil lokasi...
                                    </>
                                ) : (
                                    <>
                                        <LocateFixed size={16} className="mr-2" />
                                        Gunakan Lokasi Sekarang
                                    </>
                                )}
                            </Button>
                            {locationErrorEdit && (
                                <p className="text-sm text-red-600 mt-1">{locationErrorEdit}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-latitude">Latitude</Label>
                                <Input
                                    id="edit-latitude"
                                    name="latitude"
                                    type="number"
                                    step="any"
                                    value={editForm.latitude}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-longtitude">Longitude</Label>
                                <Input
                                    id="edit-longtitude"
                                    name="longtitude"
                                    type="number"
                                    step="any"
                                    value={editForm.longtitude}
                                    onChange={handleEditChange}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="edit-radius">Radius Absen (meter)</Label>
                            <Input
                                id="edit-radius"
                                name="radius"
                                type="number"
                                value={editForm.radius}
                                onChange={handleEditChange}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleSimpanEdit}
                            disabled={!editFormValid || isUpdating}
                        >
                            {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Hapus */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Lokasi</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Yakin ingin menghapus lokasi{" "}
                        <span className="font-medium text-foreground">{deleteTarget?.nama}</span>?
                        Tindakan ini tidak bisa dibatalkan.
                    </p>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleHapus}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}