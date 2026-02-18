export default function Dashboard(){
    return(
         <div className="grid grid-cols-3 gap-4">
            <div className="border p-4 rounded">
                Total User: 120
            </div>
            <div className="border p-4 rounded">
                Absen Hari Ini: 87
            </div>
            <div className="border p-4 rounded">
                Izin: 12
            </div>
        </div>
    )
}