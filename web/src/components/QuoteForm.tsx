
import { useState, type SyntheticEvent } from "react";
import DatePicker from "./DatePicker/DatePicker";
import TimePicker from "./TimePicker/TimePicker";
import {
    buildWhatsappLink,
    type QuoteData,
} from "../lib/buildWhatsappLink";

interface QuoteFormProps {
    services: string[];
}

interface FormErrors {
    name?: string;
    eventType?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    services?: string;
}

const initialForm = {
    name: "",
    eventType: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    palcoTipo: "",
    palcoTamanho: "",
    painelTamanho: "",
    details: "",
};

export default function QuoteForm({ services }: QuoteFormProps) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

    function updateField(
        field: keyof typeof initialForm,
        value: string,
    ) {
        setForm((current) => ({ ...current, [field]: value }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    }

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextErrors: FormErrors = {};

        if (!form.name.trim()) {
            nextErrors.name = "Informe seu nome.";
        }

        if (!form.eventType) {
            nextErrors.eventType = "Selecione o tipo de evento.";
        }

        if (!form.date) {
            nextErrors.date = "Informe a data do evento.";
        } else if (form.date < getToday()) {
            nextErrors.date = "A data não pode estar no passado.";
        }

        if (!form.location.trim()) {
            nextErrors.location = "Informe o local do evento.";
        }

        if (services.length === 0) {
            nextErrors.services = "Selecione pelo menos um serviço.";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        const quote: QuoteData = {
            ...form,
            name: form.name.trim(),
            startTime: form.startTime.trim() || undefined,
            endTime: form.endTime.trim() || undefined,
            location: form.location.trim(),
            palcoTipo: services.includes("Palco") && form.palcoTipo ? form.palcoTipo : undefined,
            palcoTamanho:
                services.includes("Palco") && form.palcoTamanho.trim()
                    ? form.palcoTamanho.trim()
                    : undefined,
            painelTamanho:
                services.includes("Painel de LED") && form.painelTamanho.trim()
                    ? form.painelTamanho.trim()
                    : undefined,
            details: form.details.trim(),
            services,
        };

        const whatsappUrl = buildWhatsappLink(quote);
        setSubmittedUrl(whatsappUrl);

        const opened = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        if (!opened || opened.closed || typeof opened.closed === "undefined") {
            window.location.href = whatsappUrl;
        }
    }

    const hasPalco = services.includes("Palco");
    const hasPainel = services.includes("Painel de LED");

    return (
        <form
            className="quote-form"
            id="contato"
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="quote-form-heading">
                <p className="section-eyebrow">Vamos tirar sua ideia do papel</p>
                <h3>Conte-nos sobre seu evento.</h3>
                <p>
                    Preencha os dados abaixo para preparar sua solicitação
                    de orçamento pelo WhatsApp.
                </p>
            </div>

            <div className="quote-fields">
                <div className="quote-field">
                    <label htmlFor="quote-name">Seu nome *</label>
                    <input
                        id="quote-name"
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        placeholder="Como podemos chamar você?"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "quote-name-error" : undefined}
                    />
                    {errors.name && (
                        <span className="field-error" id="quote-name-error">
                            {errors.name}
                        </span>
                    )}
                </div>

                <div className="quote-field">
                    <label htmlFor="quote-event-type">Tipo de evento *</label>
                    <select
                        id="quote-event-type"
                        name="eventType"
                        value={form.eventType}
                        onChange={(event) => updateField("eventType", event.target.value)}
                        aria-invalid={Boolean(errors.eventType)}
                        aria-describedby={
                            errors.eventType ? "quote-event-type-error" : undefined
                        }
                    >
                        <option value="">Selecione uma opção</option>
                        <option value="Casamento">Casamento</option>
                        <option value="Aniversário">Aniversário</option>
                        <option value="Evento corporativo">Evento corporativo</option>
                        <option value="Show ou festival">Show ou festival</option>
                        <option value="Formatura">Formatura</option>
                        <option value="Evento público">Evento público</option>
                        <option value="Outro">Outro</option>
                    </select>
                    {errors.eventType && (
                        <span className="field-error" id="quote-event-type-error">
                            {errors.eventType}
                        </span>
                    )}
                </div>

                <div className="quote-field">
                    <label htmlFor="quote-date">Data do evento *</label>
                    <DatePicker
                        id="quote-date"
                        name="date"
                        min={getToday()}
                        value={form.date}
                        onChange={(isoDate) => updateField("date", isoDate)}
                        hasError={Boolean(errors.date)}
                        ariaDescribedBy={errors.date ? "quote-date-error" : undefined}
                    />
                    {errors.date && (
                        <span className="field-error" id="quote-date-error">
                            {errors.date}
                        </span>
                    )}
                </div>

                <div className="quote-field">
                    <label htmlFor="quote-location">Local do evento *</label>
                    <input
                        id="quote-location"
                        name="location"
                        autoComplete="street-address"
                        value={form.location}
                        onChange={(event) => updateField("location", event.target.value)}
                        placeholder="Cidade, espaço ou endereço"
                        aria-invalid={Boolean(errors.location)}
                        aria-describedby={
                            errors.location ? "quote-location-error" : undefined
                        }
                    />
                    {errors.location && (
                        <span className="field-error" id="quote-location-error">
                            {errors.location}
                        </span>
                    )}
                </div>

                <div className="quote-field">
                    <label htmlFor="quote-start-time">
                        Início do evento <span>(opcional)</span>
                    </label>
                    <TimePicker
                        id="quote-start-time"
                        name="startTime"
                        value={form.startTime}
                        onChange={(val) => updateField("startTime", val)}
                        placeholder="Ex: 19:00"
                    />
                </div>

                <div className="quote-field">
                    <label htmlFor="quote-end-time">
                        Término do evento <span>(opcional)</span>
                    </label>
                    <TimePicker
                        id="quote-end-time"
                        name="endTime"
                        value={form.endTime}
                        onChange={(val) => updateField("endTime", val)}
                        placeholder="Ex: 03:00"
                    />
                </div>

                {hasPalco && (
                    <div className="quote-field quote-field-full quote-conditional-box">
                        <div className="conditional-box-header">
                            <span className="conditional-tag">
                                🎪 Estrutura de Palco
                            </span>
                            <p>
                                Selecione se deseja tablado ou palco coberto e indique o tamanho estimado.
                            </p>
                        </div>

                        <div className="conditional-fields-grid">
                            <div className="quote-field">
                                <label>
                                    Modelo do palco <span>(opcional)</span>
                                </label>
                                <div className="palco-tipo-toggle">
                                    <button
                                        type="button"
                                        className={`palco-toggle-btn ${
                                            form.palcoTipo === "Tablado" ? "is-selected" : ""
                                        }`}
                                        onClick={() =>
                                            updateField(
                                                "palcoTipo",
                                                form.palcoTipo === "Tablado" ? "" : "Tablado",
                                            )
                                        }
                                    >
                                        Tablado (Descoberto)
                                    </button>
                                    <button
                                        type="button"
                                        className={`palco-toggle-btn ${
                                            form.palcoTipo === "Palco coberto" ? "is-selected" : ""
                                        }`}
                                        onClick={() =>
                                            updateField(
                                                "palcoTipo",
                                                form.palcoTipo === "Palco coberto"
                                                    ? ""
                                                    : "Palco coberto",
                                            )
                                        }
                                    >
                                        Palco Coberto
                                    </button>
                                </div>
                            </div>

                            <div className="quote-field">
                                <label htmlFor="quote-palco-tamanho">
                                    Tamanho do palco <span>(opcional)</span>
                                </label>
                                <input
                                    id="quote-palco-tamanho"
                                    name="palcoTamanho"
                                    value={form.palcoTamanho}
                                    onChange={(event) =>
                                        updateField("palcoTamanho", event.target.value)
                                    }
                                    placeholder="Ex: 6x4m ou digite livremente"
                                />
                                <div className="chips-group" aria-label="Sugestões de tamanho de palco">
                                    {["4x3m", "6x4m", "8x6m", "10x8m", "A definir"].map((dim) => (
                                        <button
                                            key={dim}
                                            type="button"
                                            className={`chip-btn ${
                                                form.palcoTamanho === dim ? "is-selected" : ""
                                            }`}
                                            onClick={() => updateField("palcoTamanho", dim)}
                                        >
                                            {dim}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {hasPainel && (
                    <div className="quote-field quote-field-full quote-conditional-box">
                        <div className="conditional-box-header">
                            <span className="conditional-tag">
                                📺 Painel de LED
                            </span>
                            <p>
                                Indique o tamanho aproximado para a exibição de conteúdos e imagens.
                            </p>
                        </div>

                        <div className="quote-field">
                            <label htmlFor="quote-painel-tamanho">
                                Tamanho do painel de LED <span>(opcional)</span>
                            </label>
                            <input
                                id="quote-painel-tamanho"
                                name="painelTamanho"
                                value={form.painelTamanho}
                                onChange={(event) =>
                                    updateField("painelTamanho", event.target.value)
                                }
                                placeholder="Ex: 4x2,5m ou digite livremente"
                            />
                            <div className="chips-group" aria-label="Sugestões de tamanho de painel">
                                {["3x2m", "4x2,5m", "5x3m", "6x3m", "A definir"].map((dim) => (
                                    <button
                                        key={dim}
                                        type="button"
                                        className={`chip-btn ${
                                            form.painelTamanho === dim ? "is-selected" : ""
                                        }`}
                                        onClick={() => updateField("painelTamanho", dim)}
                                    >
                                        {dim}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="quote-field quote-field-full">
                    <label htmlFor="quote-details">
                        Detalhes adicionais <span>(opcional)</span>
                    </label>
                    <textarea
                        id="quote-details"
                        name="details"
                        rows={4}
                        maxLength={1000}
                        value={form.details}
                        onChange={(event) => updateField("details", event.target.value)}
                        placeholder="Conte sobre o tamanho do evento, público estimado ou outras necessidades."
                    />
                    <span className="quote-character-count">
                        {form.details.length}/1000
                    </span>
                </div>
            </div>

            {errors.services && (
                <p className="field-error quote-services-error" role="alert">
                    {errors.services}
                </p>
            )}

            <p className="quote-privacy-note">
                * Campos obrigatórios. Seus dados serão incluídos na mensagem
                enviada ao WhatsApp da LC Produções.
            </p>

            <button className="btn btn-primary quote-submit" type="submit">
                Solicitar orçamento pelo WhatsApp
                <span aria-hidden="true">↗</span>
            </button>

            {submittedUrl && (
                <div className="quote-success-box" role="status">
                    <p className="quote-success-title">
                        ✓ Mensagem preparada para o WhatsApp!
                    </p>
                    <p className="quote-success-desc">
                        Se a conversa não abriu automaticamente, toque no botão abaixo para iniciar:
                    </p>
                    <a
                        href={submittedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary quote-success-btn"
                    >
                        Abrir WhatsApp manualmente <span aria-hidden="true">↗</span>
                    </a>
                </div>
            )}
        </form>
    );
}

function getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
