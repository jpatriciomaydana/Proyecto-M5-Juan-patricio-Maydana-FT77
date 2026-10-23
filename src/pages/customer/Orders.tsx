import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";
import { getUserOrders } from "../../services/orderService";
import type { Order } from "../../types/order";
import { STATUS_LABELS, formatDate, formatPrice } from "../../utils/orders";
import "./Orders.css";

// Guardamos junto a los pedidos el uid al que pertenecen. Así "cargando" se
// calcula comparando uids y no hace falta llamar a setState dentro del efecto.
interface OrdersState {
    uid: string;
    orders: Order[];
    failed: boolean;
}

function Orders() {
    const { user, loading: authLoading } = useAuthContext();
    const [state, setState] = useState<OrdersState | null>(null);

    const uid = user?.uid ?? null;

    useEffect(() => {
        if (!uid) {
            return undefined;
        }

        let cancelled = false;

        getUserOrders(uid)
            .then((orders) => {
                if (!cancelled) {
                    setState({ uid, orders, failed: false });
                }
            })
            .catch((error: unknown) => {
                console.error("No se pudieron cargar los pedidos:", error);
                if (!cancelled) {
                    setState({ uid, orders: [], failed: true });
                }
            });

        // Si el componente se desmonta antes de que responda Firestore,
        // se ignora el resultado.
        return () => {
            cancelled = true;
        };
    }, [uid]);

    const loading = authLoading || (uid !== null && state?.uid !== uid);

    if (loading) {
        return (
            <section className="orders">
                <h1 className="orders__title">Mis pedidos</h1>
                <p className="orders__message">Cargando tus pedidos…</p>
            </section>
        );
    }

    if (state?.failed) {
        return (
            <section className="orders">
                <h1 className="orders__title">Mis pedidos</h1>
                <p className="orders__message orders__message--error" role="alert">
                    No pudimos cargar tus pedidos. Intentá de nuevo en unos minutos.
                </p>
            </section>
        );
    }

    const orders = state?.orders ?? [];

    if (orders.length === 0) {
        return (
            <section className="orders">
                <h1 className="orders__title">Mis pedidos</h1>
                <div className="orders__empty">
                    <p>Todavía no hiciste ninguna compra.</p>
                    <Link to="/catalogo" className="orders__link">
                        Ver el catálogo
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="orders">
            <h1 className="orders__title">Mis pedidos</h1>

            <ul className="orders__list">
                {orders.map((order) => (
                    <li key={order.id} className="orders__card">
                        <div className="orders__header">
                            <div>
                                <p className="orders__date">
                                    {formatDate(order.createdAt)}
                                </p>
                                <p className="orders__id">Pedido {order.id}</p>
                            </div>
                            <span
                                className={`orders__status orders__status--${order.status}`}
                            >
                                {STATUS_LABELS[order.status] ?? order.status}
                            </span>
                        </div>

                        <ul className="orders__items">
                            {order.items.map((item) => (
                                <li key={item.productId} className="orders__item">
                                    <span className="orders__item-title">
                                        {item.title}
                                    </span>
                                    <span className="orders__item-detail">
                                        {item.quantity} × {formatPrice(item.price)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <p className="orders__total">
                            <span>Total</span>
                            <strong>{formatPrice(order.total)}</strong>
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Orders;