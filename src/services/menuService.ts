import api from '../lib/axios';
import type { MenuItem } from '../features/auth/types';

export const getMyMenuTree = async (): Promise<MenuItem[]> => {
    // 1. Pedimos la respuesta "cruda" (sin tipar el wrapper genérico todavía)
    const response = await api.get('/security/menus/my-tree');
    
    // 2. Inspeccionamos qué llegó realmente
    const payload = response.data; // Esto es el cuerpo del JSON

    // CASO A: Si el backend usa el wrapper ApiResponse (tiene propiedad .data interna)
    if (payload.data) {
        // Si es un array, lo devolvemos. Si es un objeto único, lo metemos en un array.
        return Array.isArray(payload.data) ? payload.data : [payload.data];
    }

    // CASO B: Si el backend devuelve el JSON directo (sin wrapper)
    // Si payload es un array, lo devolvemos. Si es un objeto, lo metemos en un array.
    return Array.isArray(payload) ? payload : [payload];
};