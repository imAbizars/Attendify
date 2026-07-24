import { useState } from "react"
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { getAllUser } from "@/hooks/user/index";
import {getDataAbsensi} from "@/hooks/absen/getDataAbsensi" 
import * as XLSX from "xlsx-js-style" 
import { 
    Popover,
    PopoverContent, 
    PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon,ChevronDownIcon, CheckIcon, XIcon,AlertTriangle, DownloadIcon} from "lucide-react"
export default function DataAbsensi(){
    const { absensiData, isLoading, selectedMonth, setSelectedMonth } = getDataAbsensi();
    const { data: users} = getAllUser({});
    const { month, year } = selectedMonth
    const [error, setError] = useState(null)
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

    const exportToExcel = () => {
        const totalCols = 1 + days.length + 4 // Nama + tanggal + 4 kolom total
        const hrdUser = users.find((u) =>
                u.jabatan?.toLowerCase().trim() === "hrd"
            );
        
        const namaHRD = hrdUser ? hrdUser.name : "( Nama Lengkap )";
        // ===== Format tanggal =====
        const now = new Date()
        const tanggalUnduh = now.toLocaleString("id-ID", {
            weekday: "long", day: "2-digit", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        }).replace(/\./g, ":")

        const tanggalTtd = now.toLocaleString("id-ID", {
            day: "2-digit", month: "long", year: "numeric",
        })
        const kota = "Jakarta"

        // ===== Bangun wsData sambil mencatat index tiap baris penting =====
        const wsData = []
        const rowIndex = {} // simpan posisi baris penting di sini

        const pushRow = (key, row) => {
            if (key) rowIndex[key] = wsData.length
            wsData.push(row)
        }

        pushRow("title", [`Rekap Absensi — ${monthLabel} ${year}`])
        pushRow("subtitle", [`Diunduh pada: ${tanggalUnduh}`])
        pushRow(null, [])
        pushRow("header", ["Nama", ...days, "Hadir", "Terlambat", "Izin", "Tidak Hadir"])

        rowIndex.dataStart = wsData.length
        absensiData.forEach((user) => {
            const row = [user.nama]
            let hadir = 0, terlambat = 0, izin = 0, tidakHadir = 0

            days.forEach((d) => {
                const status = user.riwayat[d - 1]?.status ?? "TIDAK_HADIR"
                const simbol =
                    status === "HADIR"     ? "✓" :
                    status === "TERLAMBAT" ? "T" :
                    status === "IZIN"      ? "I" : "X"
                row.push(simbol)
                if (status === "HADIR") hadir++
                else if (status === "TERLAMBAT") terlambat++
                else if (status === "IZIN") izin++
                else tidakHadir++
            })
            row.push(hadir, terlambat, izin, tidakHadir)
            pushRow(null, row)
        })
        rowIndex.dataEnd = wsData.length - 1

        pushRow(null, [])
        pushRow("legendTitle", ["Keterangan:"])
        const legendRows = [
            ["✓", "Hadir"], ["T", "Terlambat"], ["I", "Izin"], ["X", "Tidak Hadir"],
        ]
        rowIndex.legendStart = wsData.length
        legendRows.forEach((row) => pushRow(null, row))

        pushRow(null, [])
        pushRow(null, [])

        // ===== Blok tanda tangan =====
        const ttdMergeStartCol = Math.max(totalCols - 6, 0) // lebih lebar, 6 kolom biar aman
        const ttdMergeEndCol = totalCols - 1

        const ttdLine = new Array(totalCols).fill("")
        ttdLine[ttdMergeStartCol] = `${kota}, ${tanggalTtd}`
        pushRow("ttdLine", ttdLine)

        pushRow(null, [])
        pushRow(null, [])
        pushRow(null, [])

        const ttdName = new Array(totalCols).fill("")
        ttdName[ttdMergeStartCol] = "( ......................... )"
        pushRow("ttdName", ttdName)

        const ttdLabel = new Array(totalCols).fill("")
        ttdLabel[ttdMergeStartCol] = namaHRD
        pushRow("ttdLabel", ttdLabel)

        // ===== Buat worksheet =====
        const ws = XLSX.utils.aoa_to_sheet(wsData)

        ws["!cols"] = [
            { wch: 22 },
            ...days.map(() => ({ wch: 5 })),
            { wch: 8 }, { wch: 10 }, { wch: 8 }, { wch: 11 },
        ]

        // ===== Merge — sekarang pakai index yang PASTI benar =====
        ws["!merges"] = [
            { s: { r: rowIndex.title, c: 0 }, e: { r: rowIndex.title, c: totalCols - 1 } },
            { s: { r: rowIndex.subtitle, c: 0 }, e: { r: rowIndex.subtitle, c: totalCols - 1 } },
            { s: { r: rowIndex.ttdLine, c: ttdMergeStartCol }, e: { r: rowIndex.ttdLine, c: ttdMergeEndCol } },
            { s: { r: rowIndex.ttdName, c: ttdMergeStartCol }, e: { r: rowIndex.ttdName, c: ttdMergeEndCol } },
            { s: { r: rowIndex.ttdLabel, c: ttdMergeStartCol }, e: { r: rowIndex.ttdLabel, c: ttdMergeEndCol } },
        ]

        // ===== Styling =====
        const styleCell = (ref, style) => {
            if (!ws[ref]) ws[ref] = { t: "s", v: "" }
            ws[ref].s = style
        }

        const thinBorder = {
            top: { style: "thin", color: { rgb: "CBD5E1" } },
            bottom: { style: "thin", color: { rgb: "CBD5E1" } },
            left: { style: "thin", color: { rgb: "CBD5E1" } },
            right: { style: "thin", color: { rgb: "CBD5E1" } },
        }

        const symbolColor = { "✓": "16A34A", "T": "CA8A04", "I": "3B82F6", "X": "DC2626" }

        styleCell(XLSX.utils.encode_cell({ r: rowIndex.title, c: 0 }), { font: { bold: true, sz: 14 } })
        styleCell(XLSX.utils.encode_cell({ r: rowIndex.subtitle, c: 0 }), {
            font: { italic: true, sz: 10, color: { rgb: "6B7280" } },
        })

        for (let c = 0; c < totalCols; c++) {
            const ref = XLSX.utils.encode_cell({ r: rowIndex.header, c })
            const isTotalCol = c >= 1 + days.length
            styleCell(ref, {
                font: { bold: true },
                fill: { fgColor: { rgb: isTotalCol ? "DBEAFE" : "E5E7EB" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: thinBorder,
            })
        }

        for (let r = rowIndex.dataStart; r <= rowIndex.dataEnd; r++) {
            const rowArr = wsData[r]
            rowArr.forEach((val, c) => {
                const ref = XLSX.utils.encode_cell({ r, c })
                if (c === 0) {
                    styleCell(ref, { font: { bold: true }, alignment: { vertical: "center" }, border: thinBorder })
                } else if (c < 1 + days.length) {
                    styleCell(ref, {
                        font: { bold: true, color: { rgb: symbolColor[val] ?? "000000" } },
                        alignment: { horizontal: "center", vertical: "center" },
                        border: thinBorder,
                    })
                } else {
                    const totalKeys = ["✓", "T", "I", "X"]
                    const key = totalKeys[c - (1 + days.length)]
                    styleCell(ref, {
                        font: { bold: true, color: { rgb: symbolColor[key] } },
                        fill: { fgColor: { rgb: "F8FAFC" } },
                        alignment: { horizontal: "center", vertical: "center" },
                        border: thinBorder,
                    })
                }
            })
        }

        styleCell(XLSX.utils.encode_cell({ r: rowIndex.legendTitle, c: 0 }), { font: { bold: true } })
        legendRows.forEach((row, i) => {
            const r = rowIndex.legendStart + i
            styleCell(XLSX.utils.encode_cell({ r, c: 0 }), {
                font: { bold: true, color: { rgb: symbolColor[row[0]] } },
                alignment: { horizontal: "center" },
            })
        })

        styleCell(XLSX.utils.encode_cell({ r: rowIndex.ttdLine, c: ttdMergeStartCol }), {
            alignment: { horizontal: "center" },
        })
        styleCell(XLSX.utils.encode_cell({ r: rowIndex.ttdName, c: ttdMergeStartCol }), {
            alignment: { horizontal: "center" },
            font: { bold: true },
        })
        styleCell(XLSX.utils.encode_cell({ r: rowIndex.ttdLabel, c: ttdMergeStartCol }), {
            alignment: { horizontal: "center" },
            font: { bold: true },
            border: { top: { style: "thin", color: { rgb: "000000" } } },
        })

        ws["!freeze"] = { xSplit: 1, ySplit: rowIndex.header + 1 }

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, `Absensi ${monthLabel} ${year}`.slice(0, 31))

        const fileTimestamp = now
            .toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
            .replace(/\//g, "-")
        XLSX.writeFile(wb, `Rekap_Absensi_${monthLabel}_${year}_diunduh_${fileTimestamp}.xlsx`)
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