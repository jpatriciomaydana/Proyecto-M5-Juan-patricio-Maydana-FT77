export type UserRole = "customer" | "admin";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    createdAt: Date;
}

