import type { JSX } from "react";

function AdminDashboard(): JSX.Element {
    return (
        <section className="px-4 py-8">
            <h1 className="font-serif text-2xl text-[#1F3528]">
                Panel de administración
            </h1>
            <p className="mt-2 text-[#706D63]">
                Desde acá vas a gestionar productos y pedidos.
            </p>
        </section>
    );
}

export default AdminDashboard;