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
import { CalendarIcon, ChevronDownIcon} from "lucide-react";
import DatePicker from "@/components/ui/date-picker";
import {buatIzin} from "@/hooks/izin/useIzin";
export default function Izin() {
    const [dariTanggal, setDariTanggal] = useState(null);
    const [sampaiTanggal, setSampaiTanggal] = useState(null);
    const [keterangan, setKeterangan] = useState("");
    const [openDari, setOpenDari] = useState(false);
    const [openSampai, setOpenSampai] = useState(false);
    const [loading, setLoading] = useState(false);

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

        try {
            setLoading(true);
            await buatIzin({
                tanggalIzin: dariTanggal.toISOString(),
                selesaiIzin: sampaiTanggal.toISOString(),
                keterangan,
                
            });
            alert("Izin berhasil diajukan!");
            // Reset form
            setDariTanggal(null);
            setSampaiTanggal(null);
            setKeterangan("");
        } catch (error) {
            alert("Gagal mengajukan izin: " + error.message);
        } finally {
            setLoading(false);
        }
        console.log({
            tanggalIzin: dariTanggal.toISOString(),
            selesaiIzin: sampaiTanggal.toISOString(),
            keterangan,
        });
    };

    return (
        <div className="flex px-10 py-10 border border-black">
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
        </div>
    );
}