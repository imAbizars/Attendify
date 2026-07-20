import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Circle,Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
export default function DataLokasi() {
    // Dummy data — nanti ganti dengan data dari hook/query
    const lokasi = {
        namaLokasi: "Mil & Bay",
        latitude: -6.4535,
        longitude: 102.412,
        radiusAbsen: 100,
    };
    const KOORDINAT_KANTOR = { lat: -6.295991, lng: 106.902458 };
    const InfoItem = ({ label, value }) => (
        <div className="grid grid-cols-[140px_16px_1fr] items-center py-6">
            <span className="text-base">{label}</span>
            <span className="text-base">:</span>
            <span className="text-base font-medium">{value}</span>
        </div>
    );

    return (
        <div className="flex gap-4 w-full">
            <div className="p-6 w-full max-w-xl">
                <h2 className="text-xl font-semibold mb-4">Lokasi Pusat Absen</h2>

                <div className="divide-y">
                    <InfoItem label="Nama Lokasi" value={lokasi.namaLokasi} />
                    <InfoItem label="Latitude" value={lokasi.latitude} />
                    <InfoItem label="Longitude" value={lokasi.longitude} />
                    <InfoItem label="Radius Absen" value={`${lokasi.radiusAbsen} meter`} />
                </div>

                <Button className="w-full mt-4" size="lg">
                    Edit Lokasi
                </Button>
            </div>
            <Card className="p-4 w-full flex items-center justify-center">
                <MapContainer
                    center={[KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng]}
                    zoom={17}
                    style={{ height: "400px", width: "100%", zIndex: 1 }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={[KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng]}
                        icon={L.divIcon({
                            className: "",
                            html: `<div style="
                                background: #3dd9e4;
                                width: 14px;
                                height: 14px;
                                border-radius: 50%;
                                border: 2px solid white;
                                box-shadow: 0 0 4px rgba(0,0,0,0.5)
                            "></div>`,
                            iconAnchor: [7, 7],
                        })}
                    />
                    <Circle
                        center={[KOORDINAT_KANTOR.lat, KOORDINAT_KANTOR.lng]}
                        radius={lokasi.radiusAbsen}
                        pathOptions={{
                            color: "#3b82f6",
                            fillColor: "#3b82f6",
                            fillOpacity: 0.15,
                        }}
                    />
                </MapContainer>
            </Card>
        </div>
    );
}