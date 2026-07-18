import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ChevronDownIcon} from "lucide-react";
import DatePicker from "@/components/ui/date-picker";
import {buatIzin} from "@/hooks/izin/useIzin";
import {useIzinSaya} from "@/hooks/izin/getIzinUser";
import { useQueryClient } from "@tanstack/react-query";

export default function Izin() {
    const [dariTanggal, setDariTanggal] = useState(null);
    const [sampaiTanggal, setSampaiTanggal] = useState(null);
    const [keterangan, setKeterangan] = useState("");
    const [openDari, setOpenDari] = useState(false);
    const [openSampai, setOpenSampai] = useState(false);
    const [loading, setLoading] = useState(false);

    // destructure error juga, karena dipakai di JSX bawah
    const { data: izinSaya, isError, isLoading, error } = useIzinSaya();
    const queryClient = useQueryClient();

    const formatDate = (date) => {
        if (!date) return "Pilih Tanggal";
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!dariTanggal || !sampaiTanggal || !keterangan) {
            alert("Semua field harus diisi!");
            return;
        }

        if (sampaiTanggal < dariTanggal) {
            alert("Tanggal selesai tidak boleh sebelum tanggal mulai!");
            return;
        }

        try {
            setLoading(true);
            await buatIzin({
                tanggalIzin: dariTanggal.toISOString(),
                selesaiIzin: sampaiTanggal.toISOString(),
                keterangan,
            });

            alert("Izin berhasil diajukan!");

            // refresh tabel otomatis setelah submit sukses
            queryClient.invalidateQueries({ queryKey: ["fetch.izin"] });

            // Reset form
            setDariTanggal(null);
            setSampaiTanggal(null);
            setKeterangan("");
        } catch (error) {
            alert("Gagal mengajukan izin: " + error.message);
        } finally {
            setLoading(false);
        }
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
    return (
        <div className="flex flex-col gap-10 px-10 py-10">
            <Card className="flex flex-col w-full">
                <CardHeader>
                    <CardTitle className="text-center">Pengajuan Izin Kerja</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>

                        {/* Dari Tanggal */}
                        <p>Dari Tanggal :</p>
                        <Popover open={openDari} onOpenChange={setOpenDari}>
                            <PopoverTrigger asChild>
                                <Button className="w-3/4 text-black" variant="noShadow">
                                    <CalendarIcon className="mr-2" />
                                    {formatDate(dariTanggal)}
                                    <ChevronDownIcon className="ml-2" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <DatePicker
                                    value={dariTanggal}
                                    onChange={(date) => {
                                        setDariTanggal(date);
                                        setOpenDari(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Sampai Tanggal */}
                        <p>Sampai Tanggal :</p>
                        <Popover open={openSampai} onOpenChange={setOpenSampai}>
                            <PopoverTrigger asChild>
                                <Button className="w-3/4 text-black" variant="noShadow">
                                    <CalendarIcon className="mr-2" />
                                    {formatDate(sampaiTanggal)}
                                    <ChevronDownIcon className="ml-2" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                side="bottom"
                                avoidCollisions={false}
                            >
                                <DatePicker
                                    value={sampaiTanggal}
                                    onChange={(date) => {
                                        setSampaiTanggal(date);
                                        setOpenSampai(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>

                        <Textarea
                            placeholder="keterangan izin"
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Mengajukan..." : "Ajukan Izin"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <div className="flex flex-col shadow-shadow gap-5 w-full border-3 border-black p-3 rounded-xl">
                <h2 className="text-center">Status Pengajuan Izin Kerja</h2>
                <Table className="table-fixed w-full rounded-xl">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[35%] px-2 text-xs sm:text-sm sm:px-4">Tanggal Izin</TableHead>
                            <TableHead className="w-[29%] px-2 text-xs sm:text-sm sm:px-4">Keterangan</TableHead>
                            <TableHead className="w-[36%] px-2 text-xs sm:text-sm sm:px-4">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={3}>Memuat data...</TableCell>
                            </TableRow>
                        )}

                        {isError && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    Gagal memuat data: {error?.message}
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && !isError && izinSaya?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3}>Belum ada pengajuan izin</TableCell>
                            </TableRow>
                        )}

                        {izinSaya?.map((izin) => (
                            <TableRow key={izin.id}>
                                <TableCell className="break-words px-2 text-xs sm:text-sm sm:px-4">
                                    <div className="flex flex-col">
                                        <span>{formatDate(new Date(izin.tanggalIzin))} -</span>
                                        <span>{formatDate(new Date(izin.selesaiIzin))}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="break-words px-2 text-xs sm:text-sm sm:px-4">
                                    {izin.keterangan}
                                </TableCell>
                                <TableCell className="break-words px-2 text-xs sm:text-sm sm:px-4">
                                    <Badge className={`inline-block max-w-full break-words px-2 py-2 rounded-full text-xs font-medium ${getStatusStyle(izin.status)}`}>
                                        {izin.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}