import type { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuthContext } from "../contexts/AuthContext";

function AdminRoute(): JSX.Element {
    const { user, role, loading } = useAuthContext();

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;