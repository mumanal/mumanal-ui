import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface CityResponse {
    id: number;
    name: string;
    country: string;
}

export const useCities = () => {
    return useQuery({
        queryKey: ['cities'],
        queryFn: async () => {
            const { data } = await api.get<CityResponse[]>('/generic/cities');
            return data;
        }
    });
};