import { useRef } from "react";
import { ImagePlus, FileImage, AlertCircle } from "lucide-react";
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, ALLOWED_IMAGE_TYPES } from "../../config/storage";
import { useToast } from "../../context/ToastContext";
import { BtnChange, BtnRemove } from "./CrudButtons";

interface Props {
    // Value ahora es un objeto simple o null
    value?: { file?: File; preview: string } | null; 
    onChange: (value: { file?: File; preview: string } | null) => void;
    error?: string;
    shakeKey?: number;
}

export const TravesiaSingleImageUploader = ({ value, onChange, error, shakeKey }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { error: toastError } = useToast();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // 1. Validar Tipo
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                toastError("Formato no válido. Usa JPG, PNG o WEBP.");
                return;
            }

            // 2. Validar Tamaño
            if (file.size > MAX_FILE_SIZE_BYTES) {
                toastError(`La imagen supera el límite de ${MAX_FILE_SIZE_MB}MB.`);
                return;
            }

            // Crear objeto local
            onChange({
                file: file, // Guardamos el archivo para subirlo luego
                preview: URL.createObjectURL(file) // Preview local
            });
        }
        // Reset input
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleRemove = () => {
        onChange(null); // Limpiamos la selección
    };

    return (
        <div className={`space-y-3 ${shakeKey ? 'animate-shake' : ''}`}>
            <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                    <FileImage size={16}/> Imagen del Producto
                </span>
            </label>

            {value ? (
                // --- VISTA: IMAGEN SELECCIONADA ---
                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-base-300 group bg-base-100">
                    <img 
                        src={value.preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                    />
                    
                    {/* Overlay con acciones */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <BtnChange 
                            onClick={() => inputRef.current?.click()}
                            type="button"
                            className="btn-sm" // Forzamos tamaño pequeño
                        />
                        
                        <BtnRemove 
                            onClick={handleRemove}
                            type="button"
                            className="btn-sm" // Forzamos tamaño pequeño
                        />
                    </div>

                    {/* Badge informativo */}
                    <div className="absolute bottom-2 right-2">
                        {value.file ? (
                            <span className="badge badge-warning text-xs font-bold shadow-sm">NUEVA IMAGEN</span>
                        ) : (
                            <span className="badge badge-neutral text-xs font-bold shadow-sm opacity-80">GUARDADA</span>
                        )}
                    </div>
                </div>
            ) : (
                // --- VISTA: ZONA DE CARGA (VACÍA) ---
                <div 
                    className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                        ${error ? 'border-error bg-error/5' : 'border-base-300 hover:bg-base-200/50 hover:border-primary/50'}
                    `}
                    onClick={() => inputRef.current?.click()}
                >
                    <div className="bg-base-200 p-4 rounded-full mb-3">
                        <ImagePlus size={32} className="text-base-content/40" />
                    </div>
                    <p className="font-bold text-sm">Click para subir imagen</p>
                    <p className="text-xs text-base-content/50 mt-1">
                        Máx. {MAX_FILE_SIZE_MB}MB (JPG, PNG, WEBP)
                    </p>
                </div>
            )}

            <input 
                ref={inputRef}
                type="file" 
                accept={ALLOWED_IMAGE_TYPES.join(',')} 
                className="hidden" 
                onChange={handleFileSelect}
            />

            {error && (
                <div className="flex items-center gap-2 text-error text-xs mt-1 animate-fade-in">
                    <AlertCircle size={14}/>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};