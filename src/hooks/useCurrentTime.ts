import { useState, useEffect } from 'react';

export const useCurrentTime = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Actualiza cada minuto para no consumir recursos innecesarios
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Formato: "4:45 pm 19 Jan 2026"
  const formattedDate = new Intl.DateTimeFormat('es-BO', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);

  return formattedDate;
};