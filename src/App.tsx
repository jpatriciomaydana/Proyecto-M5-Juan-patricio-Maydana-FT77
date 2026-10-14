import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./routes/protectedRoute";

import Home from "./pages/customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Catalog from "./pages/customer/Catalog";
import Cart from "./pages/customer/Cart";
import Orders from "./pages/customer/Orders";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App(): JSX.Element {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/catalogo" element={<Catalog />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="/carrito" element={<Cart />} />
          <Route path="/mis-pedidos" element={<Orders />} />
        </Route>
      </Routes>
    </MainLayout>
  );
}

export default App;