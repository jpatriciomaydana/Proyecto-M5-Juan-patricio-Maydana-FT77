import { useState } from "react";
import type { SubmitEvent } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLocation, useNavigate } from "react-router-dom";

// Adónde volver tras iniciar sesión. Solo se aceptan rutas internas
// ("/carrito"), nunca direcciones externas.
function getReturnTo(state: unknown): string {
    if (typeof state === "object" && state !== null && "returnTo" in state) {
        const { returnTo } = state as { returnTo: unknown };

        if (
            typeof returnTo === "string" &&
            returnTo.startsWith("/") &&
            !returnTo.startsWith("//")
        ) {
            return returnTo;
        }
    }

    return "/catalogo";
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate(getReturnTo(location.state));
        } catch {
            //console.error(error);
            setError("No se pudo iniciar sesión.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h1>Iniciar sesión</h1>
            <p>Accedé a tu cuenta.</p>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
            </form>
        </section>
    );
}

export default Login;