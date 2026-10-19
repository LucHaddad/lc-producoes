import { useEffect, useState } from "react";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [hideCta, setHideCta] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setIsScrolled(window.scrollY > 20);

            const formSection =
                document.getElementById("orcamento") ||
                document.getElementById("contato");
            if (formSection) {
                const rect = formSection.getBoundingClientRect();
                setHideCta(rect.top <= 120);
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`site-header ${isScrolled ? "is-scrolled" : ""} ${
                hideCta ? "hide-cta" : ""
            }`}
        >
            <a className="brand" href="#inicio" aria-label="LC Produções - início">
                <img src="/media/logo.png" alt="LC Produções" />

                <span className="brand-name">
                    <strong>Produções</strong>
                    <span>Som e Iluminação</span>
                </span>
            </a>

            <a
                className="btn btn-primary"
                href="#contato"
                aria-label="Entre em contato com a LC Produções"
                tabIndex={hideCta ? -1 : 0}
                aria-hidden={hideCta}
            >
                Solicitar orçamento
            </a>
        </header>
    );
}
