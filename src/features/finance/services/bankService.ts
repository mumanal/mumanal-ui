import api from '../../../lib/axios';
import type { Bank } from '../types';

// GET
export const getBanks = async (): Promise<Bank[]> => {
    const { data } = await api.get<Bank[]>('/finance/banks');
    return data;
};

// POST
export const createBank = async (payload: any) => {
    const { data } = await api.post<Bank>('/finance/banks', payload);
    return data;
};

// PUT
export const updateBank = async (id: number, payload: any) => {
    const { data } = await api.put<Bank>(`/finance/banks/${id}`, payload);
    return data;
};