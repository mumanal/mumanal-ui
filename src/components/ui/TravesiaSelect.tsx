import React from "react";

export interface SelectOption {
    value: string | number;
    label: string;
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  isLoading?: boolean;
  enableDefaultOption?: boolean; // 1. NUEVA PROPIEDAD
  isRequired?: boolean;
  shakeKey?: number; // NUEVA PROP
}

export const TravesiaSelect = ({ 
    label, options, error, isLoading, isRequired, shakeKey,
    placeholder = "Seleccione...", 
    enableDefaultOption = false,
    ...props 
}: Props) => {
  return (
    <div 
      key={error && shakeKey ? `err-${shakeKey}` : undefined}
      className={`form-control w-full ${error ? "animate-shake" : ""}`}
    >
      <label className="label">
        <span className={`label-text font-semibold flex gap-1 ${error ? "text-error" : ""}`}>
            {label}
            {isRequired && <span className="text-error">*</span>}
        </span>
      </label>
      
      <select 
        className={`select select-bordered w-full ${error ? "select-error bg-error/5" : ""}`} 
        disabled={isLoading}
        {...props}
      >
        {/* ... lógica de opciones (mantenla igual) ... */}
         <option disabled={isLoading || !enableDefaultOption} value="">
            {isLoading ? "Cargando datos..." : placeholder}
        </option>
        
        {!isLoading && options.map((opt) => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
      </select>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error font-medium">{error}</span>
        </label>
      )}
    </div>
  );
};