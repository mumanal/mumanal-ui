import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react"; // Usaremos Lucide para ser consistentes

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm">
      {/* Input oculto: Checked = DARK */}
      <input 
        type="checkbox" 
        onChange={toggleTheme} 
        checked={theme === "dark"} 
      />

      {/* ICONO LUNA (Visible cuando es DARK / Checked) */}
      <div className="swap-on fill-current w-5 h-5">
         <Moon size={20} />
      </div>

      {/* ICONO SOL (Visible cuando es LIGHT / Unchecked) */}
      <div className="swap-off fill-current w-5 h-5">
         <Sun size={20} />
      </div>
    </label>
  );
};