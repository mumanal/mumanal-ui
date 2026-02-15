import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import { Calendar, X } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import type { ReactNode } from "react";

// Registramos español
registerLocale("es", es);

interface Props {
    label: string;
    name: string;
    control: Control<any>;
    placeholder?: string;
    helperText?: ReactNode;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    isBirthDate?: boolean; // Activa modo "Cumpleaños"
}

export const TravesiaDateTimePicker = ({
    label,
    name,
    control,
    placeholder = "Seleccione una fecha...",
    helperText,
    disabled,
    minDate,
    maxDate,
    isBirthDate = false,
}: Props) => {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-bold text-base-content/70">{label}</span>
            </label>

            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <div className="relative group">
                        {/* Icono Izquierda */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-10 pointer-events-none">
                            <Calendar size={18} />
                        </div>

                        <DatePicker
                            selected={value ? new Date(value) : null}
                            onChange={(date: Date | null) => {
                                if (date) {
                                    const dateToSave = new Date(date);
                                    // Si NO es cumpleaños, guardamos fin del día (vencimientos)
                                    // Si ES cumpleaños, guardamos la fecha tal cual (00:00:00)
                                    if (!isBirthDate) {
                                        dateToSave.setHours(23, 59, 59, 999);
                                    }
                                    onChange(dateToSave.toISOString());
                                } else {
                                    onChange(null);
                                }
                            }}
                            // --- Configuración Visual ---
                            showTimeSelect={false}
                            dateFormat="dd 'de' MMMM, yyyy"
                            locale="es"
                            placeholderText={placeholder}
                            disabled={disabled}
                            
                            // --- Límites y Navegación ---
                            minDate={minDate} 
                            maxDate={maxDate}
                            
                            // ✅ NAVEGACIÓN ENTRE AÑOS (SOLUCIÓN)
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select" // Muestra <select> nativo (Ideal para ir a 1990 rápido)
                            yearDropdownItemNumber={100} // Rango de 100 años
                            scrollableYearDropdown={false} // False para usar el select nativo
                            
                            // ✅ SOLUCIÓN AL CORTE (PORTAL)
                            // Renderiza el calendario en el <body> directamente
                            portalId="root"
                            popperProps={{ strategy: "fixed" }}
                            popperClassName="!z-[99999]" // Z-Index superior al modal
                            
                            // --- Estilos ---
                            className={`
                                input input-bordered w-full pl-10 pr-10 text-sm font-medium
                                focus:outline-none focus:border-primary transition-all
                                ${error ? "input-error" : ""}
                                ${disabled ? "bg-base-200 cursor-not-allowed" : "bg-base-100"}
                            `}
                            wrapperClassName="w-full"
                            calendarClassName="shadow-3xl border-0 font-sans rounded-xl overflow-hidden !bg-base-100 !text-base-content !border-base-300"
                            dayClassName={() => "hover:!bg-primary hover:!text-primary-content rounded-full"}
                        />

                        {/* Botón Limpiar */}
                        {value && !disabled && (
                            <button
                                type="button"
                                onClick={() => onChange(null)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-error transition-colors p-1"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                )}
            />

            {helperText && (
                <label className="label pb-0">
                    <span className="label-text-alt text-base-content/60">{helperText}</span>
                </label>
            )}
        </div>
    );
};