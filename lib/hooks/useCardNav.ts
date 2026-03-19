import { useState } from 'react';

/**
 * view → edit : animate-tab-in  (слайд справа)
 * edit → view : animate-tab-back (слайд слева)
 *
 * key меняется при каждом переключении → React уничтожает
 * и создаёт DOM-узел заново → анимация гарантированно запускается
 */
export function useCardNav() {
  const [isEditing, setIsEditing] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [goingBack, setGoingBack] = useState(false);

  const openEdit = () => {
    setGoingBack(false);
    setAnimKey(k => k + 1);
    setIsEditing(true);
  };

  const closeEdit = () => {
    setGoingBack(true);
    setAnimKey(k => k + 1);
    setIsEditing(false);
  };

  const animClass = goingBack ? 'animate-tab-back' : 'animate-tab-in';

  return { isEditing, animKey, animClass, openEdit, closeEdit };
}
