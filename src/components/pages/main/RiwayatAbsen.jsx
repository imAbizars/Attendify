import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, ChevronDownIcon, Loader2,XCircle,AlertTriangle} from "lucide-react";
import { useRiwayatAbsen } from "@/hooks/absen/getRiwayatAbsen";
import { formatJam } from "@/lib/utilites/useFormatJam";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Pagination from "./components/Pagination";
export default function RiwayatAbsen() {
    const user = JSON.parse(localStorage.getItem("user"));
    const nama = user?.nama || "user";
    const { riwayat, loading, selectedMonth, setSelectedMonth } = useRiwayatAbsen();
    const [currentPage,setCurrentPage] = useState(1);
    const itemPerPage = 8;
    const totalPage = Math.ceil(riwayat.length / itemPerPage);
    const dataPerPage = riwayat.slice(
        (currentPage - 1) * itemPerPage,
        currentPage * itemPerPage
    );
    const handleGantibulan = (month) => {
        setSelectedMonth({ month, year: selectedMonth.year });
        setCurrentPage(1);
    };
    const totalHadir = riwayat.filter(item => item.status === "HADIR").length;
    const totalTerlambat = riwayat.filter(item => item.status === "TERLAMBAT").length;
    const totalTidakHadir = riwayat.filter(item => item.status === "TIDAK_HADIR").length;
    return (
        <div className="flex flex-col gap-6 p-4 pt-8 pb-8 min-h-screen w-full">
            <div>
                <h1 className="text-3xl">Hi {nama}!</h1>
                <h2 className="text-2xl">Berikut Riwayat Absen Kamu</h2>
            </div>

            <div className="flex h-27 gap-2">
                <Card className="bg-main p-4 w-1/3 text-white font-bold ">
                        <p className="text-xs font-medium">Total Hadir</p>
                    <p className="text-3xl">{totalHadir}</p>
                </Card>
                <Card className="bg-main p-4 w-1/3 text-white font-bold">
                        <p className="text-xs font-medium">Terlambat</p>
                    <p className="text-3xl">{totalTerlambat}</p>
                </Card>
                <Card className="bg-main p-4 w-1/3 text-white font-bold">
                    <div>
                        <p className="text-xs font-medium">Tidak Hadir</p>
                    </div>
                    <p className="text-3xl">{totalTidakHadir}</p>
                </Card>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="w-1/2 text-black" variant="noShadow">
                        <CalendarIcon className="mr-2"/>
                        {new Date(selectedMonth.year, selectedMonth.month - 1)
                            .toLocaleString("id-ID", { month: "long" })} {selectedMonth.year}
                        <ChevronDownIcon className="ml-2"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                    <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 12 }, (_, i) => (
                            <Button
                                key={i}
                                onClick={() => handleGantibulan(i + 1)}
                                className={`text-xs p-2 w-full ${
                                    selectedMonth.month === i + 1 ? "bg-main text-white" : ""
                                }`}
                            >
                                {new Date(2026, i).toLocaleString("id-ID", { month: "short" })}
                            </Button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Tabel Riwayat */}
            <div className="rounded-md border">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-2/5">Hari & Tanggal</TableHead>
                            <TableHead className="w-1/5">Jam Masuk</TableHead>
                            <TableHead className="w-1/5">Jam Keluar</TableHead>
                            <TableHead className="w-1/5">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-40">
                                    <div className="flex justify-center gap-2">
                                        Memuat Data <Loader2 className="animate-spin"/>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            dataPerPage.map((item, index) => ( 
                                <TableRow key={index} >
                                    <TableCell>{item.tanggal}</TableCell>
                                    <TableCell className="text-center">{item.jamMasuk ? formatJam(item.jamMasuk) : "-"}</TableCell>
                                    <TableCell className="text-center">{item.jamKeluar ? formatJam(item.jamKeluar) : "-"}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.status === "HADIR" ? "bg-green-100 text-green-600" :
                                            item.status === "TERLAMBAT" ? "text-yellow-600" :
                                            "text-red-600"
                                        }`}>
                                            {item.status === "TIDAK_HADIR" ? <XCircle/> :
                                             item.status === "TERLAMBAT" ? <AlertTriangle/>: "✓"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}