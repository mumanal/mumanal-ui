import { useQuery } from '@tanstack/react-query';
import { getCities } from '../services/commonService';

export const useCities = () => {
    return useQuery({
        queryKey: ['cities'],
        queryFn: getCities,
        staleTime: 1000 * 60 * 60, // Cachear 1 hora, las ciudades no cambian mucho
    });
};