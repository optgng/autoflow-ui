import { useEffect, useRef, useState } from 'react';

export function useAnimatedMount(visible: boolean, duration = 200) {
  const [mounted, setMounted] = useState(visible);
  const [animating, setAnimating] = useState(visible);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timerRef.current);

    if (visible) {
      // React 18 батчит оба setState — один рендер, сразу enter-состояние
      setMounted(true);
      setAnimating(true);
    } else {
      setAnimating(false);
      timerRef.current = setTimeout(() => setMounted(false), duration);
    }

    return () => clearTimeout(timerRef.current);
  }, [visible, duration]);

  return { mounted, animating };
}
