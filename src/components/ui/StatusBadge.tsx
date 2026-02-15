import { PROVIDER_STATUS_ID } from "../../config/constants"; // Asegúrate que la ruta sea correcta

interface Props {
    statusName: string;
    statusCode: number; // Ahora es obligatorio para usar la lógica robusta
}

export const StatusBadge = ({ statusName, statusCode }: Props) => {
    
    let colorClass = "badge-ghost"; // Color por defecto (Gris suave)

    switch (statusCode) {
        case PROVIDER_STATUS_ID.CONFIRMED:
            colorClass = "badge-success text-white"; // Verde
            break;
            
        case PROVIDER_STATUS_ID.PENDING:
            colorClass = "badge-warning text-white"; // Amarillo
            break;
            
        case PROVIDER_STATUS_ID.CANCELLED:
            colorClass = "badge-error text-white"; // Rojo
            break;
            
        case PROVIDER_STATUS_ID.INACTIVE:
            // Gris oscuro para inactivos (solicitado anteriormente)
            colorClass = "bg-base-300 text-base-content/60 border-0"; 
            break;
            
        default:
            // Si llega un código nuevo que no conocemos, se queda gris
            colorClass = "badge-ghost opacity-50"; 
            break;
    }

    return (
        <span className={`badge ${colorClass} gap-2 px-3 py-3 border-0 font-medium`}>
            {statusName}
        </span>
    );
};