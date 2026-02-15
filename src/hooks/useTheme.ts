import { useEffect, useState } from "react";

// Definimos los temas disponibles para tener autocompletado
type Theme = "light" | "dark" | "cupcake" | "corporate" | "synthwave";

export const useTheme = () => {
  // 1. Estado inicial: Leemos de localStorage o usamos 'light' por defecto
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "light";
  });

  // 2. Efecto: Cada vez que 'theme' cambie, actualizamos el HTML y localStorage
  useEffect(() => {
    // Actualiza el atributo en la etiqueta <html data-theme="...">
    document.documentElement.setAttribute("data-theme", theme);
    // Guarda la preferencia para la próxima vez que entre
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3. Función para cambiar el tema (la que usaremos en el botón)
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Función para establecer un tema específico (para el futuro panel de settings)
  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { theme, toggleTheme, setSpecificTheme };
};