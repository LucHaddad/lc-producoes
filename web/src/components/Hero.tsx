
export default function Hero() {
    return (
        <main className="hero" id="inicio">
            <div className="hero-content">
                <p className="hero-eyebrow">
                    LC Produções · Som e Iluminação
                </p>

                <h1>
                    O que o público vê começa nos{" "}
                    <span>bastidores.</span>
                </h1>

                <p className="hero-description">
                    Som, iluminação e estrutura para transformar
                    eventos em experiências inesquecíveis.
                    Cuidamos dos detalhes para que cada momento
                    brilhe como merece.
                </p>

                <div className="hero-actions">
                    <a className="btn btn-primary" href="#contato">
                        Solicitar orçamento
                    </a>

                    <a className="btn btn-outline" href="#servicos">
                        Conheça nossos serviços
                    </a>
                </div>
            </div>
        </main>
    );
}
