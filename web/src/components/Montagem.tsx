import { useState, type Dispatch, type SetStateAction } from "react";
import QuoteForm from "./QuoteForm";

const services = [
    {
        name: "Som",
        description: "Caixas, mesa de áudio e microfones",
        number: "01",
    },
    {
        name: "Luz",
        description: "Refletores e efeitos de iluminação",
        number: "02",
    },
    {
        name: "Palco",
        description: "Estruturas e tablados",
        number: "03",
    },
    {
        name: "Painel de LED",
        description: "Painéis visuais de alta definição",
        number: "04",
    },
];

const packages = [
    {
        name: "Som e luz",
        description: "Áudio e iluminação",
        services: ["Som", "Luz"],
    },
    {
        name: "Palco, som e luz",
        description: "Estrutura, áudio e iluminação",
        services: ["Palco", "Som", "Luz"],
    },
    {
        name: "Montagem completa",
        description: "Todos os serviços",
        services: ["Som", "Luz", "Palco", "Painel de LED"],
    },
];

interface MontagemProps {
    selectedServices?: string[];
    onSelectServices?: Dispatch<SetStateAction<string[]>>;
}

export default function Montagem({
    selectedServices: externalSelectedServices,
    onSelectServices: externalOnSelectServices,
}: MontagemProps = {}) {
    const [internalServices, setInternalServices] = useState<string[]>([]);

    const selectedServices =
        externalSelectedServices !== undefined
            ? externalSelectedServices
            : internalServices;

    const setSelectedServices =
        externalOnSelectServices !== undefined
            ? externalOnSelectServices
            : setInternalServices;

    function toggleService(serviceName: string) {
        setSelectedServices((current) =>
            current.includes(serviceName)
                ? current.filter((item) => item !== serviceName)
                : [...current, serviceName],
        );
    }

    function selectPackage(packageServices: string[]) {
        setSelectedServices(packageServices);
    }

    return (
        <section className="montagem-section" id="orcamento">
            <div className="montagem-container">
                <div className="montagem-heading">
                    <p className="section-eyebrow">Seu evento, do seu jeito</p>
                    <h2>
                        Monte sua estrutura.
                        <br />
                        <span>Solicite seu orçamento.</span>
                    </h2>
                    <p>
                        Escolha os serviços que você precisa ou comece com
                        uma das nossas combinações sugeridas.
                    </p>
                </div>

                <div className="montagem-layout">
                    <div className="montagem-selection">
                        <div className="montagem-subheading">
                            <span className="montagem-step">01</span>
                            <div>
                                <h3>Escolha os serviços</h3>
                                <p>Selecione uma ou mais opções.</p>
                            </div>
                        </div>

                        <div className="service-options">
                            {services.map((service) => {
                                const isSelected = selectedServices.includes(service.name);

                                return (
                                    <button
                                        type="button"
                                        key={service.name}
                                        className={`service-option ${isSelected ? "is-selected" : ""
                                            }`}
                                        aria-pressed={isSelected}
                                        onClick={() => toggleService(service.name)}
                                    >
                                        <span className="service-option-number">
                                            {service.number}
                                        </span>

                                        <span className="service-option-copy">
                                            <strong>{service.name}</strong>
                                            <span>{service.description}</span>
                                        </span>

                                        <span className="service-option-check" aria-hidden="true">
                                            {isSelected ? "✓" : "+"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <p className="montagem-selection-count" aria-live="polite">
                            {selectedServices.length === 0
                                ? "Nenhum serviço selecionado"
                                : `${selectedServices.length} ${selectedServices.length === 1
                                    ? "serviço selecionado"
                                    : "serviços selecionados"
                                }`}
                        </p>

                        <div className="package-heading">
                            <h3>Ou escolha uma montagem rápida</h3>
                            <p>Você pode personalizar a seleção depois.</p>
                        </div>

                        <div className="package-options">
                            {packages.map((item) => {
                                const isSelected =
                                    selectedServices.length === item.services.length &&
                                    item.services.every((service) =>
                                        selectedServices.includes(service),
                                    );

                                return (
                                    <button
                                        type="button"
                                        key={item.name}
                                        className={`package-option ${isSelected ? "is-selected" : ""
                                            }`}
                                        aria-pressed={isSelected}
                                        onClick={() => selectPackage(item.services)}
                                    >
                                        <span>
                                            <strong>{item.name}</strong>
                                            <small>{item.description}</small>
                                        </span>
                                        <span aria-hidden="true">
                                            {isSelected ? "✓" : "↗"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <QuoteForm services={selectedServices} />
                </div>
            </div>
        </section>
    );
}
