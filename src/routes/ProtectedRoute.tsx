import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    // Si NO está autenticado, lo mandamos al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si SI está autenticado, dejamos pasar a las rutas hijas (Dashboard, Ventas, etc)
    return <Outlet />;
};