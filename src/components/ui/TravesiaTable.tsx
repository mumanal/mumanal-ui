import type { ReactNode } from "react";

export interface Column<T> {
    header: string | ReactNode;
    accessorKey?: keyof T;
    render?: (item: T) => ReactNode;
    className?: string;
}

interface Props<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    rowClassName?: (item: T) => string; // Prop para clases dinámicas
}

export const TravesiaTable = <T extends { id: number | string }>({ 
    data, 
    columns, 
    isLoading, 
    rowClassName 
}: Props<T>) => {
    
    if (isLoading) {
        return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-center p-10 text-gray-500">No se encontraron registros.</div>;
    }

    return (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-200">
            <table className="table table-zebra w-full">
                <thead className="bg-base-200 text-base-content uppercase text-xs font-bold">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className={col.className}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => {
                        // 1. Obtenemos las clases personalizadas para esta fila
                        const customClasses = rowClassName ? rowClassName(row) : '';
                        
                        // 2. DETECCIÓN INTELIGENTE: 
                        // Si la clase tiene "bg-", asumimos que queremos pintar el fondo.
                        // Entonces forzamos a las celdas a heredar ese fondo (!bg-inherit).
                        const shouldOverrideZebra = customClasses.includes('bg-');

                        return (
                            <tr 
                                key={row.id} 
                                className={`hover transition-colors duration-200 ${customClasses}`}
                            >
                                {columns.map((col, idx) => (
                                    <td 
                                        key={idx} 
                                        // 3. APLICAMOS LA TRANSPARENCIA CONDICIONAL AQUÍ
                                        className={`${col.className} ${shouldOverrideZebra ? '!bg-inherit' : ''}`}
                                    >
                                        {col.render 
                                            ? col.render(row) 
                                            : (col.accessorKey ? String(row[col.accessorKey]) : '-')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};