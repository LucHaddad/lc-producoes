export type Service = {
  id: "som" | "palco" | "luz" | "painel";
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Especificações exibidas em tópicos. Edite livremente. */
  specs: string[];
  video: string;
  fallbackVideo?: string;
  poster: string;
  /** Texto usado na mensagem do WhatsApp ao clicar em "Solicitar orçamento". */
  quoteLabel: string;
};

export const services: Service[] = [
  {
    id: "som",
    number: "01",
    eyebrow: "Áudio profissional",
    title: "Som",
    description:
      "Caixas de som, mesas de áudio e microfones para eventos de diferentes portes.",
    specs: [
      "Caixas e subgraves para o tamanho do público",
      "Mesas de som digitais e analógicas",
      "Microfones com e sem fio",
      "Monitores e retornos de palco",
      "Técnico de áudio disponível",
    ],
    video: "/media/LC-SOM.mp4",
    fallbackVideo: "/media/services/som.mp4",
    poster: "/media/services/som-poster.jpg",
    quoteLabel: "Som",
  },
  {
    id: "palco",
    number: "02",
    eyebrow: "Estrutura para eventos",
    title: "Palco",
    description:
      "Estruturas e tablados planejados para valorizar apresentações e garantir estabilidade.",
    specs: [
      "Tablados e praticáveis modulares",
      "Medidas sob demanda do evento",
      "Estruturas de treliça (box truss)",
      "Escadas, guarda-corpo e saia",
      "Montagem e desmontagem inclusas",
    ],
    video: "/media/LC-PALCO.mp4",
    fallbackVideo: "/media/services/palco.mp4",
    poster: "/media/services/palco-poster.jpg",
    quoteLabel: "Palco",
  },
  {
    id: "luz",
    number: "03",
    eyebrow: "Iluminação cênica",
    title: "Luz",
    description:
      "Refletores e efeitos cênicos para criar ambientes marcantes e valorizar cada momento.",
    specs: [
      "Refletores de LED e moving heads",
      "Efeitos cênicos e máquina de fumaça",
      "Mesa controladora DMX",
      "Iluminação de pista e ambiente",
      "Operação técnica durante o evento",
    ],
    video: "/media/LC-LUZ.mp4",
    fallbackVideo: "/media/services/luz.mp4",
    poster: "/media/services/luz-poster.jpg",
    quoteLabel: "Luz",
  },
  {
    id: "painel",
    number: "04",
    eyebrow: "Imagem em destaque",
    title: "Painel de LED",
    description:
      "Painéis de alta definição para conteúdos visuais, apresentações e cenários impactantes.",
    specs: [
      "Painéis de LED de alta definição",
      "Tamanho conforme o espaço do evento",
      "Vídeos, imagens, logos e transmissão ao vivo",
      "Processadora e operação inclusas",
      "Montagem fixa ou suspensa",
    ],
    video: "/media/LC-PAINEL.mp4",
    fallbackVideo: "/media/services/painel.mp4",
    poster: "/media/services/painel-poster.jpg",
    quoteLabel: "Painel de LED",
  },
];
