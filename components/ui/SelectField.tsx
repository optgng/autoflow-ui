'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export default function SelectField({ value, onChange, options, className = '' }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Закрыть при клике снаружи
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full h-9 px-3 rounded-xl bg-content2 border border-divider
                   text-foreground text-sm flex items-center justify-between
                   hover:bg-content3 focus:outline-none focus:border-primary
                   focus:ring-1 transition-all"
        style={{ '--tw-ring-color': 'rgba(0,229,255,0.25)' } as React.CSSProperties}
      >
        <span>{selected?.label ?? value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-default-400 transition-transform duration-200
                                  ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1.5 glass-dropdown rounded-xl py-1 z-50
                        animate-dropdown overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm
                         hover:bg-white/5 transition-colors text-left"
            >
              <span className={value === opt.value ? 'text-primary font-medium' : 'text-foreground'}>
                {opt.label}
              </span>
              {value === opt.value && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

