"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAnimatedMount } from "@/lib/hooks/useAnimatedMount";

interface GlassDatePickerProps {
  value: string;           // YYYY-MM-DD или ""
  onChange: (date: string) => void;
  placeholder?: string;
  min?: string;            // YYYY-MM-DD
  max?: string;            // YYYY-MM-DD
  disabled?: boolean;
  label?: string;
}

const MONTH_NAMES_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const WEEKDAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function parseDate(iso: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function toISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function GlassDatePicker({
  value,
  onChange,
  placeholder = "Выберите дату",
  min,
  max,
  disabled = false,
}: GlassDatePickerProps) {
  const [open, setOpen] = useState(false);
  const { mounted, animating } = useAnimatedMount(open, 200);

  const selected = parseDate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Текущий отображаемый месяц/год
  const initView = selected ?? today;
  const [viewYear, setViewYear] = useState(initView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initView.getMonth()); // 0-11

  // Sync viewMonth/viewYear когда value меняется снаружи
  useEffect(() => {
    const d = parseDate(value);
    if (d) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Закрыть по клику вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Сетка дней
  const days = useMemo(() => {
    // Первый день месяца
    const first = new Date(viewYear, viewMonth, 1);
    // JS: 0=вс, 1=пн → смещаем: пн=0
    let startDow = first.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (Date | null)[] = [];

    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(viewYear, viewMonth, d));
    }
    // Добить до полных строк (кратно 7)
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (d: Date) => {
    const iso = toISO(d);
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    return false;
  };

  const isSelected = (d: Date) => value === toISO(d);
  const isToday = (d: Date) => toISO(d) === toISO(today);

  const handleSelect = (d: Date) => {
    if (isDisabled(d)) return;
    onChange(toISO(d));
    setOpen(false);
  };

  const displayValue = selected
    ? selected.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        className="input-field flex items-center justify-between cursor-pointer text-left w-full group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={displayValue ? "text-foreground" : "text-default-400 text-sm"}>
          {displayValue || placeholder}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {value && !disabled && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="p-0.5 rounded text-default-300 hover:text-danger transition-colors"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-default-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Календарь-попап */}
      {mounted && (
        <div
          className={`absolute left-0 right-0 mt-1.5 glass-dropdown rounded-2xl z-[60] p-3 ${animating ? "animate-dropdown" : "animate-dropdown-out"
            }`}
          style={{ minWidth: 264 }}
        >
          {/* Навигация по месяцу */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-default-400 hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-foreground select-none">
              {MONTH_NAMES_RU[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-default-400 hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Заголовки дней недели */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAY_LABELS.map(d => (
              <div
                key={d}
                className="h-7 flex items-center justify-center text-[10px] font-medium text-default-400 uppercase tracking-wide"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Сетка дней */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {days.map((d, i) => {
              if (!d) {
                return <div key={`empty-${i}`} className="h-8" />;
              }
              const disabled = isDisabled(d);
              const sel = isSelected(d);
              const tod = isToday(d);
              return (
                <button
                  key={toISO(d)}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(d)}
                  className={`
                    h-8 w-full rounded-lg text-sm font-medium transition-all
                    flex items-center justify-center
                    ${disabled
                      ? "opacity-25 cursor-not-allowed text-default-400"
                      : sel
                        ? "bg-primary text-white shadow-sm"
                        : tod
                          ? "ring-1 ring-primary/60 text-primary hover:bg-primary/15"
                          : "text-foreground hover:bg-white/8 hover:text-foreground"
                    }
                  `}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {/* Кнопка «Сегодня» */}
          <div className="mt-3 pt-2.5 border-t border-white/8">
            <button
              type="button"
              onClick={() => {
                const max_ = max ? max : null;
                const min_ = min ? min : null;
                const todayISO = toISO(today);
                if ((!min_ || todayISO >= min_) && (!max_ || todayISO <= max_)) {
                  onChange(todayISO);
                  setViewYear(today.getFullYear());
                  setViewMonth(today.getMonth());
                  setOpen(false);
                }
              }}
              className="w-full h-8 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              Сегодня
            </button>
          </div>
        </div>
      )}
    </div>
  );
}