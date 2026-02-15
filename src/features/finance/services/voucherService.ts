import api from '../../../lib/axios'; // Asumiendo ruta estándar
import { type Voucher } from '../types';

const BASE_URL = '/finance/vouchers'; // El prefijo /api suele ir en la config de axios

// 1. GET ALL
export const getVouchers = async (): Promise<Voucher[]> => {
    const { data } = await api.get<Voucher[]>(BASE_URL);
    return data;
};

// 2. DELETE (Preparado para cuando lo necesites)
export const deleteVoucher = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
};