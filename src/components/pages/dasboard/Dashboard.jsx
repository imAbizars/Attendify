import {getAllAbsenToday} from "@/hooks/absen/getAllAbsenToday";
import {useStatistikAbsen} from "@/hooks/absen/getStatistikAbsen";
import {getJumlahUser} from "@/hooks/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, } from "@/components/ui/card"
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
 } from "@/components/ui/table"
import{
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { Bar,BarChart,CartesianGrid, XAxis } from "recharts"
import { formatJam } from "@/lib/hooks/useFormatJam";

export const description = "A stacked area chart"

export default function Dashboard(){
    
    const {dataAbsen,loading}= getAllAbsenToday();
    
    const { chartData,refetch,isFetching } = useStatistikAbsen();

    const {data : jumlahUser} = getJumlahUser();
    
    const chartConfig = {
    hadir: { 
        label: "Hadir", 
        color: "var(--chart-1)" 
    },
    tidak_hadir: { 
        label: "Tidak Hadir", 
        color: "var(--chart-2)" 
    },
    
    } 
    return(
         <div className="relative">
            <h1 className="text-2xl w-full h-20">
                Selamat Datang Kembali,Admin.
            </h1>
            <div className="flex gap-6 ">
                <div className="w-1/2 min-w-0">
                    <div className="h-full rounded-md border-2 bg-main ">
                        <div className=" h-full overflow-y-auto shadow-shadow rounded-base ">
                            <Table className="table-fixed w-full !border-none">
                                <TableHeader className="sticky top-0 bg-white z-10 ">
                                    <TableRow className="border-b">
                                        <TableHead className="w-1/4">Nama</TableHead>
                                        <TableHead className="w-1/4">Jam Masuk</TableHead>
                                        <TableHead className="w-1/4">Jam Keluar</TableHead>
                                        <TableHead className="w-1/4">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-80">
                                                <div className="flex justify-center gap-2">
                                                    Memuat Data
                                                    <Loader2 className="animate-spin"/>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : dataAbsen.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="pt-20 text-center h-80  text-muted-foreground">
                                                Belum ada yang absen hari ini
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        dataAbsen.map((absen) => (
                                            <TableRow key={absen.id} className="!border-b-2 ">
                                                <TableCell className="w-1/4 font-medium">{absen.user.name}</TableCell>
                                                <TableCell className="w-1/4">{absen.jamMasuk ? formatJam(absen.jamMasuk) : "-"}</TableCell>
                                                <TableCell className="w-1/4">{absen.jamKeluar ? formatJam(absen.jamKeluar) : "-"}</TableCell>
                                                <TableCell className="w-1/4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        absen.statusAbsen === "TERLAMBAT"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}>
                                                        {absen.statusAbsen}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 min-w-0 h-full">
                    <Card className="w-full bg-secondary-background text-foreground">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Statistik Absen</CardTitle>
                                    <CardDescription>Menampilkan Total Absen 4 bulan terakhir</CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                >
                                    {isFetching 
                                        ? <Loader2 className="animate-spin w-4 h-4"/> 
                                        : <RefreshCw className="w-4 h-4"/>
                                    }
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="w-full h-64">
                                <BarChart 
                                data={chartData} 
                                margin={{ left: 12, right: 12 }}
                                barCategoryGap="40%"  
                                barGap={2} 
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="hadir" fill="var(--color-hadir)" radius={4} />
                                    <Bar dataKey="tidak_hadir" fill="var(--color-tidak_hadir)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter>
                            <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 leading-none font-medium">
                                        Total Pegawai = {jumlahUser}
                                        <div className="flex items-center gap-2 leading-none">
                                    </div>
                            </div>
                            </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
           
    )
}