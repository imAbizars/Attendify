import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/" />;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        if (allowedRole && payload.role !== allowedRole) {
            return <Navigate to="/home" />;
        }

        return children ? children : <Outlet />;
        
    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/" />;
    }
}