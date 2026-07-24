import { useAllIzin } from "@/hooks/izin/getIzinUser"
import { useUpdateIzin } from "@/hooks/izin/useUpdateIzin"
import { getAllUser } from "@/hooks/user/index"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { CircleCheck, XCircle, Printer, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoMil from '@/assets/images/Logo-MilBay-Green.png';

// ==== Info perusahaan untuk header PDF ====
const COMPANY_INFO = {
    logo: logoMil,
    alamat: "Jl. Mandor Hasan No.79, RT.7/RW.6, Cipayung, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13840",
    telepon: "0812-8047-4074",
    instagram: "@milandbay",
};

// Konversi gambar ke base64 agar bisa di-embed jsPDF
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

// Ambil dimensi asli gambar supaya rasio logo tidak gepeng
const getImageDimensions = (base64) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Gagal memuat dimensi gambar logo (format tidak valid)"));
        img.src = base64;
    });
};

export default function DataIzin() {
    const { data: semuaIzin, isError, isLoading, error } = useAllIzin();
    const { data: users,  } = getAllUser({});
    const { mutate: updateStatus, isPending } = useUpdateIzin();
    const [alert, setAlert] = useState();
    const [isLeaving, setIsLeaving] = useState(false);

    const showAlert = (message, type = "success") => {
        setIsLeaving(false);
        setAlert({ message, type });

        setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => setAlert(null), 300);
        }, 2000);
    };

    const formatDate = (date) => {
        if (!date) return "Pilih Tanggal";
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const handleUpdateStatus = (id, status) => {
        updateStatus(
            { id, status },
            {
                onSuccess: () => {
                    showAlert(
                        status === "Disetujui" ? "Izin Disetujui" : "Izin Ditolak",
                        "success"
                    );
                },
                onError: (err) => {
                    showAlert(
                        err?.response?.data?.message || "Gagal memperbarui status izin",
                        "error"
                    );
                },
            }
        );
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "disetujui":
                return "bg-green-600 text-green-200 border border-green-500";
            case "ditolak":
                return "bg-red-600 text-red-200 border border-red-500";
            default:
                return "bg-orange-100 text-orange-700 border border-orange-500";
        }
    };

    // ==================== CETAK PDF ====================
    const [isPrinting, setIsPrinting] = useState(false);

    const handleCetakPDF = async () => {
        if (!semuaIzin || semuaIzin.length === 0) return;
        if (!users || users.length === 0) return;
        try {
            setIsPrinting(true);

            // Cari HRD dari data user yang menyertai setiap izin
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
            doc.text("LAPORAN PENGAJUAN IZIN KERJA", 14, headerBottom + 9);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(110, 110, 110);
            const tanggalCetak = new Date().toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric"
            });
            doc.text(
                `Dicetak pada: ${tanggalCetak}   |   Total Pengajuan: ${semuaIzin.length}`,
                14,
                headerBottom + 15
            );

            // ---------- Tabel data izin ----------
            autoTable(doc, {
                startY: headerBottom + 20,
                head: [["Id","Id Pegawai", "Nama", "Jabatan", "Tanggal Izin", "Keterangan", "Status"]],
                body: semuaIzin.map((izin) => [
                    izin.kodeIzin,
                    izin.user?.kodeUser || "-",
                    izin.user?.name || "-",
                    izin.user?.jabatan || "-",
                    `${formatDate(new Date(izin.tanggalIzin))} - ${formatDate(new Date(izin.selesaiIzin))}`,
                    izin.keterangan || "-",
                    izin.status,
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
                    fontSize: 8.5,
                    cellPadding: 3,
                    textColor: [40, 40, 40],
                    lineColor: [220, 220, 220],
                    valign: "middle",
                    overflow: "linebreak",
                },
                columnStyles: {
                    0: { cellWidth: 17, halign: "center"},   // Id
                    1: { cellWidth: 37, halign: "center"},                      // Nama
                    2: { cellWidth: 37},   // Jabatan
                    3: { cellWidth: 37, halign: "center"},   // Tanggal Izin
                    4: { cellWidth: 47, halign: "center"},                      // Keterangan
                    5: { cellWidth: 47},   // Status
                    6: { cellWidth: 37, halign: "center"},   // Status
                },
                tableWidth: "wrap",
                margin: { left: 14, right: 14, bottom: 20 },
                didParseCell: (data) => {
                    // Warnai teks status sesuai kondisinya
                    if (data.section === "body" && data.column.index === 6) {
                        const status = data.cell.raw?.toLowerCase();
                        if (status === "disetujui") {
                            data.cell.styles.textColor = [22, 101, 52];
                            data.cell.styles.fontStyle = "bold";
                        } else if (status === "ditolak") {
                            data.cell.styles.textColor = [153, 27, 27];
                            data.cell.styles.fontStyle = "bold";
                        } else {
                            data.cell.styles.textColor = [180, 83, 9];
                            data.cell.styles.fontStyle = "bold";
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
                namaHRD ? `( ${namaHRD} )` : "( Nama HRD belum diatur )",
                signX,
                signLineY + 5,
                { align: "right" }
            );

            doc.save(`Laporan-Izin-MilBay-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error(err);
            showAlert("Gagal membuat PDF", "error");
        } finally {
            setIsPrinting(false);
        }
    };
    // =====================================================

    return (
        <div className="flex flex-col gap-4 h-full w-full">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                    <h1 className="text-2xl">Daftar Pengajuan Izin Kerja</h1>
                    <p>Berikut Daftar Pengajuan Izin Pegawai :</p>
                </div>
                <Button
                    className="bg-chart-2 font-bold"
                    onClick={handleCetakPDF}
                    disabled={isPrinting || isLoading || !semuaIzin?.length}
                >
                    {isPrinting ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <Printer size={18} />
                    )}
                    <span className="ml-2">Cetak PDF</span>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-2 text-xs sm:text-sm sm:px-4">Id</TableHead>
                        <TableHead className="px-2 text-xs sm:text-sm sm:px-4">Id Pegawai</TableHead>
                        <TableHead className="px-2 text-xs sm:text-sm sm:px-4">Nama</TableHead>
                        <TableHead className="px-2 text-xs sm:text-sm sm:px-4">Jabatan</TableHead>
                        <TableHead className="px-2 text-xs sm:text-sm sm:px-4">Tanggal Izin</TableHead>
                        <TableHead className="px-2 text-xs sm:text-sm sm:px-4">Keterangan</TableHead>
                        <TableHead className="px-2 text-xs sm:text-sm sm:px-4">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={5}>Memuat data...</TableCell>
                        </TableRow>
                    )}

                    {isError && (
                        <TableRow>
                            <TableCell colSpan={5}>
                                Gagal memuat data: {error?.message}
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && !isError && semuaIzin?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5}>Belum ada pengajuan izin</TableCell>
                        </TableRow>
                    )}

                    {semuaIzin?.map((izin) => (
                        <TableRow key={izin.id}>
                            <TableCell className="break-words px-2 text-xs sm:text-sm sm:px-4">
                                {izin.kodeIzin}
                            </TableCell>
                            <TableCell className="break-words px-2 text-xs sm:text-sm sm:px-4">
                                {izin.user.kodeUser}
                            </TableCell>
                            <TableCell className="break-words px-2 text-xs sm:text-sm sm:px-4">
                                {izin.user.name}
                            </TableCell>
                            <TableCell className="break-words px-2 text-xs sm:text-sm sm:px-4">
                                {izin.user.jabatan}
                            </TableCell>
                            <TableCell className="break-words px-2 text-xs sm:text-sm sm:px-4">
                                <div className="flex flex-col">
                                    <span>{formatDate(new Date(izin.tanggalIzin))} -</span>
                                    <span>{formatDate(new Date(izin.selesaiIzin))}</span>
                                </div>
                            </TableCell>
                            <TableCell className="break-words px-2 text-xs sm:text-sm sm:px-4">
                                {izin.keterangan}
                            </TableCell>
                            <TableCell className="flex gap-2 items-center text-xs sm:text-sm sm:px-4">
                                {izin.status === "Diproses" ? (
                                    <>
                                        <Button
                                            className="font-bold bg-chart-3"
                                            disabled={isPending}
                                            onClick={() => handleUpdateStatus(izin.id, "Disetujui")}
                                        >
                                            Setujui
                                        </Button>
                                        <Button
                                            className="bg-chart-4"
                                            disabled={isPending}
                                            onClick={() => handleUpdateStatus(izin.id, "Ditolak")}
                                        >
                                            Tolak
                                        </Button>
                                    </>
                                ) : (
                                    <span className={`inline-block max-w-full break-words px-1 py-1 rounded-sm text-md font-medium ${getStatusStyle(izin.status)}`}>
                                        {izin.status}
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {
                alert && (
                    <div className="flex fixed top-2 left-1/2 -translate-x-1/2 z-[999]">
                        <Alert className={`bg-white shadow-xl ${isLeaving ? 'animate-slideUp' : 'animate-slideDown'}`}>
                            {alert.type === "success" ? (
                                <CircleCheck strokeWidth={3.5} className="text-green-600" />
                            ) : (
                                <XCircle strokeWidth={3.5} style={{ color: "#dc2626" }} />
                            )}
                            <AlertDescription className="font-bold text-base">
                                {alert.message}
                            </AlertDescription>
                        </Alert>
                    </div>
                )
            }
        </div>
    )
}