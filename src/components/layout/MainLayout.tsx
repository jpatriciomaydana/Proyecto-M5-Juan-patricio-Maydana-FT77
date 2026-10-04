import type { JSX, ReactNode } from "react";
import Navbar from "./Navbar";

interface MainLayoutProps {
    children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps): JSX.Element {
    return (
        <>
            <Navbar />

            <main>{children}</main>
        </>
    );
}

export default MainLayout;