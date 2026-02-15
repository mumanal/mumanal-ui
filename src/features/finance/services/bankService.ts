import api from '../../../lib/axios';
import type { Bank } from '../types';

export const getBanks = async (): Promise<Bank[]> => {
    const { data } = await api.get<Bank[]>('/finance/banks');
    return data;
};