import api from '../../../lib/axios';
import type { Affiliate } from '../types';

// GET
export const getAffiliates = async (): Promise<Affiliate[]> => {
    const { data } = await api.get<Affiliate[]>('/finance/affiliates');
    return data;
};

// POST
export const createAffiliate = async (payload: any) => {
    const { data } = await api.post<Affiliate>('/finance/affiliates', payload);
    return data;
};

// PUT
export const updateAffiliate = async (id: number, payload: any) => {
    const { data } = await api.put<Affiliate>(`/finance/affiliates/${id}`, payload);
    return data;
};