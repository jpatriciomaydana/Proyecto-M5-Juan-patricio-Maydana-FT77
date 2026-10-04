import { createContext, useContext, useState } from "react";
import type { JSX, ReactNode } from "react";

interface AuthContextType {
    user: string | null;
    loading: boolean;
    login: () => void;
    register: () => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [user, setUser] = useState<string | null>(null);
    const [loading] = useState(false);

    function login(): void {
        setUser("usuario-demo");
    }

    function register(): void {
        setUser("usuario-demo");
    }

    function logout(): void {
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext debe utilizarse dentro de AuthProvider");
    }

    return context;
}