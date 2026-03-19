interface ChartTooltipProps {
  active?:  boolean;
  payload?: Array<{ name: string; value: number; color?: string }>;
  label?:   string;
  style:    React.CSSProperties;
  formatter?: (value: number) => string;
}

export function ChartTooltip({ active, payload, label, style, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const fmt = formatter ?? ((v: number) => `${v.toLocaleString('ru-RU')} ₽`);

  return (
    <div style={style} className="px-3 py-2 rounded-xl text-xs pointer-events-none">
      {/* label (название категории / дата) */}
      {label && (
        <p className="font-medium mb-1" style={{ color: style.color }}>
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          {/* цветная точка — особенно полезна для Pie */}
          {p.color && (
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: p.color }} />
          )}
          <span style={{ color: style.color, opacity: 0.7 }}>{p.name}</span>
          <span className="ml-auto pl-3 font-semibold tabular-nums"
            style={{ color: style.color }}>
            {fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

