import ServiceCards from "./ServiceCards/ServiceCards";

interface ServicesProps {
    onSelectService?: (serviceName: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
    return (
        <section className="services-section" id="servicos">
            <div className="services-container">
                <div className="services-heading">
                    <p className="section-eyebrow">O que fazemos</p>

                    <h2>
                        A estrutura certa para
                        <br />
                        <span>um evento inesquecível.</span>
                    </h2>

                    <p className="services-intro">
                        Soluções de som, iluminação e estrutura
                        para transformar sua ideia em uma experiência
                        bem executada.
                    </p>
                </div>

                <ServiceCards onSelectService={onSelectService} />
            </div>
        </section>
    );
}
