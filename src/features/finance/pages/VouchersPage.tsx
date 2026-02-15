import { useState, useMemo } from 'react';
import { FileText, Calendar, User } from 'lucide-react';
import { format, parseISO } from 'date-fns'; // Recomendado para fechas, o usar JS nativo
import { es } from 'date-fns/locale';

// Hooks y Servicios
import { useVouchers } from '../hooks/useVouchers';

// UI Components
import { TravesiaTable, type Column } from '../../../components/ui/TravesiaTable';
import { TravesiaInput } from '../../../components/ui/TravesiaInput';
import { CrudButtons, BtnCreate } from '../../../components/ui/CrudButtons';

// Types
import { type Voucher } from '../types';

import { VoucherFormModal } from '../components/VoucherFormModal'; 

export const VouchersPage = () => {
    // 1. DATA FETCHING
    const { data: vouchers = [], isLoading } = useVouchers();

    // 2. FILTROS LOCALES
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVouchers = useMemo(() => {
        return vouchers.filter(v => {
            const searchLower = searchTerm.toLowerCase();
            
            // Buscamos por: Nombre Afiliado, CI, Nro Depósito o Nombre Banco
            return (
                v.affiliate.fullName.toLowerCase().includes(searchLower) ||
                v.affiliate.identityCard.toLowerCase().includes(searchLower) ||
                v.depositNumber.toString().includes(searchLower) ||
                v.bank.name.toLowerCase().includes(searchLower)
            );
        });
    }, [vouchers, searchTerm]);

    // 3. HANDLERS (Stubs para conectar luego)
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleCreate = () => {
        setIsCreateModalOpen(true); 
    };

    const handleEdit = (voucher: Voucher) => {
        console.log("Editar voucher", voucher.id);
    };

    const handleDelete = (id: number) => {
        console.log("Eliminar voucher", id);
    };

    // 4. FORMATO DE MONEDA
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2
        }).format(amount);
    };
    
    // 5. DEFINICIÓN DE COLUMNAS
    const columns: Column<Voucher>[] = [
        {
            header: 'Nº Depósito',
            accessorKey: 'depositNumber',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <FileText size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-base-content">{row.depositNumber}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Afiliado / Aportante',
            accessorKey: 'affiliate.fullName' as any,
            render: (row) => (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-base-content">
                        <User size={14} className="text-secondary" />
                        {row.affiliate.fullName}
                    </div>
                    <div className="flex items-center gap-1 text-xs opacity-60 ml-5">
                        <span className="tracking-wider">CI: {row.affiliate.identityCard}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Entidad Bancaria',
            accessorKey: 'bank.name' as any,
            render: (row) => (
                <div className="flex flex-col items-start gap-1">
                    <span className="font-medium text-sm">{row.bank.name}</span>
                    {/* Badge simple para el código del banco */}
                    <span className="badge badge-sm badge-ghost text-[10px] font-mono h-5 px-1.5 border-0 bg-base-200">
                        {row.bank.bankCode}
                    </span>
                </div>
            )
        },
        {
            header: 'Periodo & Fechas',
            render: (row) => {
                // Formateo de fechas seguro
                const depositDate = parseISO(row.depositDate);
                const periodDate = parseISO(row.period); // Viene YYYY-MM-DD
                
                return (
                    <div className="flex flex-col gap-1 text-xs">
                        {/* Periodo Destacado */}
                        <div className="flex items-center gap-1.5 text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-md w-fit">
                            <Calendar size={12} />
                            <span className="capitalize">
                                {format(periodDate, 'MMMM yyyy', { locale: es })}
                            </span>
                        </div>
                        {/* Fecha Real del Depósito */}
                        <div className="opacity-60 pl-1" title="Fecha realizada en el banco">
                            Dep: {format(depositDate, 'dd/MM/yyyy HH:mm')}
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Importe',
            accessorKey: 'amount',
            className: 'text-right',
            render: (row) => (
                <div className="flex flex-col items-end gap-0.5">
                    <span className="font-mono font-bold text-base text-success">
                        {formatCurrency(row.amount)}
                    </span>
                    {/* <span className="text-[10px] opacity-50 flex items-center gap-1">
                        <CreditCard size={10} />
                        Confirmado
                    </span> */}
                </div>
            )
        },
        {
            header: 'Acciones',
            className: 'text-right',
            render: (row) => (
                <CrudButtons 
                    onEdit={() => handleEdit(row)} 
                    onDelete={() => handleDelete(row.id)} 
                />
            )
        }
    ];
    
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-base-content">Control de Vouchers</h1>
                    <p className="text-sm text-base-content/60">Gestión y digitalización de comprobantes bancarios.</p>
                </div>
                {/* Aquí conectaremos el Modal de Escaneo con IA más adelante */}
                <BtnCreate label="Registrar Voucher" onClick={handleCreate} />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
                <div className="md:col-span-1">
                    <TravesiaInput 
                        label="Búsqueda Rápida" 
                        placeholder="Nº Depósito, Nombre, CI..." 
                        icon="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {/* Aquí podrías agregar más filtros como un Selector de Bancos o Selector de Fechas */}
                <div className="flex items-end pb-2 opacity-50 text-xs">
                    <span className="flex items-center gap-1">
                        Mostrando <b>{filteredVouchers.length}</b> registros
                    </span>
                </div>
            </div>

            {/* Tabla */}
            <TravesiaTable 
                data={filteredVouchers} 
                columns={columns} 
                isLoading={isLoading}
                // Opcional: rowClassName si quieres destacar vouchers recientes
            />

            {/* Renderizar Modal */}
            {isCreateModalOpen && (
                <VoucherFormModal 
                    isOpen={isCreateModalOpen} 
                    onClose={() => setIsCreateModalOpen(false)} 
                />
            )}
        </div>
    );
};