import { useState } from "react"
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import * as XLSX from "xlsx"


import { 
    Popover,
    PopoverContent, 
    PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon,ChevronDownIcon, CheckIcon, XIcon,AlertTriangle, DownloadIcon} from "lucide-react"
import {getDataAbsensi} from "@/hooks/absen/getDataAbsensi" 
export default function DataAbsensi(){
    const { absensiData, isLoading, selectedMonth, setSelectedMonth } = getDataAbsensi();
    const [error, setError] = useState(null)
     const [loading, setLoading] = useState(false)
    const { month, year } = selectedMonth
    const totalDays = new Date(year, month, 0).getDate()
    const days = Array.from({ length: totalDays }, (_, i) => i + 1)
    const monthLabel = new Date(year, month - 1).toLocaleString("id-ID", { month: "long" })
    if (isLoading) return <div>Loading...</div>

    // komponen status absen
    const StatusCell = ({ status }) => {
        if (status === "HADIR") {
            return (
                <div className="flex justify-center items-center">
                    <CheckIcon size={13} className="text-green-600" strokeWidth={5} />
                </div>
            )
        }
        if (status === "TERLAMBAT") {
            return (
                <div className="flex justify-center items-center">
                    <AlertTriangle size={13} className="text-yellow-400" strokeWidth={3} />
                </div>
            )
        }
        if (status === "IZIN") {
            return (
                <div className="flex justify-center items-center">
                    <span className="text-[10px] font-semibold text-blue-500 leading-none">I</span>
                </div>
            )
        }
        return (
            <div className="flex justify-center items-center">
                <XIcon size={13} className="text-red-600" strokeWidth={5} />
            </div>
        )
    }

    // icon info status absen
    const Legend = () => (
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
                <CheckIcon size={13} className="text-green-600" strokeWidth={5} /> Hadir
            </span>
            <span className="flex items-center gap-1">
                <AlertTriangle size={13} className="text-yellow-400" strokeWidth={3} />Terlambat
            </span>
            <span className="flex items-center gap-1">
                <span className="font-semibold text-blue-500">I</span> Izin
            </span>
            <span className="flex items-center gap-1">
                <XIcon size={13} className="text-red-600" strokeWidth={5} /> Tidak Hadir
            </span>
        </div>
    )

    // export excel
    const exportToExcel = () => {
    // Buat header row: ["Nama", 1, 2, 3, ..., 31]
        const headerRow = ["Nama", ...days]

        // Buat data rows
        const dataRows = absensiData.map((user) => {
            const row = [user.nama]
            days.forEach((d) => {
                const status = user.riwayat[d - 1]?.status ?? "TIDAK_HADIR"
                // Konversi status ke simbol yang mudah dibaca di Excel
                const simbol =
                    status === "HADIR"       ? "✓" :
                    status === "TERLAMBAT"   ? "T" :
                    status === "IZIN"        ? "I" : "X"
                row.push(simbol)
            })
            return row
        })

        // Gabungkan semua rows
        const wsData = [headerRow, ...dataRows]

        // Buat worksheet dan workbook
        const ws = XLSX.utils.aoa_to_sheet(wsData)

        // Set lebar kolom: kolom Nama lebih lebar, kolom tanggal kecil
        ws["!cols"] = [
            { wch: 20 },                              // kolom Nama
            ...days.map(() => ({ wch: 5 }))           // kolom tanggal
        ]

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, `Absensi ${monthLabel} ${year}`)

        // Download file
        XLSX.writeFile(wb, `Rekap_Absensi_${monthLabel}_${year}.xlsx`)
    }
    return (
        <div className="space-y-3 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-semibold text-base">
                    Rekap Absensi — {monthLabel} {year}
                </h2>
 
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="noShadow"
                            className="w-44 justify-start text-left font-base text-black"
                        >
                            <CalendarIcon className="mr-1 text-black" size={15} />
                            {monthLabel} {year}
                            <ChevronDownIcon className="ml-auto" size={15} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52 p-2">
                        {/* Year switcher */}
                        <div className="flex items-center justify-between mb-2 px-1">
                            <button
                                className="text-sm px-2 py-0.5 rounded hover:bg-muted"
                                onClick={() => setSelectedMonth(p => ({ ...p, year: p.year - 1 }))}
                            >‹</button>
                            <span className="text-sm font-medium">{year}</span>
                            <button
                                className="text-sm px-2 py-0.5 rounded hover:bg-muted"
                                onClick={() => setSelectedMonth(p => ({ ...p, year: p.year + 1 }))}
                            >›</button>
                        </div>
                        {/* Month grid */}
                        <div className="grid grid-cols-4 gap-1">
                            {Array.from({ length: 12 }, (_, i) => (
                                <Button
                                    key={i}
                                    size="sm"
                                    variant={month === i + 1 ? "default" : "ghost"}
                                    className={`text-xs p-1 h-8 ${month === i + 1 ? "bg-main text-white" : ""}`}
                                    onClick={() => setSelectedMonth(p => ({ ...p, month: i + 1 }))}
                                >
                                    {new Date(2026, i).toLocaleString("id-ID", { month: "short" })}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
 
            <Legend />
 
            {/* Error */}
            {error && (
                <div className="text-sm text-red-500 border border-red-200 bg-red-50 rounded px-3 py-2">
                    {error}
                </div>
            )}
 
            <div className="border border-2 flex overflow-hidden">
                {/* table kiri nama */}
                <Table
                wrapperClassName="relative w-auto overflow-visible shrink-0"
                className="text-sm text-center border-collapse shrink-0 w-[140px]">
                    <TableHeader>
                        <TableRow className="bg-muted/60 h-[92px]">
                            <TableHead className="border border-border px-3 text-center font-semibold">
                                Nama
                            </TableHead>
                        </TableRow>
                        
                    </TableHeader>
                    <TableBody>
                        {absensiData.map((user, idx) => (
                            <TableRow
                                key={user.userId}
                                className={`h-[30px] ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                                <TableCell className="border border-border py-[13px] px-3 font-medium text-sm whitespace-nowrap">
                                    {user.nama}
                                </TableCell>
                            </TableRow>
                            
                        ))}
                        <TableRow className="bg-muted/40 h-[10px]">
                            <TableCell className="border border-border px-3 font-medium text-sm whitespace-nowrap ">
                                <Button
                                    
                                    className="flex items-center gap-1"
                                    onClick={exportToExcel}
                                    disabled={absensiData.length === 0 || isLoading}
                                >
                                    <DownloadIcon size={15} />
                                    Unduh Excel
                                </Button>     
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* table kanan data*/}
                <div className=" border-b-2 overflow-x-auto flex-1 ">
                    <Table
                    wrapperClassName="overflow-x-auto flex-1"
                    className="text-sm border-collapse w-max [&>div]:overflow-visible [&>div]:w-max">
                        <TableHeader>
                            <TableRow className="bg-muted/60 h-[36px]">
                                <TableHead
                                    className="border border-border px-3 text-center font-semibold whitespace-nowrap"
                                    colSpan={totalDays}
                                >
                                    Tanggal ({monthLabel} {year})
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-muted/40 h-[28px]">
                                {days.map(d => (
                                    <TableHead
                                        key={d}
                                        className="border border-border w-8 min-w-[32px]  text-center text-xs font-medium text-muted-foreground"
                                    >
                                        {d}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {absensiData.map((user, idx) => (
                                <TableRow
                                    key={user.userId}
                                    className={`h-[30px] ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    {days.map(d => {
                                        const row = user.riwayat[d - 1]
                                        const status = row?.status ?? "TIDAK_HADIR"
                                        return (
                                            <TableCell
                                                key={d}
                                                className="border border-border w-6 text-center"
                                                title={status}
                                            >
                                                <StatusCell status={status} />
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                       
            </div>
        </div>
    )
}