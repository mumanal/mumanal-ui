import { useAuthStore } from '../stores/useAuthStore'; // Importamos tu store

export const useCheckPermission = (requiredPermission: string): boolean => {
    // 1. Obtenemos el perfil del usuario desde Zustand
    const userProfile = useAuthStore(state => state.userProfile);

    // 2. Si no hay perfil cargado, no tiene permiso
    if (!userProfile) return false;

    // 4. Verificamos si el permiso existe en su lista
    // El "?." evita errores si permissions llegara a ser null/undefined
    return userProfile.permissions?.includes(requiredPermission) || false;
};