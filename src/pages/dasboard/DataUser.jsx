import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllUser } from "@/hooks/user/index";
import ModalTambah from "@/components/ui/ModalTambah";
import { deleteUser } from "@/hooks/user/index";
import AlertCostum from "@/components/ui/AlertCostum";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleCheck, Trash2, PenBox, Search, Loader2, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoMil from '@/assets/images/Logo-MilBay-Green.png'

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

// Ambil dimensi asli gambar supaya rasio logo tidak gepeng
const getImageDimensions = (base64) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Gagal memuat dimensi gambar logo (format tidak valid)"));
        img.src = base64;
    });
}

export default function DataUser() {

    const { data: users, isLoading, isError } = getAllUser({});
    const [openModalTambah, setOpenModalTambah] = useState(false);

    //selected user
    const [selectedUser, setselectedUser] = useState(null);
    //search
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    //alert
    const [alert, setAlert] = useState(null);
    const [isLeaving, setIsLeaving] = useState(false);
    const showAlert = (message) => {
        setIsLeaving(false);
        setAlert({ message });

        setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => setAlert(null), 300);
        }, 2000);
    };
    //handle search
    const filteredUsersSearch = users?.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);
    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPages = 5;
    const totalPages = Math.ceil((filteredUsersSearch?.length || 0) / itemsPerPages);
    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) {
                pages.push("...");
            }
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) {
                pages.push("...");
            }
            pages.push(totalPages);
        }
        return pages;
    };
    //slice data halaman
    const paginatedHalaman = filteredUsersSearch?.slice(
        (currentPage - 1) * itemsPerPages,
        currentPage * itemsPerPages
    )
    const { mutate: deleteMutate, isPending: isDeleting } = deleteUser({
        onSuccess: () => showAlert('Data berhasil dihapus'),
    });
    //handle tambah
    const handleSuccessTambah = () => {
        showAlert('Data berhasil ditambahkan');
    };
    //handle delete
    const handleDelete = (id) => {
        deleteMutate(id);
    };
    //hande edit
    const handleSuccessEdit = () => {
        showAlert('Data Berhasil diupdate');
    }

    // ==================== CETAK PDF ====================
    const [isPrinting, setIsPrinting] = useState(false);
    // ---------- Cari user dengan role HRD ----------
    
    const handleCetakPDF = async () => {
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
            doc.text("DATA PEGAWAI", 14, headerBottom + 9);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(110, 110, 110);
            const tanggalCetak = new Date().toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric"
            });
            doc.text(`Dicetak pada: ${tanggalCetak}   |   Total Pegawai: ${users.length}`, 14, headerBottom + 15);

            // ---------- Tabel ----------
            autoTable(doc, {
                startY: headerBottom + 20,
                head: [["Id Pegawai", "Nama", "Email", "No. Telepon", "Alamat", "Role"]],
                body: users.map((u) => [
                    u.kodeUser,
                    u.name,
                    u.email,
                    u.phonenumber,
                    u.address,
                    u.jabatan,
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
                    0: { cellWidth: 25, halign: "center" },
                    1: { cellWidth: 40 },
                    2: { cellWidth: 55 },
                    3: { cellWidth: 35, halign: "center" },
                    4: { cellWidth: 84 },
                    5: { cellWidth: 30, halign: "center" },
                },
                tableWidth: "wrap",
                margin: { left: 14, right: 14, bottom: 20 },
                // ---------- Footer nomor halaman (kiri, tiap halaman) ----------
                didDrawPage: () => {
                    const pageCount = doc.internal.getNumberOfPages();
                    const currentPageNum = doc.internal.getCurrentPageInfo().pageNumber;
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.setTextColor(140, 140, 140);
                    doc.text(
                        `Halaman ${currentPageNum} dari ${pageCount}`,
                        14,
                        pageHeight - 10
                    );
                },
            });

            // ---------- Blok tanda tangan HRD (kanan, setelah tabel selesai) ----------
            const jakartaDate = new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            let signY = doc.lastAutoTable.finalY + 20;

            // Kalau ruang di bawah tabel tidak cukup, buat halaman baru untuk TTD
            const signBlockHeight = 45; // perkiraan tinggi blok TTD
            if (signY + signBlockHeight > pageHeight - 15) {
                doc.addPage();
                signY = 25;

                // nomor halaman untuk halaman TTD tambahan
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(140, 140, 140);
                doc.text(`Halaman ${pageCount} dari ${pageCount}`, 14, pageHeight - 10);
            }

            const signX = pageWidth - 14; // sejajar margin kanan
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(40, 40, 40);

            // Kota, hari, tanggal
            doc.text(`Jakarta, ${jakartaDate}`, signX, signY, { align: "right" });

            // Jabatan
            doc.text("Mengetahui,", signX, signY + 7, { align: "right" });
            doc.setFont("helvetica", "bold");
            doc.text("HRD Mil & Bay", signX, signY + 14, { align: "right" });

            // Ruang kosong untuk tanda tangan fisik
            // (garis tanda tangan setelah jarak ±25mm dari label jabatan)
            const signLineY = signY + 35;
            doc.setDrawColor(80, 80, 80);
            doc.setLineWidth(0.3);
            doc.line(signX - 55, signLineY, signX, signLineY);

            // Nama di bawah garis
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(90, 90, 90);
            doc.text(
                hrdUser ? `( ${namaHRD} )` : "( Nama HRD belum diatur )",
                signX,
                signLineY + 5,
                { align: "right" }
            );

            doc.save(`Data-Pegawai-MilBay-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error(err);
            showAlert("Gagal membuat PDF");
        } finally {
            setIsPrinting(false);
        }
    };
    // =====================================================

    //render data
    const renderUserData = () => {
        return paginatedHalaman?.map((user) => (
            <TableRow key={user.id}>
                <TableCell>{user.kodeUser}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phonenumber}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.jabatan}</TableCell>
                <TableCell className="flex justify-center space-x-4">
                    <Button
                        className="bg-chart-2"
                        onClick={() => {
                            setselectedUser(user);
                            setOpenModalTambah(true);
                        }}
                    ><PenBox /></Button>
                    <AlertCostum onConfirm={() => handleDelete(user.id)}>
                        <Button
                            className="bg-chart-4"
                            disabled={isDeleting}
                        >
                            <Trash2 />
                        </Button>
                    </AlertCostum>

                </TableCell>
            </TableRow>
        ));
    };
    return (
        <>
            <div className="flex justify-between mb-6 items-center">
                <div className="flex items-center space-x-3">
                    <Button
                        className="bg-main-foreground font-bold"
                        onClick={() => setOpenModalTambah(true)}
                    >Tambah User</Button>

                    <Button
                        className="bg-chart-2 font-bold"
                        onClick={handleCetakPDF}
                        disabled={isPrinting || isLoading || !users?.length}
                    >
                        {isPrinting ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Printer size={18} />
                        )}
                        <span className="ml-2">Cetak PDF</span>
                    </Button>
                </div>
                <div className="flex items-center space-x-4">
                    <Button
                        className="bg-main-foreground"
                        onClick={() => setSearchQuery(search)}
                    ><Search strokeWidth={3} /></Button>
                    <Input
                        className="w-60 h-11"
                        placeholder="Search by nama"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id Pegawai</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>No telepon</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="flex items-center justify-center gap-2 py-4">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Memuat data...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : filteredUsersSearch?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="flex items-center justify-center gap-2">
                                    <Search size={20} />
                                    <span>Data Tidak Ditemukan</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        // Render data
                        renderUserData()
                    )}
                </TableBody>

            </Table>
            <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-bold">
                    Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex items-center gap-2">
                    <Button
                        className="bg-main-foreground"
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                    >
                        Sebelumnya
                    </Button>

                    {getPageNumbers().map((page, index) => (
                        page === "..." ? (
                            <span key={index} className="px-2">...</span>
                        ) : (
                            <Button
                                key={index}
                                onClick={() => setCurrentPage(page)}
                                className={currentPage === page ? "bg-main-foreground" : "bg-main text-black"}
                            >
                                {page}
                            </Button>
                        )
                    ))}

                    <Button
                        className="bg-main-foreground"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Selanjutnya
                    </Button>
                </div>
            </div>
            {openModalTambah && (
                <ModalTambah
                    onClose={() => {
                        setOpenModalTambah(false);
                        setselectedUser(null);
                    }}
                    onSuccess={selectedUser ? handleSuccessEdit : handleSuccessTambah}
                    selectedUser={selectedUser}
                />
            )}
            {
                alert && (
                    <div className="flex fixed top-2 left-1/2 -translate-x-1/2 z-[999]">
                        <Alert className={`bg-white shadow-xl ${isLeaving ? 'animate-slideUp' : 'animate-slideDown'} `}>
                            <CircleCheck strokeWidth={3.5} />
                            <AlertDescription className="font-bold text-base">
                                {alert.message}
                            </AlertDescription>
                        </Alert>
                    </div>
                )
            }
        </>
    )
}