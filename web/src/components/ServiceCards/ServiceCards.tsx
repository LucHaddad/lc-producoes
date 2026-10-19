import { useEffect, useRef, useState } from "react";
import { services, type Service } from "./services.data";
import "./ServiceCards.css";


function ServiceVideo({ service }: { service: Service }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Respeita quem pediu menos movimento: só mostra o poster.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Toca só enquanto o card está visível, para economizar dados e bateria.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pausedByUser.current) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      video.play().catch(() => {});
    } else {
      pausedByUser.current = true;
      video.pause();
    }
  };

  return (
    <div className="svc-media">
      <video
        ref={videoRef}
        src={service.video}
        poster={service.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`Vídeo de exemplo: ${service.title}`}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={(e) => {
          if (service.fallbackVideo && e.currentTarget.currentSrc !== service.fallbackVideo) {
            e.currentTarget.src = service.fallbackVideo;
            e.currentTarget.load();
          }
        }}
      />
      <span className="svc-num">{service.number}</span>
      <button
        type="button"
        className="svc-toggle"
        onClick={toggle}
        aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}

interface ServiceCardsProps {
  onSelectService?: (serviceName: string) => void;
}

export default function ServiceCards({ onSelectService }: ServiceCardsProps) {
  return (
    <div className="svc-grid">
      {services.map((service) => (
        <article className="svc-card" key={service.id}>
          <ServiceVideo service={service} />
          <div className="svc-body">
            <p className="svc-eyebrow">{service.eyebrow}</p>
            <h3 className="svc-title">{service.title}</h3>
            <p className="svc-desc">{service.description}</p>
            <ul className="svc-specs" aria-label={`Especificações de ${service.title}`}>
              {service.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
            <a
              className="svc-cta"
              href="#orcamento"
              onClick={(e) => {
                if (onSelectService) {
                  e.preventDefault();
                  onSelectService(service.title);
                }
              }}
              aria-label={`Solicitar orçamento de ${service.title}`}
            >
              Solicitar orçamento <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
