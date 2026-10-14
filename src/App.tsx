import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/protectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Home from "./pages/customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Catalog from "./pages/customer/Catalog";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Orders from "./pages/customer/Orders";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/catalogo/:id" element={<ProductDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/carrito" element={<Cart />} />
          <Route path="/mis-pedidos" element={<Orders />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;