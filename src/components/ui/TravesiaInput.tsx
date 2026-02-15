import React from "react";
import { IconRenderer } from "./IconRenderer";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  isRequired?: boolean; // NUEVA PROPIEDAD
  shakeKey?: number; // NUEVA PROP
  helperText?: string;
}

export const TravesiaInput = ({ label, error, icon, isRequired, shakeKey, helperText, className = "", ...props }: Props) => {
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
          className={`
            input input-bordered w-full 
            ${error ? "input-error bg-error/5" : ""} 
            ${icon ? "pl-10" : ""} 
            ${className}
          `}
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
};