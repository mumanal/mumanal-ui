import React, { forwardRef } from "react";
import { IconRenderer } from "./IconRenderer";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  isRequired?: boolean; // NUEVA PROPIEDAD
  shakeKey?: number; // NUEVA PROP
  helperText?: React.ReactNode;
  uppercase?: boolean;
}

export const TravesiaInput = forwardRef<HTMLInputElement, Props>(({ 
  label, error, icon, isRequired, shakeKey, helperText, uppercase, className = "", 
  onChange, onBlur, ...props 
}, ref) => {

  // Interceptamos el evento onChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uppercase && e.target.value) {
      e.target.value = e.target.value.toUpperCase(); // Fuerza mayúscula en tiempo real
    }
    if (onChange) onChange(e); // Llama al onChange original de react-hook-form
  };

  // Interceptamos el evento onBlur (cuando quita el foco)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      e.target.value = e.target.value.trim(); // Limpia espacios al inicio y final
      if (uppercase) e.target.value = e.target.value.toUpperCase();
    }
    if (onBlur) onBlur(e); // Llama al onBlur original de react-hook-form
  };

  return (
    <div 
      key={error && shakeKey ? `err-${shakeKey}` : undefined}
      className={`form-control w-full ${error ? "animate-shake" : ""}`}
    >
      {label && (
        <label className="label">
          <span className={`label-text font-semibold flex gap-1 ${error ? "text-error" : ""}`}>
              {label}
              {/* Indicador visual de requerido */}
              {isRequired && <span className="text-error" title="Campo obligatorio">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          className={`
            input input-bordered w-full 
            ${error ? "input-error bg-error/5" : ""} 
            ${icon ? "pl-10" : ""} 
            ${className}
          `}
          onChange={handleChange} // Usamos nuestro handler
          onBlur={handleBlur}     // Usamos nuestro handler
          onWheel={(e) => {
            if (props.type === "number") {
                (e.target as HTMLInputElement).blur();
            }
          }}
          {...props}
        />

        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-base-content/50">
             <IconRenderer iconName={icon} size={18} />
          </div>
        )}
      </div>

      {helperText && (
                    <label className="label pb-0">
                        <span className="label-text-alt text-base-content/60">{helperText}</span>
                    </label>
                )}

      {error && (
        <label className="label">
          <span className="label-text-alt text-error font-medium">{error}</span>
        </label>
      )}
    </div>
  );
});

TravesiaInput.displayName = "TravesiaInput";