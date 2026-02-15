import { createContext, useContext, useState, type ReactNode } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  closing: boolean; // 1. Nuevo campo para controlar la animación de salida
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();
    // Agregamos con closing: false
    setToasts((prev) => [...prev, { id, message, type, closing: false }]);

    // Lógica del "Tren de vuelta":
    // 1. Esperamos 3 segundos (lectura)
    setTimeout(() => {
        startClosing(id);
    }, 3500);
  };

  // Inicia la animación de salida
  const startClosing = (id: number) => {
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, closing: true } : t));
    
    // 2. Esperamos 400ms (lo que dura la animación CSS) y eliminamos real
    setTimeout(() => {
        removeToast(id);
    }, 400); 
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (msg: string) => addToast(msg, "success");
  const error = (msg: string) => addToast(msg, "error");
  const warning = (msg: string) => addToast(msg, "warning");
  const info = (msg: string) => addToast(msg, "info");

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      
      {/* CONTENEDOR: Ajustado el margen derecho para que el slide se vea limpio */}
      <div className="fixed top-4 right-0 z-[10000] flex flex-col gap-3 w-full pointer-events-none pr-4 sm:pr-6">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            // Aquí aplicamos la animación de entrada O la de salida según el estado
            className={`
                pointer-events-auto flex justify-end
                ${toast.closing ? 'animate-slide-out-right' : 'animate-slide-in-right'}
            `}
          >
            <div 
                role="alert" 
                className={`
                    alert alert-soft shadow-xl flex items-start border border-base-200/50
                    ${getAlertClass(toast.type)}
                    
                    /* --- RESPONSIVE DESIGN --- */
                    /* Móvil (Por defecto): Ancho flexible, texto normal */
                    w-auto max-w-[90vw]
                    
                    /* PC (md): Ancho fijo más grande, padding extra */
                    md:min-w-[420px] md:max-w-xl md:p-5
                `}
            >
               {/* Icono: Pequeño en móvil (20), Grande en PC (28) */}
               <div className="mt-0.5 md:mt-1">
                   {getIcon(toast.type)}
               </div>
               
               {/* Texto: Normal en móvil (sm), Grande en PC (lg) */}
               <span className="font-medium text-sm md:text-lg flex-1 leading-snug">
                   {toast.message}
               </span>
               
               {/* Botón X: Un poco más grande en PC */}
               <button 
                  onClick={() => startClosing(toast.id)} 
                  className="btn btn-xs md:btn-sm btn-ghost btn-circle"
                >
                 <X size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast debe usarse dentro de ToastProvider");
  return context;
};

// Utilidades de Estilo
const getAlertClass = (type: ToastType) => {
  switch (type) {
    case "success": return "alert-success bg-success/10 text-success-content border-success/20";
    case "error": return "alert-error bg-error/10 text-error-content border-error/20";
    case "warning": return "alert-warning bg-warning/10 text-warning-content border-warning/20";
    case "info": return "alert-info bg-info/10 text-info-content border-info/20";
    default: return "alert-info";
  }
};

// Utilidades de Iconos (Hacemos los iconos responsivos aquí también)
const getIcon = (type: ToastType) => {
  // Clase para controlar tamaño: 20px en móvil, 28px en escritorio
  const sizeClass = "w-5 h-5 md:w-7 md:h-7";
  
  switch (type) {
    case "success": return <CheckCircle className={sizeClass} />;
    case "error": return <XCircle className={sizeClass} />;
    case "warning": return <AlertTriangle className={sizeClass} />;
    case "info": return <Info className={sizeClass} />;
  }
};