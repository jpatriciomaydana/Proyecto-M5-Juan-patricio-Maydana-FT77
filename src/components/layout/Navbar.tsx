import type { JSX } from "react";
import { Link } from "react-router-dom";

function Navbar(): JSX.Element {
    return (
        <nav>
            <Link to="/">Inicio</Link>
            <Link to="/login">Login</Link>
            <Link to="/registro">Registro</Link>
            <Link to="/catalogo">Catálogo</Link>
            <Link to="/carrito">Carrito</Link>
            <Link to="/mis-pedidos">Mis pedidos</Link>
        </nav>
    );
}

export default Navbar;