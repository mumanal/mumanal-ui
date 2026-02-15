interface Props {
    checked: boolean;
    onChange: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const TravesiaSwitch = ({ checked, onChange, isLoading = false, disabled = false }: Props) => {
    // Si está cargando o deshabilitado, bloqueamos el clic
    const isInteractive = !isLoading && !disabled;

    return (
        <div 
            onClick={isInteractive ? onChange : undefined}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer border-2
                ${/* COLOR DE FONDO (TRACK) */ ""}
                ${checked 
                    ? 'bg-success border-success' // ENCENDIDO: Verde
                    : 'bg-base-300 border-base-300 hover:bg-base-400' // APAGADO: Gris claro (o usa bg-error si quieres rojo intenso)
                } 
                ${!isInteractive ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title={checked ? "Activo" : "Inactivo"}
        >
            {/* CÍRCULO INTERNO (THUMB) */}
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300
                    ${checked ? 'translate-x-6' : 'translate-x-1'}
                    ${isLoading ? 'animate-pulse' : ''}
                `}
            />
            
            {/* (Opcional) Iconos dentro del switch para más claridad visual */}
            {/* <span className={`absolute text-[7px] font-bold text-white left-1.5 ${checked ? 'opacity-100' : 'opacity-0'}`}>
                ON
            </span>
            <span className={`absolute text-[7px] font-bold text-base-content/50 right-1.5 ${!checked ? 'opacity-100' : 'opacity-0'}`}>
                OFF
            </span> */}
        </div>
    );
};