import { Save, X, Trash2, Pencil, FileSpreadsheet, FileText, Plus, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { TravesiaButton } from "./TravesiaButton";

// Tipos para pasar props extra (como onClick)
interface BaseBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    label?: string; // Por si quieres sobreescribir el texto por defecto
    responsive?: boolean
}

// 1. BOTÓN GUARDAR (Verde + Icono Save)
export const BtnSave = ({ label = "Guardar", responsive = true, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="save" 
        label={label} 
        icon={<Save size={18} />} 
        responsive={responsive}
        {...props} 
    />
);

// 2. BOTÓN CANCELAR (Rojo + Icono X)
export const BtnCancel = ({ label = "Cancelar", responsive = true, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="cancel" 
        label={label} 
        icon={<X size={18} />} 
        responsive={responsive}
        {...props} 
    />
);

// 3. BOTÓN EDITAR (Azul + Lapiz + Redondo)
export const BtnEdit = (props: BaseBtnProps) => (
    <TravesiaButton 
        variant="edit" 
        isIconOnly 
        icon={<Pencil size={16} />} 
        {...props} 
    />
);

// 4. BOTÓN ELIMINAR TABLA (Rojo + Basurero + Redondo)
export const BtnDeleteIcon = (props: BaseBtnProps) => (
    <TravesiaButton 
        variant="delete" 
        isIconOnly 
        icon={<Trash2 size={16} />} 
        {...props} 
    />
);


// 5. BOTÓN ELIMINAR NORMAL (Con texto, para confirmaciones)
export const BtnDelete = ({ label = "Eliminar", responsive = true, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="delete" 
        label={label}
        icon={<Trash2 size={18} />} 
        responsive={responsive}
        {...props} 
    />
);

// 6. REPORTES
export const BtnExcel = ({ label = "Exportar Excel", responsive = true, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="excel" 
        label={label}
        icon={<FileSpreadsheet size={18} />} 
        responsive={responsive}
        {...props} 
    />
);

export const BtnPDF = ({ label = "Exportar PDF", responsive = true, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="pdf" 
        label={label}
        icon={<FileText size={18} />} 
        responsive={responsive}
        {...props} 
    />
);

// 7. TABLAS
export const BtnCreate = ({ label = "Adicionar", responsive = false, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="create" 
        label={label}
        icon={<Plus size={18} />} 
        responsive={responsive}
        {...props} 
    />
);

// ==========================================
// BOTONES DE SISTEMA (Login, Modales, etc)
// ==========================================

// 7. LOGIN (Morado Primario, Ancho completo, Sin ícono)
export const BtnLogin = ({ label = "Ingresar", ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="primary" // Usa el color principal del tema (Morado)
        label={label}
        fullWidth // Generalmente el login ocupa todo el ancho
        // No pasamos 'icon', y como 'primary' no tiene icono por defecto, sale limpio
        {...props} 
    />
);

// 8. MODAL: CONFIRMACIÓN DESTRUCTIVA (Rojo, Sin ícono)
export const BtnModalYes = ({ label = "Sí, Confirmar", ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="delete" // Reusamos el rojo corporativo
        label={label}
        icon={null} // <--- TRUCO: Pasamos null explícitamente para anular el basurero automático
        {...props} 
    />
);

// 9. MODAL: CANCELAR / NEUTRO (Gris/Transparente, Sin ícono)
export const BtnModalNo = ({ label = "No, Cancelar", ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="ghost" // O 'neutral' si lo quieres con fondo gris
        label={label}
        icon={null} // Sin ícono de X
        className="border border-base-300" // Un borde sutil para que parezca botón
        {...props} 
    />
);

/**
 * 11. COMPONENTE AGRUPADOR PARA TABLAS
 * Este es el que faltaba y causaba el error de importación.
 */
interface CrudButtonsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export const CrudButtons = ({ onEdit, onDelete }: CrudButtonsProps) => {
    return (
        <div className="flex justify-end gap-2">
            <BtnEdit onClick={onEdit} />
            <BtnDeleteIcon onClick={onDelete} />
        </div>
    );
};

// 13. BOTÓN ATRÁS (Ghost + Flecha Izquierda) - Para Wizards
export const BtnBack = ({ label = "Atrás", responsive = true, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="steps" 
        label={label} 
        responsive={responsive}
        icon={<ArrowLeft size={18} />} 
        {...props} 
    />
);

// 14. BOTÓN SIGUIENTE (Primario + Flecha Derecha) - Para Wizards
export const BtnNext = ({ label = "Siguiente", responsive = true, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="steps" 
        label={label} 
        responsive={responsive}
        // Nota: Por defecto el icono va a la izquierda. 
        // Si quisieras el icono a la derecha, tendrías que ajustar TravesiaButton, 
        // pero por consistencia lo dejaremos a la izquierda como el resto del sistema.
        icon={<ArrowRight size={18} />} 
        {...props} 
    />
);

// 15. BOTÓN CAMBIAR (Blanco, ideal para overlays de imágenes)
export const BtnChange = ({ label = "Cambiar", responsive = true, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="overlay" 
        label={label} 
        icon={<RefreshCw size={16} />} 
        responsive={responsive}
        {...props} 
    />
);

// 16. BOTÓN QUITAR (Rojo Error + X, para quitar de una lista o uploader)
export const BtnRemove = ({ label = "Quitar", responsive = true, ...props }: BaseBtnProps) => (
    <TravesiaButton 
        variant="overlay" 
        label={label} 
        icon={<X size={16} />} 
        responsive={responsive}
        {...props} 
    />
);