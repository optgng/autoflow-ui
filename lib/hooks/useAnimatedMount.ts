import { useEffect, useState } from 'react';

export function useAnimatedMount(visible: boolean, duration = 200) {
  const [mounted, setMounted] = useState(visible);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      // Дать браузеру отрисовать элемент, потом запустить enter
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
    } else {
      setAnimating(false);
      const t = setTimeout(() => setMounted(false), duration);
      return () => clearTimeout(t);
    }
  }, [visible, duration]);

  return { mounted, animating };
}
