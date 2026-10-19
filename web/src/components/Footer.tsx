
export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <a
                    className="footer-brand"
                    href="#inicio"
                    aria-label="LC Produções — voltar ao início"
                >
                    <img src="/media/logo.png" alt="" />
                    <span className="brand-name">
                        <strong>Produções</strong>
                        <span>Som e Iluminação</span>
                    </span>
                </a>

                <p>
                    Estrutura, tecnologia e experiência para
                    eventos que ficam na memória.
                </p>

                <a
                    className="footer-contact"
                    href="https://wa.me/5585994024800"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Fale com nossa equipe <span aria-hidden="true">↗</span>
                </a>
            </div>

            <div className="footer-bottom">
                <span>
                    © {new Date().getFullYear()} LC Produções. Todos os direitos reservados.
                </span>
                <a href="#inicio">Voltar ao início ↑</a>
            </div>
        </footer>
    );
}
