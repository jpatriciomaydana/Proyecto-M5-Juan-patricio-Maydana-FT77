import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import type { JSX, ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import { loginUser, logoutUser, registerUser } from "../services/authService";
import { auth } from "../services/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function login(email: string, password: string): Promise<void> {
        await loginUser(email, password);
    }

    async function register(
        email: string,
        password: string,
    ): Promise<void> {
        await registerUser(email, password);
    }

    async function logout(): Promise<void> {
        await logoutUser();
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
        throw new Error(
            "useAuthContext debe utilizarse dentro de AuthProvider",
        );
    }

    return context;
}