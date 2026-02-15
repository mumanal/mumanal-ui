import api from '../../../lib/axios';
import type { Affiliate } from '../types';

export const getAffiliates = async (): Promise<Affiliate[]> => {
    const { data } = await api.get<Affiliate[]>('/finance/affiliates');
    return data;
};