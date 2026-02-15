import { forwardRef, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    shakeKey?: number; // Para activar la animación de error
    isRequired?: boolean;
}

export const TravesiaTextarea = forwardRef<HTMLTextAreaElement, Props>(
    ({ label, error, className = "", shakeKey = 0, isRequired, ...props }, ref) => {
        
        // Lógica de animación "Shake" (idéntica a TravesiaInput)
        const [isShaking, setIsShaking] = useState(false);
        useEffect(() => {
            if (shakeKey > 0) {
                setIsShaking(true);
                const timer = setTimeout(() => setIsShaking(false), 500);
                return () => clearTimeout(timer);
            }
        }, [shakeKey]);

        return (
            <div className={`form-control w-full ${isShaking ? 'animate-shake' : ''}`}>
                {/* LABEL */}
                <label className="label py-1">
                    <span className="label-text font-medium flex gap-1">
                        {label}
                        {isRequired && <span className="text-error">*</span>}
                    </span>
                </label>

                {/* TEXTAREA */}
                <textarea
                    ref={ref}
                    className={`
                        textarea textarea-bordered 
                        w-full h-24 
                        focus:border-primary focus:ring-1 focus:ring-primary/20 
                        bg-base-100 text-base-content
                        transition-all duration-200
                        ${error ? 'textarea-error' : 'border-base-300'}
                        ${className}
                    `}
                    {...props}
                />

                {/* MENSAJE DE ERROR */}
                {error && (
                    <label className="label py-1">
                        <span className="label-text-alt text-error flex items-center gap-1">
                            <AlertCircle size={12} />
                            {error}
                        </span>
                    </label>
                )}
            </div>
        );
    }
);

TravesiaTextarea.displayName = "TravesiaTextarea";