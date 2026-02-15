import api from '../lib/axios';
import { type SystemParameter } from '../config/constants';

export const getParametersByCategory = async (category: string): Promise<SystemParameter[]> => {
    // CORRECCIÓN: Ajustamos la URL y el nombre del parámetro según tu backend
    // Antes: /generic/parameters?category=...
    // Ahora: /generic/parameters/code?categoryCode=...
    
    const { data } = await api.get<SystemParameter[]>(`/generic/parameters/code`, {
        params: { categoryCode: category } 
    });
    
    // NOTA: Revisa si tu backend devuelve "data" envuelta en ApiResponse o el array directo.
    // Según tu ejemplo de JSON anterior, devolvía el array directo: [ {id:..}, {id:..} ]
    // Si es así, devolvemos 'data' tal cual.
    return data; 
};