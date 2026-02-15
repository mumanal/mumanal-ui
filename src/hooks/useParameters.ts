import { useQuery } from '@tanstack/react-query';
import { getParametersByCategory } from '../services/parameterService';

/**
 * Hook reutilizable para llenar <select> dinámicos.
 * @param category El código de categoría (usa las constantes de PARAM_CATEGORIES)
 */
export const useParameters = (category: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['parameters', category], // Cache key único por categoría
        queryFn: () => getParametersByCategory(category),
        staleTime: 1000 * 60 * 30, // Mantener en caché por 30 minutos
    });

    return {
        parameters: data || [],
        isLoading,
        error,
        // Helper para encontrar el nombre dado un código numérico (útil en tablas)
        getNameByCode: (code: number) => data?.find(p => p.numericCode === code)?.name || 'Desconocido'
    };
};