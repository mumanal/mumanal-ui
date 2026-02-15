import type { ReactNode } from "react";
import { TravesiaModal } from "./TravesiaModal";
import { TravesiaButton } from "./TravesiaButton";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

type ModalVariant = "danger" | "warning" | "info" | "success" | "primary";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: ModalVariant;
    isLoading?: boolean;
}

export const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Confirmar", 
    cancelText = "Cancelar", 
    variant = "danger",
    isLoading = false
}: Props) => {

    // Configuración visual según el tipo de alerta
    const getConfig = () => {
        switch (variant) {
            case "danger":
                return {
                    icon: <AlertTriangle size={48} className="text-error" />,
                    btnVariant: "delete" as const, // Rojo
                    bgColor: "bg-error/10"
                };
            case "warning":
                return {
                    icon: <AlertTriangle size={48} className="text-warning" />,
                    btnVariant: "warning" as const, // Amarillo
                    bgColor: "bg-warning/10"
                };
            case "success":
                return {
                    icon: <CheckCircle size={48} className="text-success" />,
                    btnVariant: "success" as const, // Verde
                    bgColor: "bg-success/10"
                };
            default: // info
                return {
                    icon: <Info size={48} className="text-info" />,
                    btnVariant: "primary" as const, // Azul/Morado
                    bgColor: "bg-info/10"
                };
        }
    };

    const config = getConfig();

    return (
        <TravesiaModal
            isOpen={isOpen}
            onClose={onClose}
            closeOnOutsideClick={true}
            title="" // Dejamos vacío el título del header estándar para personalizar el cuerpo
            size="sm" // Pequeño y centrado
        >
            <div className="flex flex-col items-center text-center p-2 space-y-4">
                {/* Círculo con Icono */}
                <div className={`p-4 rounded-full ${config.bgColor} mb-2 animate-bounce-short`}>
                    {config.icon}
                </div>

                {/* Textos */}
                <h3 className="text-xl font-bold text-base-content">{title}</h3>
                <div className="text-base-content/70 text-sm">
                    {message}
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3 w-full justify-center mt-6 pt-2">
                    <TravesiaButton 
                        variant="ghost" 
                        label={cancelText} 
                        onClick={onClose} 
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <TravesiaButton 
                        variant={config.btnVariant} 
                        label={confirmText} 
                        onClick={onConfirm} 
                        isLoading={isLoading}
                        className="flex-1"
                    />
                </div>
            </div>
        </TravesiaModal>
    );
};