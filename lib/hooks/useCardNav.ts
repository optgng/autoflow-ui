import { useState, useRef } from 'react';

export function useCardNav() {
  const [isEditing, setIsEditing] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // ref обновляется синхронно — нет риска батч-рассинхронизации
  const animClassRef = useRef<'animate-tab-in' | 'animate-tab-back'>('animate-tab-in');

  const openEdit = () => {
    animClassRef.current = 'animate-tab-in';   // вид → форма: справа
    setAnimKey(k => k + 1);
    setIsEditing(true);
  };

  const closeEdit = () => {
    animClassRef.current = 'animate-tab-back'; // форма → вид: слева
    setAnimKey(k => k + 1);
    setIsEditing(false);
  };

  return {
    isEditing,
    animKey,
    animClass: animClassRef.current, // читается при каждом рендере — всегда актуален
    openEdit,
    closeEdit,
  };
}
