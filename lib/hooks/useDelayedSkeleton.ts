import { useState, useEffect, useRef } from 'react';

/**
 * active=true  → запускает таймер на delay мс
 * До истечения таймера → show=false (ничего не показываем)
 * После delay мс без данных → show=true (показываем skeleton)
 * active=false → show=false (данные пришли, показываем контент)
 */
export function useDelayedSkeleton(active: boolean, delay = 2000) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (active) {
      timerRef.current = setTimeout(() => setShow(true), delay);
    } else {
      setShow(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [active, delay]);

  return show;
}
