import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; 
import { ChevronDown, Check, Search } from "lucide-react";

export interface RichOption {
    value: number | string;
    label: string;
    subtitle?: string;
    icon?: React.ReactNode;
    rightContent?: React.ReactNode; // ✅ NUEVO: Para el Badge de estado
}

interface Props {
    label: string;
    placeholder?: string;
    options: RichOption[];
    value?: number | string | null;
    onChange: (value: number | string) => void;
    error?: string;
    isLoading?: boolean;
    icon?: React.ReactNode;
    shakeKey?: number;
}

export const RichSelect = ({ label, placeholder, options, value, onChange, error, isLoading, icon, shakeKey = 0 }: Props) => {
    // ... (Estados y Refs se mantienen igual) ...
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0, width: 0 });
    const [isShaking, setIsShaking] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ... (Toda la lógica de useEffects, shake y updatePosition se mantiene IGUAL) ...
    useEffect(() => {
        if (shakeKey > 0) {
            setIsShaking(false);
            const startTimer = setTimeout(() => setIsShaking(true), 10);
            const endTimer = setTimeout(() => setIsShaking(false), 510);
            return () => { clearTimeout(startTimer); clearTimeout(endTimer); };
        }
    }, [shakeKey]);

    useEffect(() => {
        if (!isOpen) return;
        const handleScrollOrResize = () => updatePosition();
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuCoords({
                top: rect.bottom + window.scrollY + 6,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    const handleOpen = () => {
        if (!isOpen && !isLoading) {
            updatePosition();
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
            dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    // Filtros
    const selectedOption = options.find(opt => opt.value === value);
    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
        opt.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Render del menú
    const menuContent = (
        <div 
            ref={dropdownRef}
            className="fixed z-[10000] bg-base-100 border border-base-200 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up"
            style={{ top: menuCoords.top, left: menuCoords.left, width: menuCoords.width, maxHeight: '300px' }}
        >
            <div className="p-2 border-b border-base-200 bg-base-100 z-10">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"/>
                    <input 
                        type="text" 
                        className="input input-sm input-ghost w-full pl-9 bg-base-200/50 focus:bg-base-100 text-sm"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>
            <div className="overflow-y-auto custom-scrollbar p-1">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                                setSearchTerm("");
                            }}
                            className={`
                                w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group transition-colors
                                ${value === opt.value ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'}
                            `}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                {opt.icon && <span className="opacity-70">{opt.icon}</span>}
                                <div className="flex-1 min-w-0">
                                    <div className={`font-semibold text-sm ${value === opt.value ? 'font-bold' : ''}`}>
                                        {opt.label}
                                    </div>
                                    {opt.subtitle && (
                                        <div className="text-[10px] opacity-60 group-hover:opacity-80 leading-tight truncate">
                                            {opt.subtitle}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* ✅ AQUI MOSTRAMOS EL BADGE A LA DERECHA */}
                            <div className="flex items-center gap-2 pl-2">
                                {opt.rightContent}
                                {value === opt.value && <Check size={16} />}
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="p-4 text-center text-xs opacity-50">No hay resultados</div>
                )}
            </div>
        </div>
    );

    return (
        <div className={`form-control w-full ${isShaking ? 'animate-shake' : ''}`}>
            <label className="label">
                <span className="label-text font-medium flex items-center gap-2">{icon} {label}</span>
            </label>
            <div className="relative">
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleOpen}
                    disabled={isLoading}
                    className={`
                        w-full text-left bg-base-100 border rounded-xl px-4 py-3 flex items-center justify-between transition-all
                        ${error ? 'border-error ring-1 ring-error' : 'border-base-300 hover:border-primary focus:ring-2 focus:ring-primary/20'}
                        ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}
                        ${isLoading ? 'opacity-60 cursor-wait' : ''}
                    `}
                >
                    {selectedOption ? (
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-base-content truncate">{selectedOption.label}</span>
                                {selectedOption.subtitle && <span className="text-xs text-base-content/60 truncate">{selectedOption.subtitle}</span>}
                            </div>
                            {/* También mostramos el badge si ya está seleccionado */}
                            {selectedOption.rightContent && <div className="scale-75 origin-right">{selectedOption.rightContent}</div>}
                        </div>
                    ) : (
                        <span className="text-base-content/40 text-sm">{isLoading ? "Cargando..." : (placeholder || "Seleccionar...")}</span>
                    )}
                    <ChevronDown size={18} className={`ml-2 transition-transform duration-200 opacity-50 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && createPortal(menuContent, document.body)}
            </div>
            {error && <label className="label"><span className="label-text-alt text-error">{error}</span></label>}
        </div>
    );
};