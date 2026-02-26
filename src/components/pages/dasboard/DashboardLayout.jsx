import React from "react";
import Aside from "@/components/layouts/aside/Aside";
import { Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const location = useLocation();
  const getTitle = () => {
    if (location.pathname.includes("pegawai")) return "Data Pegawai";
    if (location.pathname.includes("riwayat")) return "Riwayat Absensi";
    if (location.pathname.includes("laporan")) return "Laporan";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Aside />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-20 border-b-4 flex items-center px-8 bg-main">
          <h1 className="text-xl font-bold">{getTitle()}</h1>
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
