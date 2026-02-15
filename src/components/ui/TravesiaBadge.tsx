import type { ReactNode } from "react";
import { type BadgeType, getBadgeStyle } from "../../config/badgeConfig";

interface Props {
    label?: string;               // 🟢 Opcional (ahora puede venir en children)
    children?: ReactNode;         // 🟢 Nuevo: Permite usar <Badge>Texto</Badge>
    code?: string | number | boolean; 
    type?: BadgeType;        
    className?: string;      
}

export const TravesiaBadge = ({ label, children, code, type = 'DEFAULT', className = '' }: Props) => {
    // 1. Decidir qué mostrar: Preferimos children, si no hay, usamos label
    const content = children ?? label;

    // 2. Decidir qué código evaluar para el color:
    // Si pasan 'code', usamos eso. Si no, usamos el 'label' como fallback si es texto.
    const codeToEvaluate = code ?? (typeof label === 'string' ? label : undefined);
    
    // 3. Obtener estilos del config
    const colorClass = getBadgeStyle(type, codeToEvaluate ?? '');

    return (
        <span className={`badge ${colorClass} gap-2 px-3 py-3 font-medium border-0 shadow-sm ${className}`}>
            {content}
        </span>
    );
};