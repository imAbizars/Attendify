import React from "react";
import { NavLink } from "react-router-dom";
import {BarChart4,UserRoundPen,BookOpenCheck,LocationEdit, BedSingle} from "lucide-react"
export default function Aside() {
  const menus = [
    { path: "/dashboard", label: "Dashboard",icon:<BarChart4/> },
    { path: "/dashboard/pegawai", label: "Kelola Data Pegawai",icon:<UserRoundPen/>},
    { path: "/dashboard/absensi", label: "Kelola Rekap Data Absensi",icon:<BookOpenCheck/>},
    { path: "/dashboard/izin", label: "Kelola Data Izin",icon:<BedSingle/> },
    { path: "/dashboard/lokasi", label: "Kelola Data Lokasi",icon:<LocationEdit/> },
  ];

  return (
    <aside className="w-56 min-h-screen border-r-4  bg-main">
      <h2 className="border border-black font-bold text-xl py-6 px-4 border-b-3">Milttendify</h2>

      <ul >
        {menus.map((menu) => (
          <li key={menu.path} className="border-b-3" >
            <NavLink
              to={menu.path}
              end={menu.path === "/dashboard"} 
              className={({ isActive }) =>
                `block p-6 transition text-md ${
                  isActive
                    ? " bg-main-foreground font-semibold"
                    : "hover:bg-main-foreground "
                }`
              }
            >
              <span className="flex gap-2 items-center">
                {menu.icon}
                {menu.label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
