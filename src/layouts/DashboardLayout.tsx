import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarMenu } from "../components/layout/SidebarMenu";
import { getMyMenuTree } from "../services/menuService";
import type { MenuItem } from "../features/auth/types";
import { Header } from "../components/layout/Header"; 
import { useAuthStore } from "../stores/useAuthStore"; 

export const DashboardLayout = () => {
  // 1. Lógica de Datos (Lo que ya tenías)
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const fetchUserProfile = useAuthStore(state => state.fetchUserProfile);

  // 2. NUEVA LÓGICA VISUAL (Para el colapso en PC)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Carga de Menú
    getMyMenuTree()
        .then(setMenuTree)
        .finally(() => setLoadingMenu(false));

    // Carga de Perfil
    fetchUserProfile();
  }, []); 

  return (
    // 'lg:drawer-open' mantiene el sidebar siempre visible en PC
    <div className="drawer lg:drawer-open bg-base-100 min-h-screen font-sans">
      
      {/* IMPORTANTE: El id debe ser "my-drawer" para que coincida 
         con el htmlFor del botón hamburguesa que pusimos en el Header 
      */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* --- CONTENIDO DERECHO (Header + Página) --- */}
      <div className="drawer-content flex flex-col h-screen overflow-hidden">
        
        {/* El Header ahora tiene el botón hamburguesa integrado */}
        <Header />

        {/* Área de contenido con scroll independiente */}
        <main className="flex-1 overflow-y-auto bg-base-200/50 p-4 md:p-6 relative fade-in">
            <Outlet /> 
        </main>
      </div> 
      
      {/* --- SIDEBAR IZQUIERDO --- */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label> 
        
        {/* Pasamos los nuevos props de colapso al SidebarMenu */}
        <SidebarMenu 
            menuTree={menuTree} 
            isLoading={loadingMenu} 
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>
    </div>
  );
};