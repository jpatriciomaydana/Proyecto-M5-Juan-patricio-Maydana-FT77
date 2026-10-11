import { useState } from "react";
import type { JSX } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar(): JSX.Element {
    const [menuOpen, setMenuOpen] = useState(false);

    function closeMenu(): void {
        setMenuOpen(false);
    }

    return (
        <header className="site-header">
            <nav className="navbar" aria-label="Navegación principal">
                <Link
                    to="/"
                    className="navbar__brand"
                    aria-label="Ir al inicio"
                    onClick={closeMenu}
                >
                    <img
                        src="/logo.png"
                        alt="Logo de la librería"
                        className="navbar__logo"
                    />
                </Link>

                <button
                    type="button"
                    className="navbar__toggle"
                    aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={menuOpen}
                    aria-controls="navbar-menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div
                    id="navbar-menu"
                    className={`navbar__menu ${menuOpen ? "navbar__menu--open" : ""}`}
                >
                    <NavLink
                        to="/"
                        end
                        className="navbar__link"
                        onClick={closeMenu}
                    >
                        Inicio
                    </NavLink>

                    <NavLink
                        to="/catalogo"
                        className="navbar__link"
                        onClick={closeMenu}
                    >
                        Catálogo
                    </NavLink>

                    <NavLink
                        to="/carrito"
                        className="navbar__link"
                        onClick={closeMenu}
                    >
                        Carrito
                    </NavLink>

                    <NavLink
                        to="/mis-pedidos"
                        className="navbar__link"
                        onClick={closeMenu}
                    >
                        Mis pedidos
                    </NavLink>

                    <div className="navbar__account">
                        <NavLink
                            to="/login"
                            className="navbar__link"
                            onClick={closeMenu}
                        >
                            Ingresar
                        </NavLink>

                        <NavLink
                            to="/registro"
                            className="navbar__register"
                            onClick={closeMenu}
                        >
                            Registrarse
                        </NavLink>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
