import { NavLink, useLocation } from "react-router-dom";
import type { MenuItem } from "../../features/auth/types";
import { IconRenderer } from "../ui/IconRenderer";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ Importar Flechas

// ✅ Modificar el Renderer para que acepte 'isCollapsed'
const MenuItemRenderer = ({ item, isCollapsed }: { item: MenuItem, isCollapsed: boolean }) => {
    const location = useLocation();
    const hasChildren = item.children && item.children.length > 0;
    
    // Lógica active... (igual que antes)
    const isActiveParent = hasChildren && item.children?.some(child => location.pathname.startsWith(child.route));
    const isActiveLink = item.route && location.pathname === item.route;

    // Ajuste de clases base
    const baseLinkClass = `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        text-sm font-medium
        ${isCollapsed ? 'justify-center' : ''} // Centrar si está colapsado
    `;

    // ... lógica de activeLinkClass e inactiveLinkClass igual ...
    const activeLinkClass = "bg-primary/10 text-primary font-bold";
    const inactiveLinkClass = "text-base-content/70 hover:bg-base-200 hover:text-base-content";

// ---------------------------------------------------------
    // CASO A: TIENE HIJOS (ES UN PADRE/GRUPO)
    // ---------------------------------------------------------
    if (hasChildren) {
        
        // --- 1. MODO COLAPSADO (PC): Usamos Dropdown Flotante ---
        // ESTA ES LA PARTE QUE FALTABA EN TU ARCHIVO
        if (isCollapsed) {
            return (
                <li className="mb-1 flex justify-center">
                    {/* 'dropdown-hover' muestra el menú al pasar el mouse. 'dropdown-right' lo saca al lado. */}
                    <div className="dropdown dropdown-hover dropdown-right">
                        
                        {/* TRIGGER: Solo el icono del padre */}
                        <div 
                            tabIndex={0} 
                            role="button" 
                            className={`
                                btn btn-ghost btn-circle
                                ${isActiveParent ? 'text-primary bg-primary/10' : 'text-base-content/70'}
                            `}
                        >
                            <IconRenderer iconName={item.icon} size={22} />
                        </div>

                        {/* CONTENIDO FLOTANTE: Lista de Submenús */}
                        <ul tabIndex={0} className="dropdown-content z-[999] menu p-2 shadow-xl bg-base-100 rounded-box w-56 ml-2 border border-base-200">
                            {/* Título del Grupo */}
                            <li className="menu-title px-4 py-2 text-primary border-b border-base-200 mb-1">
                                {item.name}
                            </li>
                            
                            {/* Lista de Hijos: Usamos recursividad con isCollapsed={false} 
                                para que se vean completos (Icono + Texto) dentro de la burbuja */}
                            {item.children!.map((child) => (
                                <MenuItemRenderer 
                                    key={child.id} 
                                    item={child} 
                                    isCollapsed={false} 
                                />
                            ))}
                        </ul>
                    </div>
                </li>
            );
        }

        // --- 2. MODO EXPANDIDO: Usamos Acordeón (Details) ---
        return (
            <li className="mb-1">
                <details open={isActiveParent} className="group">
                    <summary className={`
                        list-none cursor-pointer flex items-center justify-between
                        ${baseLinkClass} ${isActiveParent ? 'text-primary' : 'text-base-content/80'}
                        hover:bg-base-200
                    `}>
                        <div className="flex items-center gap-3">
                            <IconRenderer iconName={item.icon} size={20} />
                            <span>{item.name}</span>
                        </div>
                        
                    </summary>
                    
                    {/* Lista de hijos (Acordeón) */}
                    <ul className="pl-4 mt-1 border-l-2 border-base-200 ml-6 space-y-1 animate-fade-in">
                        {item.children!.map((child) => (
                            <MenuItemRenderer key={child.id} item={child} isCollapsed={isCollapsed} />
                        ))}
                    </ul>
                </details>
            </li>
        );
    }

    // ---------------------------------------------------------
    // CASO B: ENLACE DIRECTO (SIN HIJOS)
    // ---------------------------------------------------------
    return (
        <li className="mb-1">
            {isCollapsed ? (
                // Colapsado: Tooltip + Icono
                <div 
                    className="tooltip tooltip-right w-full flex justify-center z-50" 
                    data-tip={item.name}
                >
                    <NavLink 
                        to={item.route || "#"}
                        className={({ isActive }) => `
                            btn btn-ghost btn-circle
                            ${isActive ? 'text-primary bg-primary/10' : 'text-base-content/70'}
                        `}
                    >
                        <IconRenderer iconName={item.icon} size={22} />
                    </NavLink>
                </div>
            ) : (
                // Expandido: Icono + Texto + Indicador Activo
                <NavLink 
                    to={item.route || "#"}
                    className={({ isActive }) => `
                        ${baseLinkClass}
                        ${isActive ? activeLinkClass : inactiveLinkClass}
                    `}
                >
                    <IconRenderer iconName={item.icon} size={20} />
                    <span>{item.name}</span>
                    {isActiveLink && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"></span>
                    )}
                </NavLink>
            )}
        </li>
    );
};

// ✅ Nueva Interface de Props
interface Props {
    menuTree: MenuItem[];
    isLoading: boolean;
    isCollapsed: boolean;      // Nuevo
    toggleCollapse: () => void; // Nuevo
}

export const SidebarMenu = ({ menuTree, isLoading, isCollapsed, toggleCollapse }: Props) => {
    if (isLoading) return <div className="p-4 space-y-4">Cargando...</div>;

    return (
        <aside className={`
            bg-base-100 h-full flex flex-col border-r border-base-300 transition-all duration-300 ease-in-out z-40
            ${isCollapsed ? 'w-20' : 'w-72'} // Ancho dinámico
        `}>
            {/* 1. HEADER (Logo) */}
            <div className={`h-16 flex items-center gap-3 px-6 border-b border-base-300 bg-base-200 shrink-0 ${isCollapsed ? 'justify-center px-0' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content font-bold shadow-lg shadow-primary/40 shrink-0">
                    T
                </div>
                {!isCollapsed && <span className="text-xl font-bold tracking-wide text-base-content animate-fade-in">Travesia</span>}
            </div>

            {/* 2. AREA SCROLLABLE */}
            <div className={`
                flex-1 py-4 
                ${isCollapsed ? 'overflow-visible px-2' : 'overflow-y-auto overflow-x-hidden px-4 no-scrollbar'}
            `}>
                <ul className="menu px-2 w-full">
                    {Array.isArray(menuTree) && menuTree.map((item) => (
                        <MenuItemRenderer key={item.id} item={item} isCollapsed={isCollapsed} />
                    ))}
                </ul>
            </div>

            {/* 3. FOOTER (Versión Centrada + Botón a la Derecha) */}
            <div className={`
                p-4 border-t border-base-300 bg-base-100 shrink-0 flex items-center relative
                ${isCollapsed ? 'justify-center' : 'justify-end'}
            `}>
                
                {/* TEXTO VERSIÓN: Posicionamiento Absoluto para estar SIEMPRE en el centro */}
                {!isCollapsed && (
                    <p className="absolute left-1/2 transform -translate-x-1/2 text-xs opacity-50 animate-fade-in font-mono whitespace-nowrap">
                        v1.0.0 Enterprise
                    </p>
                )}

                {/* BOTÓN FLECHA: Se queda a la derecha gracias al 'justify-end' del padre */}
                <button 
                    onClick={toggleCollapse}
                    className="btn btn-sm btn-circle btn-ghost hidden lg:flex border border-base-300 hover:bg-base-200 z-10"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>
        </aside>
    );
};