import { create } from 'zustand';
import api from '../lib/axios';
import type { UserProfile } from '../features/auth/types'; // Importa UserProfile

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    userProfile: UserProfile | null; // Aquí guardaremos la info completa del backend
    
    // Acciones
    login: (token: string) => void;
    logout: () => void;
    fetchUserProfile: () => Promise<void>; // Nueva acción
}

export const useAuthStore = create<AuthState>((set) => {
    // Recuperación inicial del token
    const storedToken = localStorage.getItem('token');
    
    return {
        token: storedToken,
        isAuthenticated: !!storedToken, // True si hay token
        userProfile: null, // Al inicio es null hasta que lo pidamos

        login: (token: string) => {
            localStorage.setItem('token', token);
            set({ token, isAuthenticated: true });
            // Opcional: Podrías llamar a get().fetchUserProfile() aquí mismo
        },

        logout: () => {
            localStorage.removeItem('token');
            set({ token: null, isAuthenticated: false, userProfile: null });
        },

        fetchUserProfile: async () => {
            try {
                // Llamamos a tu endpoint nuevo
                const { data } = await api.get<UserProfile>('/auth/profile');
                set({ userProfile: data });
            } catch (error) {
                console.error("Error cargando perfil", error);
                // Si falla el perfil (ej: token inválido), podríamos hacer logout automático
                // get().logout(); 
            }
        }
    };
});