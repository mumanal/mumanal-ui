import api from '../../../lib/axios';

interface UploadResponse {
    url: string;
}

export const uploadFile = async (
    file: File, 
    folder: string, 
    customName?: string
): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    if (customName) {
        // Sanitizar nombre: "Habitación Doble" -> "habitacion-doble"
        const sanitized = customName
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar tildes
            .replace(/\s+/g, '-') // Espacios a guiones
            .replace(/[^a-z0-9-]/g, ''); // Quitar caracteres raros
            
        formData.append('customName', sanitized);
    }

    // Llamada al backend
    const { data } = await api.post<UploadResponse>('/shared/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return data.url;
};