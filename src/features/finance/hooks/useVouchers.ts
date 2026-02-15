import { useQuery } from '@tanstack/react-query';
import { getVouchers } from '../services/voucherService';
import { type Voucher } from '../types';

export const useVouchers = () => {
    return useQuery<Voucher[], Error>({
        queryKey: ['vouchers'],
        queryFn: getVouchers,
        staleTime: 1000 * 60 * 2, // 2 minutos de caché
    });
};