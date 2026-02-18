import api from '../../../lib/axios'; // Asumiendo ruta estándar
import { type Voucher } from '../types';

const BASE_URL = '/finance/vouchers'; // El prefijo /api suele ir en la config de axios

// GET
export const getVouchers = async (): Promise<Voucher[]> => {
    const { data } = await api.get<Voucher[]>(BASE_URL);
    return data;
};

// DELETE
export const deleteVoucher = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
};

// POST
export const createVoucher = async (payload: any): Promise<Voucher> => {
    const { data } = await api.post<Voucher>(BASE_URL, payload);
    return data;
};

// PUT
export const updateVoucher = async (id: number, payload: any) => {
    const { data } = await api.put<Voucher>(`${BASE_URL}/${id}`, payload);
    return data;
};