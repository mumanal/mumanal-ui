import { useRef } from "react";
import { ImagePlus, X, Star, ArrowUp, ArrowDown } from "lucide-react";
import { 
    MAX_FILE_SIZE_BYTES, 
    MAX_FILE_SIZE_MB, 
    ALLOWED_IMAGE_TYPES, 
    MAX_IMAGES_PER_PRODUCT 
} from "../../config/storage";
import { useToast } from "../../context/ToastContext"; // ✅ Usamos tu contexto de Toast

export interface ImageItem {
    id: string; 
    preview: string; 
    file?: File; 
    isCover: boolean;
    name?: string;
}

interface Props {
    images: ImageItem[];
    onChange: (newImages: ImageItem[]) => void;
    error?: string;
    shakeKey?: number;
}

export const TravesiaImageUploader = ({ images, onChange, error, shakeKey }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { error: toastError, success: toastSuccess } = useToast(); // ✅ Hook de notificaciones

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            
            const validNewItems: ImageItem[] = [];
            let skippedCount = 0;
            let invalidTypeCount = 0;

            files.forEach(file => {
                // 1. Validar Tipo
                if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                    invalidTypeCount++;
                    return; // Saltamos este archivo
                }

                // 2. Validar Tamaño (Max 5MB)
                if (file.size > MAX_FILE_SIZE_BYTES) {
                    skippedCount++;
                    return; // Saltamos este archivo, pero seguimos con el resto
                }

                // Si pasa, lo preparamos
                validNewItems.push({
                    id: URL.createObjectURL(file),
                    preview: URL.createObjectURL(file),
                    file: file,
                    isCover: false,
                    name: file.name
                });
            });

            // 3. Validar Cantidad Total (Actuales + Nuevas Válidas)
            const currentTotal = images.length;
            const potentialTotal = currentTotal + validNewItems.length;

            if (potentialTotal > MAX_IMAGES_PER_PRODUCT) {
                toastError(`Solo puedes tener un máximo de ${MAX_IMAGES_PER_PRODUCT} imágenes por producto.`);
                
                // Opción A: No agregar nada si se pasan
                // return; 

                // Opción B: Agregar solo las que quepan (Recomendado)
                const slotsAvailable = MAX_IMAGES_PER_PRODUCT - currentTotal;
                if (slotsAvailable > 0) {
                    const toAdd = validNewItems.slice(0, slotsAvailable);
                    const updatedList = [...images, ...toAdd];
                    updateListState(updatedList);
                    toastSuccess(`Se agregaron ${toAdd.length} imágenes.`);
                }
            } else {
                // Si caben todas, las agregamos
                if (validNewItems.length > 0) {
                    const updatedList = [...images, ...validNewItems];
                    updateListState(updatedList);
                }
            }

            // 4. Notificaciones de Archivos Saltados (Tu requerimiento específico)
            if (skippedCount > 0) {
                toastError(`${skippedCount} imagen(es) ignorada(s) por exceder ${MAX_FILE_SIZE_MB}MB.`);
            }
            if (invalidTypeCount > 0) {
                toastError(`${invalidTypeCount} archivo(s) ignorado(s) por formato incorrecto.`);
            }
        }

        // Reset input
        if (inputRef.current) inputRef.current.value = "";
    };

    const updateListState = (list: ImageItem[]) => {
        const validatedList = list.map((img, index) => ({
            ...img,
            isCover: index === 0 
        }));
        onChange(validatedList);
    };

    const removeImage = (index: number) => {
        const newList = [...images];
        newList.splice(index, 1);
        updateListState(newList);
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === images.length - 1) return;

        const newList = [...images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
        updateListState(newList);
    };

    const getDisplayName = (img: ImageItem) => {
        if (img.name) return img.name;
        try {
            const parts = img.preview.split('/');
            return parts[parts.length - 1];
        } catch {
            return "Imagen";
        }
    };

    return (
        <div className={`space-y-4 ${shakeKey ? 'animate-shake' : ''}`}>
            
            {/* ZONA DE CARGA */}
            {/* Si ya llegamos al límite, deshabilitamos visualmente la zona de carga */}
            {images.length >= MAX_IMAGES_PER_PRODUCT ? (
                <div className="border-2 border-dashed border-base-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-base-200/50 cursor-not-allowed opacity-60">
                    <div className="bg-base-300 p-3 rounded-full mb-2">
                        <ImagePlus size={24} className="text-base-content/40" />
                    </div>
                    <p className="font-medium text-sm text-base-content/50">Límite de imágenes alcanzado ({MAX_IMAGES_PER_PRODUCT})</p>
                    <p className="text-xs text-base-content/40 mt-1">Borra una imagen para agregar otra</p>
                </div>
            ) : (
                <div 
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                        ${error ? 'border-error bg-error/5' : 'border-base-300 hover:bg-base-200/50 hover:border-primary/50'}
                    `}
                    onClick={() => inputRef.current?.click()}
                >
                    <input 
                        ref={inputRef}
                        type="file" 
                        multiple 
                        accept={ALLOWED_IMAGE_TYPES.join(',')} 
                        className="hidden" 
                        onChange={handleFileSelect}
                    />
                    <div className="bg-base-200 p-3 rounded-full mb-2">
                        <ImagePlus size={24} className="text-base-content/60" />
                    </div>
                    <p className="font-medium text-sm">Click para seleccionar imágenes</p>
                    <p className="text-xs text-base-content/50 mt-1">
                        Máx. {MAX_FILE_SIZE_MB}MB • {MAX_IMAGES_PER_PRODUCT} imágenes máx.
                    </p>
                </div>
            )}

            {error && <p className="text-xs text-error font-medium">{error}</p>}

            {/* LISTA DE IMÁGENES */}
            <div className="space-y-2">
                {images.map((img, index) => (
                    <div key={img.id} className={`flex items-center gap-3 p-2 rounded-lg border ${img.isCover ? 'border-primary bg-primary/5' : 'border-base-200 bg-base-100'}`}>
                        
                        <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-base-300">
                            <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate" title={getDisplayName(img)}>
                                {getDisplayName(img)}
                            </p>
                            
                            <div className="flex gap-2 mt-1">
                                {img.file ? (
                                    <span className="badge badge-warning badge-xs opacity-70">NUEVA</span>
                                ) : (
                                    <span className="badge badge-ghost badge-xs opacity-50">GUARDADA</span>
                                )}
                                
                                {img.isCover && (
                                    <span className="badge badge-primary badge-xs gap-1">
                                        <Star size={8} fill="currentColor" /> PORTADA
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <button 
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveImage(index, 'up')}
                                className="btn btn-xs btn-square btn-ghost disabled:bg-transparent disabled:opacity-20"
                            >
                                <ArrowUp size={14} />
                            </button>
                            <button 
                                type="button"
                                disabled={index === images.length - 1}
                                onClick={() => moveImage(index, 'down')}
                                className="btn btn-xs btn-square btn-ghost disabled:bg-transparent disabled:opacity-20"
                            >
                                <ArrowDown size={14} />
                            </button>
                        </div>

                        <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="btn btn-sm btn-square btn-ghost text-error hover:bg-error/10"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};