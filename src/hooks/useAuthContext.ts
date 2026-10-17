import { useContext } from "react";

import { AuthContext } from "../contexts/authContextObject";
import type { AuthContextType } from "../contexts/authContextObject";

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuthContext debe utilizarse dentro de AuthProvider",
        );
    }

    return context;
}