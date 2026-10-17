import { createContext } from "react";
import type { User } from "firebase/auth";

import type { UserProfile, UserRole } from "../types/user";

export interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    role: UserRole | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);