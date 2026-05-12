import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Calendar, User, MapPin, Paintbrush } from 'lucide-react'; // Agregué iconos extra
import { format, parseISO, isSameDay } from 'date-fns'; 
import { es } from 'date-fns/locale';

// Hooks y Servicios
import { useVouchers } from '../hooks/useVouchers';
import { deleteVoucher } from '../services/voucherService';
import { useToast } from '../../../context/ToastContext'; 
import { useCities } from '../../../hooks/useCities';

// UI Components
import { TravesiaTable, type Column } from '../../../components/ui/TravesiaTable';
import { TravesiaInput } from '../../../components/ui/TravesiaInput';
import { TravesiaSelect } from '../../../components/ui/TravesiaSelect'; // ✅ Importamos Select
import { CrudButtons, BtnCreate } from '../../../components/ui/CrudButtons';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

// Types
import { type Voucher } from '../types';

import { VoucherFormModal } from '../components/VoucherFormModal'; 

// Constantes para los selectores
const MONTHS = [
    { value: "01", label: "Enero" }, { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" }, { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
    { value: "07", label: "Julio" }, { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" }, { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" }
];

export const VouchersPage = () => {
    const queryClient = useQueryClient();
    const { success, error: toastError } = useToast();
    
    // 1. DATA FETCHING
    const { data: vouchers = [], isLoading } = useVouchers();
    const { data: cities = [], isLoading: loadingCities } = useCities();

    // 2. FILTROS LOCALES
    const [searchTerm, setSearchTerm] = useState('');
    
    // ✅ Nuevos estados para filtros de fecha
    const [filterPeriodMonth, setFilterPeriodMonth] = useState('');
    const [filterPeriodYear, setFilterPeriodYear] = useState('');
    const [filterDepositDate, setFilterDepositDate] = useState('');
    const [filterCityId, setFilterCityId] = useState('');
    
    // Generar años dinámicamente (actual - 5 años)
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 6 }, (_, i) => {
            const year = (currentYear - i).toString();
            return { value: year, label: year };
        });
    }, []);

    const filteredVouchers = useMemo(() => {
        return vouchers.filter(v => {
            const searchLower = searchTerm.toLowerCase();
            
            // 1. Filtro de Texto General
            const matchesSearch = (
                v.affiliate.fullName.toLowerCase().includes(searchLower) ||
                v.affiliate.identityCard.toLowerCase().includes(searchLower) ||
                v.depositNumber.toString().includes(searchLower) ||
                v.bank.name.toLowerCase().includes(searchLower)
            );

            // 2. Filtro de Periodo (Mes y Año)
            // v.period viene como "YYYY-MM-DD"
            let matchesPeriod = true;
            if (filterPeriodYear || filterPeriodMonth) {
                const [vYear, vMonth] = v.period.split('-'); // ["2026", "02", "01"]
                
                if (filterPeriodYear && vYear !== filterPeriodYear) matchesPeriod = false;
                if (filterPeriodMonth && vMonth !== filterPeriodMonth) matchesPeriod = false;
            }

            // 3. Filtro de Fecha de Depósito (Exacta)
            // v.depositDate viene como ISO DateTime "2026-02-18T15:30:00"
            let matchesDepositDate = true;
            if (filterDepositDate) {
                const voucherDate = parseISO(v.depositDate);
                const filterDate = parseISO(filterDepositDate);
                // Comparamos si es el mismo día ignorando la hora
                matchesDepositDate = isSameDay(voucherDate, filterDate);
            }

            // 4. Filtro por Ciudad
            let matchesCity = true;
            if (filterCityId && v.city?.id?.toString() !== filterCityId) {
                matchesCity = false;
            }

            return matchesSearch && matchesPeriod && matchesDepositDate && matchesCity;
        });
    }, [vouchers, searchTerm, filterPeriodMonth, filterPeriodYear, filterDepositDate, filterCityId]);

    // ... (Lógica de Delete y Modales se mantiene igual) ...
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);

    const deleteMutation = useMutation({
        mutationFn: deleteVoucher,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vouchers'] });
            success("Voucher eliminado correctamente");
            setIsDeleteModalOpen(false);
            setVoucherToDelete(null);
        },
        onError: (err) => {
            console.error(err);
            toastError("No se pudo eliminar el voucher. Intente nuevamente.");
        }
    });

    const [modalData, setModalData] = useState<{ isOpen: boolean; voucher: Voucher | null }>({
        isOpen: false,
        voucher: null
    });

    const handleCreate = () => setModalData({ isOpen: true, voucher: null });
    const handleEdit = (voucher: Voucher) => setModalData({ isOpen: true, voucher: voucher });
    const handleClose = () => setModalData({ ...modalData, isOpen: false });

    const handleDeleteClick = (voucher: Voucher) => {
        setVoucherToDelete(voucher);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (voucherToDelete) deleteMutation.mutate(voucherToDelete.id);
    };    

    // Resetear filtros
    const clearFilters = () => {
        setSearchTerm('');
        setFilterPeriodMonth('');
        setFilterPeriodYear('');
        setFilterDepositDate('');
        setFilterCityId('');
    };

    const hasActiveFilters = searchTerm || filterPeriodMonth || filterPeriodYear || filterDepositDate || filterCityId;

    // ... (Format Currency y Columns se mantienen igual) ...
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency', currency: 'BOB', minimumFractionDigits: 2
        }).format(amount);
    };
    
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
                    <span className="badge badge-sm badge-ghost text-[10px] font-mono h-5 px-1.5 border-0 bg-base-200">
                        {row.bank.bankCode}
                    </span>
                </div>
            )
        },
        {
            header: 'Ciudad / Sucursal',
            accessorKey: 'city.name' as any,
            render: (row) => (
                <div className="flex items-center gap-1.5 text-sm text-base-content/80 font-medium">
                    <MapPin size={14} className="text-error/80" />
                    {row.city?.name || 'N/A'}
                </div>
            )
        },
        {
            header: 'Periodo & Fechas',
            render: (row) => {
                const depositDate = parseISO(row.depositDate);
                const periodDate = parseISO(row.period); 
                
                return (
                    <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1.5 text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-md w-fit">
                            <Calendar size={12} />
                            <span className="capitalize">
                                {format(periodDate, 'MMMM yyyy', { locale: es })}
                            </span>
                        </div>
                        <div className="opacity-60 pl-1" title="Fecha realizada en el banco">
                            Dep: {format(depositDate, 'dd/MM/yyyy')}
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
                </div>
            )
        },
        {
            header: 'Acciones',
            className: 'text-right',
            render: (row) => (
                <CrudButtons 
                    onEdit={() => handleEdit(row)} 
                    onDelete={() => handleDeleteClick(row)} 
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
                <BtnCreate label="Registrar Voucher" onClick={handleCreate} />
            </div>
{/* ✅ SECCIÓN DE FILTROS (Alineación Perfecta y Diseño Agrupado) */}
            <div className="bg-base-200 p-4 rounded-xl shadow-sm border border-base-300">
                
                {/* Grilla estricta: 1 sola línea en PC */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    
                    {/* 1. Búsqueda Texto (Ocupa 3 de 12) */}
                    <div className="md:col-span-3">
                        <TravesiaInput 
                            label="Búsqueda General" 
                            placeholder="Nº Depósito, CI, Nombre..." 
                            icon="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-base-100" 
                        />
                    </div>
                    
                    {/* 2. Filtro Ciudad (Ocupa 3 de 12 - Más ancho para nombres largos) */}
                    <div className="md:col-span-3">
                        <TravesiaSelect
                            label="Ciudad / Sucursal"
                            options={cities.map(c => ({ value: c.id.toString(), label: c.name }))}
                            value={filterCityId}
                            onChange={(e) => setFilterCityId(e.target.value)}
                            placeholder="Todas"
                            enableDefaultOption
                            disabled={loadingCities}
                        />
                    </div>

                    {/* 3. Filtro Periodo Agrupado (3/12) */}
                    <div className="md:col-span-3">
                        {/* LA CLAVE: Usar la clase "label" nativa sin pt-0 ni utilidades extra para que la altura sea idéntica a los demás inputs */}
                        <label className="label">
                            <span className="label-text font-semibold flex gap-1 items-center">
                                <Calendar size={14} className="text-primary"/> Periodo de Aporte
                            </span>
                        </label>
                        
                        <div className="flex gap-2">
                            <TravesiaSelect
                                options={MONTHS}
                                value={filterPeriodMonth}
                                onChange={(e) => setFilterPeriodMonth(e.target.value)}
                                placeholder="Mes"
                                enableDefaultOption
                            />
                            <TravesiaSelect
                                options={years}
                                value={filterPeriodYear}
                                onChange={(e) => setFilterPeriodYear(e.target.value)}
                                placeholder="Año"
                                enableDefaultOption
                            />
                        </div>
                    </div>

                    {/* 4. Filtro Fecha Deposito (Ocupa 2 de 12) */}
                    <div className="md:col-span-2">
                        <TravesiaInput 
                            label="Fecha Depósito"
                            type="date"
                            value={filterDepositDate}
                            onChange={(e) => setFilterDepositDate(e.target.value)}
                            className="bg-base-100"
                        />
                    </div>

                    {/* 5. Botón Limpiar (Ocupa 1 de 12) */}
                    <div className="md:col-span-1 flex justify-end">
                        {hasActiveFilters ? (
                            <button 
                                onClick={clearFilters}
                                className="btn btn-ghost border border-error/30 text-error hover:bg-error hover:text-white w-full h-[46px] min-h-0 rounded-lg p-0 flex items-center justify-center"
                                title="Limpiar filtros"
                            >
                                <Paintbrush size={20} />
                            </button>
                        ) : (
                            <div className="h-[46px] w-full hidden md:block"></div>
                        )}
                    </div>

                </div>
            </div>

            
            {/* Tabla */}
            <TravesiaTable 
                data={filteredVouchers} 
                columns={columns} 
                isLoading={isLoading}
            />

            {/* Modales */}
            {modalData.isOpen && (
                <VoucherFormModal 
                    isOpen={modalData.isOpen} 
                    onClose={handleClose}
                    voucherToEdit={modalData.voucher}
                />
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setVoucherToDelete(null); }}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar Voucher?"
                message={
                    voucherToDelete 
                    ? `Estás a punto de eliminar el depósito N° ${voucherToDelete.depositNumber} de ${voucherToDelete.affiliate.fullName}. Esta acción no se puede deshacer.`
                    : "¿Estás seguro de realizar esta acción?"
                }
                confirmText={deleteMutation.isPending ? "Eliminando..." : "Sí, Eliminar"}
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
};