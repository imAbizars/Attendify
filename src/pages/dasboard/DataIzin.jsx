import { useAllIzin } from "@/hooks/izin/getIzinUser"
import { useUpdateIzin } from "@/hooks/izin/useUpdateIzin"
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Alert,AlertDescription} from "@/components/ui/alert";
import { useState } from "react";
import { CircleCheck,XCircle } from "lucide-react";

export default function DataIzin(){
    const { data: semuaIzin, isError, isLoading, error } = useAllIzin();
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
    return(
        <div className="flex flex-col gap-4 h-full w-full">
            <h1 className="text-2xl">Daftar Pengajuan Izin Kerja</h1>
            <p>Berikut Daftar Pengajuan Izin Pegawai :</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-2 text-xs sm:text-sm sm:px-4">Id</TableHead>
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
                                {izin.id}
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
                            <AlertDescription className="font-in
                            bold text-base">
                                {alert.message}
                            </AlertDescription>
                        </Alert>
                    </div>
                )
            }
        </div>
    )
}