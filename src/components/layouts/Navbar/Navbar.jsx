import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    House,
    BookOpenText,
    CircleUser,
    BedSingle
} from "lucide-react";
import {NavLink} from "react-router-dom";
export default function Navbar(){
    const [isopen,setOpen] = useState(false);
    const tooglesidebar = () => setOpen(!isopen);
    return(
        <>
            <nav className="sticky top-0 z-50 flex items-center justify-between p-3 py-3 bg-main border-b-3">
                <div className="border border-4 p-2 pr-3 pb-3 rounded-xl">
                    <Button
                    onClick={tooglesidebar}
                    className="text-2xl text-black font-bold focus:outline-none px-2"
                    >
                    {isopen ? "✕" : "☰"}
                    </Button>
                </div>
            </nav>
            <div className={`fixed top-0 left-0 h-full w-50 pt-20 z-40 bg-main border-r-3 transform transition-transform duration-300 ease-in-out ${isopen?"translate-x-0":"-translate-x-full"}`}>
                <div className="pt-10">
                    <ul className="space-y-5 text-md">
                        <NavLink
                        to="/home" 
                        className={({isActive})=>
                           `flex items-center p-4 ${isActive?"border-b-3 border-t-3 bg-main-foreground":""}`
                        }
                        onClick={tooglesidebar}
                        ><House className="mr-2"/>Beranda</NavLink>
                        <NavLink
                        to="/riwayatabsen" 
                        className={({isActive})=>
                           `flex items-center p-4 ${isActive?"border-b-3 border-t-3 bg-main-foreground":""}`
                        }
                        onClick={tooglesidebar}
                        ><BookOpenText className="mr-2"/>Riwayat Absen</NavLink>
                        <NavLink
                        to="/profile" 
                        className={({isActive})=>
                           `flex items-center p-4 ${isActive?"border-b-3 border-t-3 bg-main-foreground":""}`
                        }
                        onClick={tooglesidebar}
                        ><CircleUser className="mr-2"/>Profile</NavLink>
                        <NavLink
                        to="/izin" 
                        className={({isActive})=>
                           `flex items-center p-4 ${isActive?"border-b-3 border-t-3 bg-main-foreground":""}`
                        }
                        onClick={tooglesidebar}
                        ><BedSingle className="mr-2"/>Izin</NavLink>
                    </ul>
                </div>
            </div>
        </>
    );
}