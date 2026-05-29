import Navbar from "@/components/layouts/Navbar/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout(){
    return(
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}