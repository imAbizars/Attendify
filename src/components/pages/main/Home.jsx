import { useEffect, useState } from "react";
import {useAbsen} from "@/hooks/absen/useAbsen";
import {absenMasuk} from "@/hooks/absen/absen";
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
import { AlertCircleIcon,Loader2,CircleCheckIcon} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

export default function Home() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [addres,setAddres]  = useState("");

  // ambil nama usen
  const user = JSON.parse(localStorage.getItem("user"));
  const nama = user?.nama || "user"
  //absen
  const { statusAbsen, loading, message, handleAbsenMasuk, handleAbsenKeluar,clearMessage } = useAbsen();
  //ini function ambil alamat
  async function getAddres(lat,lng){
    try{
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      return data.display_name;
    }catch (error){
      console.error("gagal ambil alamat",error);
      return null;
    }
  }
  useEffect(() => {
  if (!navigator.geolocation) {
    setError("Browser tidak mendukung GPS");
    return;
  }
  //watch position by geolocation
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const loc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setLocation(loc);
      setError("");
    },
    (err) => {
      setLocation(null);
      setError("GPS kamu sedang mati 😭");
      console.log(err.code, err.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
  return () => navigator.geolocation.clearWatch(watchId);
}, []);

useEffect(() => {
  if (location) {
    getAddres(location.lat, location.lng)
      .then((addr) => setAddres(addr))
      .catch(() => setAddres("Alamat tidak tersedia"));
  }
}, [location]);

useEffect(() => {
if (message) {
  const timer = setTimeout(() => {
    clearMessage(); 
  }, 2000);
  return () => clearTimeout(timer);
}
}, [message]);


  return (
    <section className="p-4 pt-10 border border-black min-h-screen w-full">
      <h1 className="text-3xl mb-4">Selamat Malam {nama}</h1>
      
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
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={20}
          style={{ height: "300px", width: "100%",zIndex:"1" }}
          
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
        <div>
          lokasi kamu berada di koordinat {location.lat}, {location.lng}
        </div> 
        </>
        
      )}
      {message && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Alert className="w-60 h-80 flex items-center justify-center bg-white">
            <AlertDescription className="flex flex-col items-center justify-center text-xl">
              {message}
              <Lottie
                animationData={SuccesAnimation}
                loop={false}
                style={{width:200,height:200}}
              />
            </AlertDescription>
          </Alert>  
        </div>
      )}
      <div className="mt-2 p-2 mt-4 text-center space-y-4 ">
        <h4>Absen berikutnya dimulai pukul 08:00</h4>
        <Button
          className="w-full text-white"
          size="lg"
          disabled={statusAbsen.sudahMasuk || loading || !location}
          onClick={() => handleAbsenMasuk(location.lat, location.lng)}
        >
          {loading ? <Loader2 className="animate-spin" /> : statusAbsen.sudahMasuk ? "Sudah Absen Masuk ✓" : "ABSEN MASUK"}
        </Button>
        <Button
          className="w-full text-white"
          size="lg"
          disabled={!statusAbsen.sudahMasuk || statusAbsen.sudahKeluar || loading}
          onClick={handleAbsenKeluar}
        >
          {loading ? <Loader2 className="animate-spin" /> : statusAbsen.sudahKeluar ? "Sudah Absen Keluar ✓" : "ABSEN KELUAR"}
        </Button>
      </div>
    </section>
  );
}
