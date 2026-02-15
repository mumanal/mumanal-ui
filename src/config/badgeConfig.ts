// Definimos los tipos de badges que soportará tu sistema
export type BadgeType = 
    | 'PRODUCT_CATEGORY' 
    | 'PROVIDER_STATUS' 
    | 'RESERVATION_STATUS' 
    | 'TRANSACTION_STATUS' 
    | 'DEFAULT';

// Definimos el mapa de colores. 
// La clave interna puede ser el ID numérico (code) o un string clave.
export const BADGE_STYLES: Record<BadgeType, Record<string | number, string>> = {
    
    // 1. CATEGORÍAS DE PRODUCTO (Usamos los códigos que me mostraste: 601, 602, 603)
    PRODUCT_CATEGORY: {
        601: "badge-primary text-primary-content",   // Electrónica / General -> Azul/Primario
        602: "badge-secondary text-secondary-content", // Hospedaje -> Rosa/Secundario
        603: "badge-accent text-accent-content",     // Transporte -> Turquesa/Acento
        // Puedes agregar más códigos aquí...
        default: "badge-ghost"
    },

    PROVIDER_STATUS: {
        121: "badge-warning text-white", // Pendiente
        122: "badge-success text-white", // Confirmada
        123: "badge-error text-white",   // Cancelada
        124: "badge-ghost",              // Inactiva
        default: "badge-ghost"
    },

    // 3. TRANSACCIONES (Ejemplo futuro)
    TRANSACTION_STATUS: {
        501: "badge-warning text-white",      // Pendiente
        502: "badge-success text-white",      // Confirmado
        503: "badge-error text-white",        // Rechazado
        504: "badge-info text-white",         // Devolución
    },
    
    RESERVATION_STATUS: {
        101: "badge-warning text-white",      // Pendiente Pago (Amarillo)
        102: "badge-success text-white",      // Confirmada (Verde)
        103: "badge-error text-white",        // Cancelada (Rojo)
        104: "border-orange-500 bg-orange-50 text-orange-600", // Expirada (Naranja custom)
        105: "badge-info text-white",         // Completada (Azul)
        default: "badge-ghost"
    },

    DEFAULT: {
        default: "badge-ghost"
    }
};

// Helper para obtener el estilo de forma segura
export const getBadgeStyle = (type: BadgeType, code: string | number | boolean): string => {
    const group = BADGE_STYLES[type] || BADGE_STYLES.DEFAULT;
    
    // Convertimos booleanos a 1/0 para estandarizar si fuera necesario
    const safeCode = typeof code === 'boolean' ? (code ? 1 : 0) : code;

    return group[safeCode] || group['default'] || "badge-ghost";
};