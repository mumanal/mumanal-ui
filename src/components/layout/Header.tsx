import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useCurrentTime } from "../../hooks/useCurrentTime";
import { Bell, LogOut, User as UserIcon, Settings, Shield, HelpCircle, Menu } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { 
    BtnModalYes, 
    BtnModalNo 
} from "../ui/CrudButtons";

export const Header = () => {
  const userProfile = useAuthStore((state) => state.userProfile);
  const logout = useAuthStore((state) => state.logout);
  const currentTime = useCurrentTime();
  const navigate = useNavigate();

  const initials = userProfile?.firstName 
    ? `${userProfile.firstName[0]}${userProfile.paternalLastName?.[0] || ''}`
    : "US";

  const openLogoutModal = () => {
    const modal = document.getElementById('logout_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
  };

  // Función auxiliar para cerrar el menú manualmente al hacer clic en un link
  // (Aunque el comportamiento nativo de perder foco suele hacerlo, esto asegura UX perfecta)
  const closeDropdown = () => {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  };

  return (
    <>
      <div className="navbar bg-base-100 px-6 py-4 border-b border-base-200 justify-between sticky top-0 z-30 shadow-sm">
        
        {/* IZQUIERDA */}
        <div className="flex items-center gap-4">
            
            {/* ✅ NUEVO: BOTÓN HAMBURGUESA (Solo visible en Móvil 'lg:hidden') */}
            {/* Este label busca un input con id="my-drawer" que pondremos en el Layout */}
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost lg:hidden text-base-content">
                <Menu size={24} />
            </label>

            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-base-content">
                    Hola, {userProfile?.firstName || 'Usuario'}
                </h1>
                <p className="text-sm text-base-content/60 font-medium mt-1 capitalize">
                    {currentTime}
                </p>
            </div>
        </div>
        
        {/* DERECHA */}
        <div className="flex items-center gap-4">
          
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell className="w-6 h-6" />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>

          <div className="h-8 w-px bg-base-300 mx-2"></div>

          {/* --- DROPDOWN (MODO CLICK) --- */}
          {/* Quitamos 'dropdown-hover' y 'group' */}
          <div className="dropdown dropdown-end">
            
            {/* TRIGGER */}
            <label tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder ring-2 ring-transparent hover:ring-primary transition-all">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                {userProfile?.imageUrl ? (
                     <img src={userProfile.imageUrl} alt="Avatar" />
                ) : (
                    <span className="text-xl">{initials}</span>
                )}
              </div>
            </label>

            {/* CONTENIDO */}
            {/* Quitamos los hacks de 'before:' y ajustamos mt */}
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-64 border border-base-200">
              
              <li className="menu-title px-4 py-2">
                <span className="block text-sm font-bold text-base-content">
                    {userProfile?.fullName}
                </span>
                <span className="block text-xs font-normal opacity-50 truncate">
                    {userProfile?.email}
                </span>
              </li>

              <div className="divider my-0"></div>

              <li>
                <Link to="/profile" className="py-3" onClick={closeDropdown}>
                  <UserIcon size={18} />
                  Mi Perfil
                  <span className="badge badge-ghost badge-sm ml-auto">Editar</span>
                </Link>
              </li>

              <li>
                <Link to="/settings" className="py-3" onClick={closeDropdown}>
                  <Settings size={18} />
                  Configuración
                </Link>
              </li>

              <li>
                <Link to="/security/audit" className="py-3" onClick={closeDropdown}>
                  <Shield size={18} />
                  Actividad
                </Link>
              </li>

              <div className="divider my-0"></div>

              {/* TEMA (Con el toggle corregido) */}
              <li>
                <div className="py-3 flex justify-between active:bg-transparent hover:bg-transparent cursor-default">
                   <div className="flex items-center gap-2">
                        <HelpCircle size={18} className="opacity-0" /> 
                        <span className="-ml-6">Tema</span>
                   </div>
                   {/* stopPropagation evita que el clic en el switch cierre el menú */}
                   <div onClick={(e) => e.stopPropagation()}> 
                      <ThemeToggle />
                   </div>
                </div>
              </li>

              <div className="divider my-0"></div>

              <li>
                <button 
                    onClick={() => { closeDropdown(); openLogoutModal(); }} 
                    className="text-error hover:bg-error/10 hover:text-error py-3 font-bold"
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MODAL LOGOUT (Sin cambios) */}
      <dialog id="logout_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error flex items-center gap-2">
            <LogOut /> ¿Cerrar Sesión?
          </h3>
          <p className="py-4">
            ¿Estás seguro de que quieres salir del sistema?
          </p>
          <div className="modal-action">
            {/* Opción NO (Cierra el modal) */}
            <form method="dialog">
              <BtnModalNo label="No, Cancelar" />
            </form>
            
            {/* Opción SI (Ejecuta la acción) */}
            <BtnModalYes 
                label="Sí, Cerrar Sesión" 
                onClick={handleConfirmLogout} 
            />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
      </dialog>
    </>
  );
};