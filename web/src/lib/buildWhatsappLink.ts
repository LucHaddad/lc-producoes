
const WHATSAPP_NUMBER = "5585994024800";

export interface QuoteData {
    name: string;
    eventType: string;
    date: string;
    startTime?: string;
    endTime?: string;
    location: string;
    palcoTipo?: string;
    palcoTamanho?: string;
    painelTamanho?: string;
    details: string;
    services: string[];
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "A definir";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return dateStr;

    const dateObj = new Date(year, month - 1, day, 12, 0, 0);
    const dayOfWeek = dateObj.toLocaleDateString("pt-BR", { weekday: "long" });
    const formatted = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
    const capitalizedWeekday =
        dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

    return `${formatted} (${capitalizedWeekday})`;
}

export function buildWhatsappLink(data: QuoteData): string {
    const servicesList =
        data.services.length > 0
            ? data.services.map((item) => `• ${item}`).join("\n")
            : "• Nenhum serviço pré-selecionado";

    const additionalDetails =
        data.details.trim() || "Nenhum detalhe adicional informado.";

    let horarioText = "A definir";
    if (data.startTime && data.endTime) {
        horarioText = `das ${data.startTime} às ${data.endTime}`;
    } else if (data.startTime) {
        horarioText = `a partir das ${data.startTime}`;
    } else if (data.endTime) {
        horarioText = `até às ${data.endTime}`;
    }

    const extraSpecs: string[] = [];
    if (data.services.includes("Palco") && (data.palcoTipo || data.palcoTamanho)) {
        const palcoLines = ["🎪 *ESPECIFICAÇÕES DO PALCO:*"];
        if (data.palcoTipo) palcoLines.push(`• Modelo: ${data.palcoTipo}`);
        if (data.palcoTamanho) palcoLines.push(`• Tamanho: ${data.palcoTamanho}`);
        extraSpecs.push(palcoLines.join("\n"));
    }

    if (data.services.includes("Painel de LED") && data.painelTamanho) {
        extraSpecs.push(`📺 *PAINEL DE LED:*\n• Tamanho: ${data.painelTamanho}`);
    }

    const message = [
        "Olá, equipe da *LC Produções*! 👋",
        "Gostaria de solicitar um orçamento para o meu evento:",
        "",
        "📋 *DADOS DO EVENTO*",
        `👤 *Nome:* ${data.name}`,
        `🎉 *Tipo de evento:* ${data.eventType}`,
        `📅 *Data prevista:* ${formatDate(data.date)}`,
        `⏰ *Horário:* ${horarioText}`,
        `📍 *Local:* ${data.location}`,
        "",
        "🛠️ *SERVIÇOS DE INTERESSE:*",
        servicesList,
        ...(extraSpecs.length > 0 ? ["", ...extraSpecs] : []),
        "",
        "📝 *DETALHES ADICIONAIS:*",
        additionalDetails,
        "",
        "Aguardo o contato com a proposta! Obrigado(a).",
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
