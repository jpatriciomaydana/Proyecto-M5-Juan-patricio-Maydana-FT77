import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export async function registerUser(
    email: string,
    password: string,
): Promise<void> {
    const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    );

    await setDoc(doc(db, "users", credential.user.uid), {
        email: credential.user.email,
        role: "customer",
        createdAt: serverTimestamp(),
    });
}

export async function loginUser(
    email: string,
    password: string,
): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser(): Promise<void> {
    await signOut(auth);
}