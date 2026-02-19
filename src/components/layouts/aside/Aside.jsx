import React from "react";
import { NavLink } from "react-router-dom";

export default function Aside() {
  const menus = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/pegawai", label: "Data Pegawai" },
    { path: "/dashboard/riwayat", label: "Riwayat Absensi" },
    { path: "/dashboard/laporan", label: "Laporan" },
  ];

  return (
    <aside className="w-56 min-h-screen border-r-4  bg-main">
      <h2 className="border border-black font-bold text-xl py-6 px-4 border-b-3">Attendify</h2>

      <ul >
        {menus.map((menu) => (
          <li key={menu.path} className="border-b-3" >
            <NavLink
              to={menu.path}
              end={menu.path === "/dashboard"} 
              className={({ isActive }) =>
                `block p-6 transition text-lg ${
                  isActive
                    ? " bg-main-foreground font-semibold"
                    : "hover:bg-main-foreground "
                }`
              }
            >
              {menu.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
