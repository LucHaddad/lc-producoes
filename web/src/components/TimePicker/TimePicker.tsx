import { useEffect, useRef, useState } from "react";
import "./TimePicker.css";

export interface TimePickerProps {
  id?: string;
  name?: string;
  value: string; // formato "HH:MM"
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  ariaDescribedBy?: string;
}

// Horários mais comuns em eventos para seleção com 1 toque
const SUGGESTED_TIMES = [
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
];

const COMMON_MINUTES = ["00", "15", "30", "45"];

function maskTime(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function isValidTime(timeStr: string): boolean {
  if (!timeStr || timeStr.length !== 5) return false;
  const parts = timeStr.split(":");
  if (parts.length !== 2) return false;
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  return !isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

export default function TimePicker({
  id = "time-picker",
  name = "time",
  value,
  onChange,
  placeholder = "Ex: 19:00",
  hasError = false,
  ariaDescribedBy,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(value || "");
  const [activeTab, setActiveTab] = useState<"quick" | "custom">("quick");

  // Estado para o seletor personalizado (Horas e Minutos)
  const [selectedHour, setSelectedHour] = useState<string>(() => {
    if (value && value.includes(":")) return value.split(":")[0];
    return "19";
  });
  const [selectedMinute, setSelectedMinute] = useState<string>(() => {
    if (value && value.includes(":")) return value.split(":")[1];
    return "00";
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayValue(value || "");
    if (value && value.includes(":")) {
      const [h, m] = value.split(":");
      setSelectedHour(h);
      setSelectedMinute(m);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = maskTime(e.target.value);
    setDisplayValue(masked);

    if (masked.length === 5) {
      if (isValidTime(masked)) {
        onChange(masked);
      }
    } else if (masked.length === 0) {
      onChange("");
    }
  }

  function handleSelectTime(time: string) {
    onChange(time);
    setDisplayValue(time);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  function handleApplyCustom(h: string, m: string) {
    const formatted = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    handleSelectTime(formatted);
  }

  return (
    <div className="time-picker-wrapper" ref={containerRef}>
      <div className={`time-input-box ${isOpen ? "is-focused" : ""}`}>
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={5}
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          className="time-input-field"
          autoComplete="off"
        />

        <button
          type="button"
          className="time-toggle-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Fechar seletor de horário" : "Abrir seletor de horário"}
          aria-expanded={isOpen}
          title="Abrir seletor de horário"
        >
          <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="floating-time-picker"
          role="dialog"
          aria-modal="true"
          aria-label="Seletor de horário"
        >
          <div className="time-picker-header">
            <span className="time-header-title">Escolha o horário</span>
            <div className="time-tabs">
              <button
                type="button"
                className={`time-tab-btn ${activeTab === "quick" ? "is-active" : ""}`}
                onClick={() => setActiveTab("quick")}
              >
                Frequentes
              </button>
              <button
                type="button"
                className={`time-tab-btn ${activeTab === "custom" ? "is-active" : ""}`}
                onClick={() => setActiveTab("custom")}
              >
                Personalizado
              </button>
            </div>
          </div>

          {activeTab === "quick" ? (
            <div className="time-quick-grid">
              {SUGGESTED_TIMES.map((time) => {
                const isSelected = value === time;
                return (
                  <button
                    key={time}
                    type="button"
                    className={`time-chip-btn ${isSelected ? "is-selected" : ""}`}
                    onClick={() => handleSelectTime(time)}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="time-custom-selector">
              <div className="time-column-group">
                <span className="time-column-label">Hora</span>
                <div className="time-scroll-column">
                  {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map(
                    (h) => (
                      <button
                        key={h}
                        type="button"
                        className={`time-cell-btn ${selectedHour === h ? "is-selected" : ""}`}
                        onClick={() => setSelectedHour(h)}
                      >
                        {h}h
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="time-column-divider">:</div>

              <div className="time-column-group">
                <span className="time-column-label">Minuto</span>
                <div className="time-scroll-column">
                  {COMMON_MINUTES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`time-cell-btn ${selectedMinute === m ? "is-selected" : ""}`}
                      onClick={() => setSelectedMinute(m)}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="time-picker-footer">
            {activeTab === "custom" ? (
              <button
                type="button"
                className="time-apply-btn"
                onClick={() => handleApplyCustom(selectedHour, selectedMinute)}
              >
                Aplicar {selectedHour}:{selectedMinute}
              </button>
            ) : (
              displayValue && (
                <button
                  type="button"
                  className="time-clear-btn"
                  onClick={() => {
                    onChange("");
                    setDisplayValue("");
                  }}
                >
                  Limpar
                </button>
              )
            )}
            <button
              type="button"
              className="time-close-btn"
              onClick={() => setIsOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
