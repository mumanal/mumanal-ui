import api from '../lib/axios';
import { type City } from '../features/inventory/types/index';

export const getCities = async (): Promise<City[]> => {
    // Asumiendo que devuelve array directo según tu ejemplo, si tiene wrapper ajustamos
    const { data } = await api.get<City[]>('/generic/cities');
    return data;
};