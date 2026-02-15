import React from "react";

// Agregamos las nuevas variantes a la lista
type ButtonVariant = 
  | "primary" | "secondary" | "neutral" | "ghost" | "white"
  | "save" | "delete" | "cancel" | "edit" // CRUD Básico
  | "excel" | "pdf" // Reportes
  | "overlay"
  | "success" | "error" | "warning" | "info" | "create" | "steps"; 

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string; // Ahora es opcional (porque los botones redondos no llevan texto)
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  isIconOnly?: boolean; // Nueva prop para hacerlos redondos
  tooltip?: string; // Útil para botones sin texto
  responsive?: boolean; // <--- 1. NUEVA PROPIEDAD
}

export const TravesiaButton = ({ 
  label, 
  variant = "primary", 
  isLoading = false, 
  icon,
  fullWidth = false,
  isIconOnly = false,
  className = "",
  tooltip,
  responsive = false, // Por defecto es falso (comportamiento normal)
  ...props 
}: Props) => {

  const getVariantClass = () => {
    switch (variant) {
      // Clases mapeadas en index.css
      case "save": return "btn-travesia-save border-none"; 
      case "delete": return "btn-travesia-delete border-none";
      case "cancel": return "btn-travesia-delete border-none"; // Reusamos el rojo para cancelar como pediste
      
      case "edit": return "btn-travesia-edit border-none";
      case "excel": return "btn-travesia-excel border-none";
      case "pdf": return "btn-travesia-pdf border-none";
      case "create": return "btn-travesia-create border-none";
      
      case "steps": return "btn-travesia-steps border-none";
      case "ghost": return "btn-travesia-ghost text-white"; 
      case "error": return "btn-travesia-error border-none"; 
      case "warning": return "btn-travesia-warning border-none";
      case "success": return "btn-travesia-success border-none";
      // Defaults de DaisyUI
      case "neutral": return "btn-neutral text-white";

      case "white": return "bg-white text-base-content hover:bg-gray-100 border-none"; 
      case "overlay": return "bg-black/40 hover:bg-black/60 text-white border-none backdrop-blur-[2px] shadow-sm";
      default: return "btn-travesia-primary text-white";
    }
  };

  const content = (
    <button 
      className={`
        btn 
        ${getVariantClass()} 
        ${fullWidth ? "w-full" : ""}
        ${isIconOnly 
            ? "btn-circle btn-sm md:btn-md" 
            : "px-4 min-w-[100px] sm:min-w-[120px] gap-2" 
        }
        shadow-sm hover:shadow-md transition-all
        ${className}
      `} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="loading loading-spinner"></span> : icon}
      {!isIconOnly && label && (
          <span className={responsive ? "hidden sm:inline" : ""}>
            {label}
          </span>
      )}
    </button>
  );

  // Si tiene tooltip, lo envolvemos
  if (tooltip) {
    return <div className="tooltip" data-tip={tooltip}>{content}</div>;
  }

  return content;
};