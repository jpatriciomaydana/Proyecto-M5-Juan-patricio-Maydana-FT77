import type { JSX, ReactNode } from "react";
import { Link } from "react-router-dom";

interface MainLayoutProps {
    children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps): JSX.Element {
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

            <main>{children}</main>
        </>
    );
}

export default MainLayout;