import { useQuery } from '@tanstack/react-query';
import { getAffiliates } from '../services/affiliateService';

export const useAffiliates = () => {
    return useQuery({
        queryKey: ['affiliates'],
        queryFn: getAffiliates,
        staleTime: 1000 * 60 * 5, 
    });
};