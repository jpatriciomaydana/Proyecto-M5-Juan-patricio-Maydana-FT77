import type { JSX } from "react";
import { Link, Route, Routes } from "react-router-dom";

import Home from "./pages/customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Catalog from "./pages/customer/Catalog";
import Cart from "./pages/customer/Cart";
import Orders from "./pages/customer/Orders";

function App(): JSX.Element {
  return (
    <>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/login">Login</Link>
        <Link to="/registro">Registro</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/carrito">Carrito</Link>
        <Link to="/mis-pedidos">Mis pedidos</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/mis-pedidos" element={<Orders />} />
      </Routes>
    </>
  );
}

export default App;