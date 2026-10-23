import { useEffect, useState } from "react";
import type { JSX } from "react";

import { getAllOrders } from "../../services/orderService";
import type { Order, OrderStatus } from "../../types/order";
import {
    ORDER_STATUSES,
    STATUS_LABELS,
    formatDate,
    formatPrice,
} from "../../utils/orders";
import "./AdminOrders.css";

type StatusFilter = "all" | OrderStatus;

function isStatusFilter(value: string): value is StatusFilter {
    return value === "all" || ORDER_STATUSES.some((status) => status === value);
}

// Los pedidos guardan el userId pero no el correo del cliente, así que
// mostramos un id corto y el completo queda en el tooltip.
function shortId(id: string): string {
    return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

function AdminOrders(): JSX.Element {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<StatusFilter>("all");

    useEffect(() => {
        let cancelled = false;

        getAllOrders()
            .then((data) => {
                if (!cancelled) {
                    setOrders(data);
                }
            })
            .catch((caught: unknown) => {
                console.error("No se pudieron cargar los pedidos:", caught);
                if (!cancelled) {
                    setError(
                        "No pudimos cargar los pedidos. Intentá de nuevo en unos minutos.",
                    );
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        // Si el admin sale de la página antes de que responda Firestore,
        // se ignora el resultado.
        return () => {
            cancelled = true;
        };
    }, []);

    // El filtro es del lado del cliente: se traen todos los pedidos una vez
    // y el selector solo cambia cuáles se muestran.
    const visibleOrders =
        filter === "all"
            ? orders
            : orders.filter((order) => order.status === filter);

    const hasOrders = !loading && !error && orders.length > 0;
    const noOrdersAtAll = !loading && !error && orders.length === 0;

    return (
        <section className="admin-orders">
            <h1 className="admin-orders__title">Pedidos</h1>

            {loading && (
                <p className="admin-orders__message" role="status">
                    Cargando pedidos...
                </p>
            )}

            {error && (
                <p
                    className="admin-orders__message admin-orders__message--error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {noOrdersAtAll && (
                <p className="admin-orders__message">
                    Todavía no hay pedidos registrados.
                </p>
            )}

            {hasOrders && (
                <>
                    <div className="admin-orders__filter">
                        <label
                            htmlFor="admin-orders-filter"
                            className="admin-orders__filter-label"
                        >
                            Filtrar por estado
                        </label>
                        <select
                            id="admin-orders-filter"
                            className="admin-orders__select"
                            value={filter}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (isStatusFilter(value)) {
                                    setFilter(value);
                                }
                            }}
                        >
                            <option value="all">Todos</option>
                            {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {STATUS_LABELS[status]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <p className="admin-orders__count" role="status">
                        {visibleOrders.length} de {orders.length}{" "}
                        {orders.length === 1 ? "pedido" : "pedidos"}
                    </p>

                    {visibleOrders.length === 0 ? (
                        <p className="admin-orders__message">
                            No hay pedidos con ese estado.
                        </p>
                    ) : (
                        <table
                            className="admin-orders__table"
                            aria-label="Listado de pedidos"
                        >
                            <thead>
                                <tr>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Productos</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td data-label="Fecha">
                                            <span className="admin-orders__date">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </td>
                                        <td data-label="Cliente">
                                            <span title={order.userId}>
                                                {shortId(order.userId)}
                                            </span>
                                        </td>
                                        <td className="admin-orders__cell-items">
                                            <ul className="admin-orders__items">
                                                {order.items.map((item) => (
                                                    <li key={item.productId}>
                                                        {item.quantity} × {item.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td data-label="Total">
                                            <strong>{formatPrice(order.total)}</strong>
                                        </td>
                                        <td data-label="Estado">
                                            <span
                                                className={`admin-orders__status admin-orders__status--${order.status}`}
                                            >
                                                {STATUS_LABELS[order.status] ??
                                                    order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </section>
    );
}

export default AdminOrders;