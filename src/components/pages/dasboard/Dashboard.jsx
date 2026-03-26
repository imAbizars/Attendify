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
    TableRow
 } from "@/components/ui/table"
import{
    
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { Bar,BarChart,CartesianGrid, XAxis } from "recharts"
export const description = "A stacked area chart"
export default function Dashboard(){
    const chartData = [
    { month: "January", hadir: 20, tidak_hadir: 5 },
    { month: "February", hadir: 25, tidak_hadir: 3 },
    { month: "Maret", hadir: 28, tidak_hadir: 2 },
    { month: "April", hadir: 22, tidak_hadir: 6 },
    { month: "Mei", hadir: 25, tidak_hadir: 3 },
    ]
    
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
            {/* <div className="flex pt-10 space-x-30">
                {cardData.map((item,index)=>(
                    <Card 
                    key={index}
                    className="w-40 bg-main text-center font-bold"
                    >
                        <p>{item.label}</p>
                    </Card>
                ))}
            </div> */}
            <div className="flex gap-6">
                <div className="w-1/2 min-w-0">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Jam Masuk</TableHead>
                                <TableHead>Jam Keluar</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>

                <div className="w-1/2 min-w-0">
                    <Card className="w-full bg-secondary-background text-foreground">
                        <CardHeader>
                            <CardTitle>Area Chart - Stacked</CardTitle>
                            <CardDescription>
                            Showing total visitors for the last 6 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="w-full h-64">
                                <BarChart
                                    data={chartData}
                                    margin={{ left: 12, right: 12 }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Bar dataKey="hadir" fill="var(--color-hadir)" radius={4} />
                                    <Bar dataKey="tidak_hadir" fill="var(--color-tidak_hadir)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter>
                            <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 leading-none font-medium">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="flex items-center gap-2 leading-none">
                                January - June 2024
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