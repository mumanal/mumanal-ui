import { useAuthStore } from "../stores/useAuthStore";

export const usePermission = () => {
    const userProfile = useAuthStore(state => state.userProfile);

    /**
     * Verifica si el usuario tiene un permiso específico.
     * Ejemplo: can('POS_SALE_CREATE')
     */
    const can = (permissionCode: string): boolean => {
        // Si no ha cargado el perfil, asumimos falso por seguridad
        if (!userProfile) return false;

        // Si es Super Admin (ROOT), suele tener acceso a todo (Opcional, según tu lógica)
        if (userProfile.roles.includes('ROOT')) return true;

        // Verificamos si el string existe en el array de permisos
        return userProfile.permissions.includes(permissionCode);
    };

    /**
     * Verifica si tiene AL MENOS UNO de los permisos (OR)
     */
    const canAny = (permissions: string[]): boolean => {
        if (!userProfile) return false;
        if (userProfile.roles.includes('ROOT')) return true;
        
        return permissions.some(p => userProfile.permissions.includes(p));
    };

    return { can, canAny, role: userProfile?.roles[0] };
};