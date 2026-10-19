import { useEffect, useRef, useState } from "react";
import "./DatePicker.css";

export interface DatePickerProps {
  id?: string;
  name?: string;
  value: string; // formato ISO "YYYY-MM-DD"
  min?: string;   // formato ISO "YYYY-MM-DD"
  onChange: (value: string) => void;
  hasError?: boolean;
  ariaDescribedBy?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function isoToDisplay(iso: string): string {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return "";
  const [y, m, d] = parts;
  if (!y || !m || !d) return "";
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

function displayToIso(display: string): string | null {
  if (!display) return null;
  const parts = display.split("/");
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  if (
    !day ||
    !month ||
    !year ||
    year < 2024 ||
    year > 2100 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  // Validação real de dias do mês (ex: não permitir 31 de fevereiro)
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return null;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function maskDate(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function DatePicker({
  id = "quote-date",
  name = "date",
  value,
  min,
  onChange,
  hasError = false,
  ariaDescribedBy,
  placeholder = "DD/MM/AAAA",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => isoToDisplay(value));

  // Data atual de referência para navegação do calendário
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const effectiveMin = min || todayIso;

  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      const parts = value.split("-");
      if (parts[0]) return Number(parts[0]);
    }
    return today.getFullYear();
  });

  const [viewMonth, setViewMonth] = useState(() => {
    if (value) {
      const parts = value.split("-");
      if (parts[1]) return Number(parts[1]) - 1;
    }
    return today.getMonth();
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincroniza se o valor externo mudar
  useEffect(() => {
    const formatted = isoToDisplay(value);
    setDisplayValue(formatted);
    if (value) {
      const parts = value.split("-").map(Number);
      if (parts[0] && parts[1]) {
        setViewYear(parts[0]);
        setViewMonth(parts[1] - 1);
      }
    }
  }, [value]);

  // Fechar ao clicar fora ou pressionar ESC
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
    const masked = maskDate(e.target.value);
    setDisplayValue(masked);

    if (masked.length === 10) {
      const iso = displayToIso(masked);
      if (iso) {
        onChange(iso);
        const parts = iso.split("-").map(Number);
        if (parts[0] && parts[1]) {
          setViewYear(parts[0]);
          setViewMonth(parts[1] - 1);
        }
      } else {
        onChange("");
      }
    } else if (masked.length === 0) {
      onChange("");
    }
  }

  function handleSelectDate(year: number, month: number, day: number) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(iso);
    setDisplayValue(isoToDisplay(iso));
    setIsOpen(false);
    inputRef.current?.focus();
  }

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  // Verifica se o mês anterior está completamente no passado
  const canGoPrev = (() => {
    const [minYear, minMonth] = effectiveMin.split("-").map(Number);
    if (!minYear || !minMonth) return true;
    if (viewYear < minYear) return false;
    if (viewYear === minYear && viewMonth <= minMonth - 1) return false;
    return true;
  })();

  // Monta a grade de dias
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays: Array<{
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    isPast: boolean;
    isSelected: boolean;
    isToday: boolean;
  }> = [];

  // Dias do mês anterior para completar o início da semana
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      isPast: iso < effectiveMin,
      isSelected: value === iso,
      isToday: iso === todayIso,
    });
  }

  // Dias do mês atual
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({
      day: d,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
      isPast: iso < effectiveMin,
      isSelected: value === iso,
      isToday: iso === todayIso,
    });
  }

  // Dias do próximo mês para completar as semanas (múltiplo de 7)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      isPast: iso < effectiveMin,
      isSelected: value === iso,
      isToday: iso === todayIso,
    });
  }

  return (
    <div className="date-picker-wrapper" ref={containerRef}>
      <div className={`date-input-box ${isOpen ? "is-focused" : ""}`}>
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          className="date-input-field"
          autoComplete="off"
        />

        <button
          type="button"
          className="date-calendar-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Fechar calendário" : "Abrir calendário flutuante"}
          aria-expanded={isOpen}
          title="Abrir calendário flutuante"
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <circle cx="8" cy="14" r="1" fill="currentColor" />
            <circle cx="12" cy="14" r="1" fill="currentColor" />
            <circle cx="16" cy="14" r="1" fill="currentColor" />
            <circle cx="8" cy="18" r="1" fill="currentColor" />
            <circle cx="12" cy="18" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="floating-calendar"
          role="dialog"
          aria-modal="true"
          aria-label="Calendário de seleção de data"
        >
          <div className="calendar-header">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              aria-label="Mês anterior"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <span className="calendar-title">
              <strong>{MONTH_NAMES[viewMonth]}</strong> {viewYear}
            </span>

            <button
              type="button"
              className="calendar-nav-btn"
              onClick={handleNextMonth}
              aria-label="Próximo mês"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>

          <div className="calendar-weekdays" aria-hidden="true">
            {WEEKDAY_NAMES.map((name) => (
              <span key={name} className="weekday-label">
                {name}
              </span>
            ))}
          </div>

          <div className="calendar-grid" role="grid">
            {calendarDays.map((item, index) => {
              const dateIso = `${item.year}-${String(item.month + 1).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`;
              return (
                <button
                  key={`${dateIso}-${index}`}
                  type="button"
                  className={`calendar-day-btn ${
                    !item.isCurrentMonth ? "is-outside" : ""
                  } ${item.isPast ? "is-past" : ""} ${
                    item.isSelected ? "is-selected" : ""
                  } ${item.isToday ? "is-today" : ""}`}
                  disabled={item.isPast}
                  onClick={() => handleSelectDate(item.year, item.month, item.day)}
                  aria-label={`${item.day} de ${MONTH_NAMES[item.month]} de ${item.year}`}
                  aria-selected={item.isSelected}
                >
                  <span className="day-number">{item.day}</span>
                </button>
              );
            })}
          </div>

          <div className="calendar-footer">
            <button
              type="button"
              className="calendar-today-btn"
              onClick={() => {
                const now = new Date();
                handleSelectDate(now.getFullYear(), now.getMonth(), now.getDate());
              }}
            >
              Selecionar hoje
            </button>
            <button
              type="button"
              className="calendar-close-btn"
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
