import { Card } from "@/components/ui/card"

export default function Dashboard(){
    const date = new Date().toLocaleDateString("id-ID",{
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    })
    return(
         <div className="flex">
            <h1 className="text-2xl">
                Selamat Datang Kembali,Admin.
            </h1>
         </div>
           
    )
}