import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from "./components/pages/main/Home";
import RiwayatAbsen from "./components/pages/main/RiwayatAbsen";
import Profile from "./components/pages/main/Profile";
import Izin from "./components/pages/main/Izin";
import { QueryClientProvider,QueryClient} from "@tanstack/react-query";
import Dashboard from "./components/pages/dasboard/Dashboard";
import MainLayout from "./components/pages/main/MainLayout";
import DataUser from "./components/pages/dasboard/DataUser";
import Riwayat from "./components/pages/dasboard/Riwayat";
import DashboardLayout from "./components/pages/dasboard/DashboardLayout";
import Login from "./components/pages/main/Login";
import ProtectedRoute from "./lib/protected/ProtectedRoute"
const queryClient = new QueryClient();

export default function App(){
  return(
    <QueryClientProvider client={queryClient}>       
      <Router>
        <Routes>
            <Route path="/login"element={<Login/>} />z
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
                        <ProtectedRoute allowedRole="admin">
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
              <Route index element={<Dashboard/>} /> 
              <Route path="pegawai" element={<DataUser />} />
              <Route path="riwayat" element={<Riwayat />} />  
            </Route>

        </Routes>
      </Router>
    </QueryClientProvider>    
    

  )
}