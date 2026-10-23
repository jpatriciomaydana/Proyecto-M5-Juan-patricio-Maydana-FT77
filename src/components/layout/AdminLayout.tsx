import type { JSX } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout(): JSX.Element {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <p className="admin-sidebar__title">Administración</p>

                <nav
                    className="admin-sidebar__nav"
                    aria-label="Navegación de administración"
                >
                    <NavLink to="/admin" end className="admin-sidebar__link">
                        Panel
                    </NavLink>

                    <NavLink
                        to="/admin/productos"
                        className="admin-sidebar__link"
                    >
                        Productos
                    </NavLink>

                    <NavLink
                        to="/admin/pedidos"
                        className="admin-sidebar__link"
                    >
                        Pedidos
                    </NavLink>

                    <Link to="/" className="admin-sidebar__link">
                        Volver a la tienda
                    </Link>
                </nav>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;