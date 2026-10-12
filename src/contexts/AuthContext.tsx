import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import type { JSX, ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import {
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
} from "../services/authService";
import { auth } from "../services/firebase";
import type { UserProfile, UserRole } from "../types/user";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: UserRole | null;
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
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setProfile(null);
                setLoading(false);
                return;
            }

            try {
                const userProfile = await getUserProfile(currentUser.uid);
                setProfile(userProfile);
                //console.log("Perfil cargado:", userProfile);
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                setProfile(null);
            } finally {
                setLoading(false);
            }
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

        // El perfil recién se guardó: volvemos a leerlo porque
        // onAuthStateChanged pudo ejecutarse antes de que existiera.
        if (auth.currentUser) {
            setProfile(await getUserProfile(auth.currentUser.uid));
        }
    }

    async function logout(): Promise<void> {
        await logoutUser();
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                role: profile?.role ?? null,
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