import { useQuery } from '@tanstack/react-query';
import { getBanks } from '../services/bankService';

export const useBanks = () => {
    return useQuery({
        queryKey: ['banks'],
        queryFn: getBanks,
        staleTime: 1000 * 60 * 60, // 1 hora (los bancos no cambian seguido)
    });
};