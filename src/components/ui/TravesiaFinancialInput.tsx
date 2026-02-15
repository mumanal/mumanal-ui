import { forwardRef, useEffect, useState } from 'react';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    label?: string;
    error?: string;
    value: number;
    onValueChange: (val: number) => void; // ✅ Propiedad personalizada
    prefix?: string;
    shakeKey?: number;
    badge?: React.ReactNode; 
    suffix?: string;
    helperText?: string;
}

export const TravesiaFinancialInput = forwardRef<HTMLInputElement, Props>(
    ({ label, error, value, onValueChange, className, prefix = "Bs.", suffix, badge, helperText, shakeKey, ...props }, ref) => {
        const [isShaking, setIsShaking] = useState(false);
        
        useEffect(() => {
            if (shakeKey && shakeKey > 0) {
                setIsShaking(true);
                const timer = setTimeout(() => setIsShaking(false), 500);
                return () => clearTimeout(timer);
            }
        }, [shakeKey]);

        return (
            <div className={`form-control w-full ${isShaking ? 'animate-shake' : ''}`}>
                {label && (
                    <label className="label py-1">
                        <span className={`label-text font-semibold ${error ? "text-error" : "opacity-70"}`}>
                            {label}
                        </span>
                        {badge && <span className="label-text-alt">{badge}</span>}
                    </label>
                )}
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
                        {prefix}
                    </span>
                    <input
                        ref={ref}
                        type="number"
                        className={`input input-bordered w-full pl-3 font-mono ${error ? 'input-error' : ''} ${className}`}
                        value={value === 0 ? '' : value} // Muestra vacío si es 0 para mejor UX al escribir
                        onChange={(e) => {
                            // ✅ Convertimos el evento a número limpio
                            const val = parseFloat(e.target.value);
                            onValueChange(isNaN(val) ? 0 : val);
                        }}
                        onWheel={(e) => e.currentTarget.blur()} // Evita cambiar valor con scroll del mouse
                        step="0.01"
                        min="0"
                        {...props}
                    />
                    {suffix && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
                            {suffix}
                        </span>
                    )}
                </div>
                <label className="label py-0.5">
                    {error ? (
                        <span className="label-text-alt text-error">{error}</span>
                    ) : (
                        helperText && <span className="label-text-alt opacity-60">{helperText}</span>
                    )}
                </label>
            </div>
        );
    }
);

TravesiaFinancialInput.displayName = "TravesiaFinancialInput";