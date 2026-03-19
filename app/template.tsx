'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Только сдвиг — opacity отдаём stagger-контейнерам
    el.animate(
      [
        { transform: 'translateY(10px)' },
        { transform: 'translateY(0)' },
      ],
      { duration: 260, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
    );
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
