import React from "react";
import Aside from "@/components/layouts/aside/Aside";
import {useNavigate, Outlet, useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger, } from "@/components/ui/tooltip";


export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const getTitle = () => {
    if (location.pathname.includes("pegawai")) return "Kelola Data Pegawai";
    if (location.pathname.includes("absensi")) return "Kelola Rekap Data Absensi";
    if (location.pathname.includes("izin")) return "Kelola Data Izin";
    if (location.pathname.includes("lokasi")) return "Kelola Data lokasi";
    return "Dashboard";
  };
  
  const handleLogout = () =>{
    localStorage.clear();
    navigate("/");
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <Aside />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-20 border-b-4 flex justify-between items-center px-8 bg-main">
          <h1 className="text-xl font-bold">{getTitle()}</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <UserCircle size={35}/>
              </TooltipTrigger>
              <TooltipContent>
                <Button onClick={handleLogout}>
                  Logout
                </Button>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </header>
        <main className="flex-1 p-6 overflow-y-auto pb-8">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
