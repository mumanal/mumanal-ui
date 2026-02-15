import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { UnderConstruction } from "../components/ui/UnderConstruction";
// Importamos la nueva página
import { useTheme } from "../hooks/useTheme"; 
import { VouchersPage } from "../features/finance/pages/VouchersPage";

export const AppRouter = () => {
  useTheme(); 
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
            
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* --- FINANZAS --- */}
                <Route path="/finance/voucher" element={<VouchersPage />}/>

                {/* --- MÓDULO SEGURIDAD --- */}
                {/* <Route element={<PermissionGuard code="SEC_VIEW" />}>
                    <Route path="/security/users" element={<UsersPage />} />
                </Route> */}

                {/* Ruta Comodín: Cualquier otra ruta muestra "En Construcción" */}
                <Route path="*" element={<UnderConstruction />} />

            </Route>

        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};