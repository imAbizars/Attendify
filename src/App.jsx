import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from "./pages/main/Home";
import RiwayatAbsen from "./pages/main/RiwayatAbsen";
import Profile from "./pages/main/Profile";
import Izin from "./pages/main/Izin";
import { QueryClientProvider,QueryClient} from "@tanstack/react-query";
import Dashboard from "./pages/dasboard/Dashboard";
import MainLayout from "./pages/main/MainLayout";
import DataUser from "./pages/dasboard/DataUser";
import DataAbsensi from "./pages/dasboard/DataAbsensi";
import DashboardLayout from "./pages/dasboard/DashboardLayout";
import Login from "./pages/main/Login";
import ProtectedRoute from "./lib/protected/ProtectedRoute"
import LupaPassword from "./pages/main/LupaPasssword";
import ResetPassword from "./pages/main/ResetPassword";
const queryClient = new QueryClient();

export default function App(){
  return(
    <QueryClientProvider client={queryClient}>       
      <Router>
        <Routes>
          <Route path="/"element={<Login/>} />
          <Route path="/lupapassword" element ={<LupaPassword/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }>
            <Route path="/home" element={<Home/>}/>
            <Route path="/riwayatabsen" element={<RiwayatAbsen/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/izin" element={<Izin/>}/>
          </Route>
          <Route path="/dashboard" element={
                      <ProtectedRoute allowedRole="ADMIN">
                          <DashboardLayout />
                      </ProtectedRoute>
                  }>
            <Route index element={<Dashboard/>} /> 
            <Route path="pegawai" element={<DataUser />} />
            <Route path="absensi" element={<DataAbsensi/>} />  
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>    
  )
}