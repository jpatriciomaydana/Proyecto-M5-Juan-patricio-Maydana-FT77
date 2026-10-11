import type { JSX } from "react";
import "./Footer.css";

function Footer(): JSX.Element {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__inner">
                <p className="footer__credits">
                    Desarrollado por{" "}
                    <strong>Juan Patricio Maydana</strong>
                    <span className="footer__separator" aria-hidden="true">
                        {" "}
                        ·{" "}
                    </span>
                    <span className="footer__brand">Patagonix Tech</span>
                </p>

                <p className="footer__copy">
                    © {currentYear} Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default Footer;