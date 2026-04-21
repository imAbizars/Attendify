import { useEffect, useState } from "react";
import {useAbsen} from "@/hooks/absen/useAbsen";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import umamusume from "@/assets/images/umamusume.gif";
import { Button } from "../../ui/button"; 
import { Alert,AlertDescription,AlertTitle} from "@/components/ui/alert";
import Lottie from "lottie-react";
import SuccesAnimation from "@/assets/animation/Successfull Animation.json";
import FailedAnimation from "@/assets/animation/cross.json";
import { AlertCircleIcon,Loader2} from "lucide-react";
import {useGeolocation} from "@/lib/utilites/UseGeolocation";
import { Card } from "@/components/ui/card";
import { useWaktu } from "@/lib/utilites/useWaktu";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

export default function Home() {
  const {location,error,jarakKeKantor,dalamJangkauan} = useGeolocation();
  // ambil nama usen
  const user = JSON.parse(localStorage.getItem("user"));
  const nama = user?.nama || "user"
  //absen
  const { statusAbsen, loading, message, handleAbsenMasuk, handleAbsenKeluar, clearMessage, isSuccess, terlambat, clearTerlambat,info} = useAbsen();
  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      clearMessage(); 
    }, 2000);
    return () => clearTimeout(timer);
  }
  }, [message]);
  useEffect(() => {
    if (terlambat) {
        const timer = setTimeout(() => {
            clearTerlambat();
        }, 5000); 
        return () => clearTimeout(timer);
    }
}, [terlambat]);
  const {waktu} = useWaktu();
  const getGreet = (jam) => {
      if (jam >= 5 && jam < 12) return "Pagi";
      if (jam >= 12 && jam < 15) return "Siang";
      if (jam >= 15 && jam < 19) return "Sore";
      return "Malam";
  }
  return (
    <div className="flex flex-col gap-4 p-4 pt-8  min-h-screen w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl">Selamat {getGreet(waktu.getHours())} {nama}</h1>
          <h1 className="text-5xl">{waktu.toLocaleTimeString('id-ID',{
            timeZone:"Asia/Jakarta",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          })}</h1>
        </div>
        
        {!location && !error && <p>Meminta izin lokasi...</p>}
        {error && 
        <div className="space-y-4 " >
          <img src={umamusume} alt="" />
          <Alert variant="none">
            <AlertCircleIcon/>
            <AlertTitle>Lokasi Kamu Gak Terdeteksi Nih</AlertTitle>
            <AlertDescription>
              Pastikan GPS Kamu Menyala Terlebih Dahulu 
            </AlertDescription>
          </Alert>
        </div>
        }

        {location && (
          <>
          <h1 className="text-xl">Lokasi Kamu Berada : </h1>
          <div className="">
            <Card>
              <div className="flex justify-center">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={30}
                style={{ height: "200px", width: "90%",zIndex:1 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]} />
                <Circle
                  center={[location.lat, location.lng]}
                  radius={50}
                />
              </MapContainer>
              </div>  
            </Card>
          </div>
          <div className="mb-2 space-y-1 text-md">
            {jarakKeKantor !== null && (
                dalamJangkauan ? (
                    <div className="flex justify-center gap-2 p-2 border-2 border-black rounded-md mt-2">
                        <AlertCircleIcon/>
                        <p>
                            Lokasi kamu berada {jarakKeKantor} meter dari kantor <br />
                            (<span className="text-green-500 font-medium"> dalam jangkauan </span>)
                        </p>
                    </div>
                ) : (
                    <div className="flex justify-center gap-2 p-2 border-2 border-red-500 rounded-md mt-2">
                        <AlertCircleIcon className="text-red-500"/>
                        <p>
                            Lokasi kamu berada {jarakKeKantor} meter dari kantor&nbsp;
                            (<span className="text-red-500 font-medium">di luar jangkauan</span>)
                        </p>
                    </div>
                )
            )}
            {terlambat && (
                <p className="text-red-500 text-sm font-medium mt-2">
                    ⚠️ Kamu terlambat {terlambat}
                </p>
            )}
        </div>
        </>
        )}

        {message && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <Alert className="w-60 h-80 flex items-center justify-center bg-white">
              <AlertDescription className="flex flex-col items-center justify-center text-xl">
                {message}
                {isSuccess?(
                    <Lottie
                      animationData={SuccesAnimation}
                      loop={false}
                      style={{width:200,height:200}}
                    />
                  ):(
                    <Lottie
                    animationData={FailedAnimation}
                    loop={false}
                    style={{width:200,height:200}}
                    />
                  )
                }
              </AlertDescription>
            </Alert>  
          </div>
        )}
        <div className="text-center space-y-4 ">
          {info && (
            <h4>
              {info}
            </h4>
          )}
          <Button
            className="w-full text-white"
            size="lg"
            disabled={statusAbsen.sudahMasuk || loading || !location}
            onClick={() => handleAbsenMasuk(location.lat, location.lng)}
          >
            {loading ? <Loader2 className="animate-spin" /> : statusAbsen.sudahMasuk ? "Sudah Absen Masuk " : "ABSEN MASUK"}
          </Button>
          <Button
            className="w-full text-white"
            size="lg"
            disabled={!statusAbsen.sudahMasuk || statusAbsen.sudahKeluar || loading}
            onClick={handleAbsenKeluar}
          >
            {loading ? <Loader2 className="animate-spin" /> : statusAbsen.sudahKeluar ? "Sudah Absen Keluar " : "ABSEN KELUAR"}
          </Button>
        </div>
    </div>
  );
}
