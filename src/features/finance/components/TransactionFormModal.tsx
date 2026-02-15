// src/features/finance/components/TransactionFormModal.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastContext"; // Asumiendo ruta
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Hooks & Services
import { useParameters } from "../../../hooks/useParameters";
import { updateTransaction } from "../services/transactionService";
import { PARAM_CATEGORIES } from "../../../config/constants"; // PARAM_CATEGORIES.PAYMENT_METHOD, etc.
import type { TransactionResponse } from "../types";

// UI Components
import { TravesiaModal } from "../../../components/ui/TravesiaModal";
import { TravesiaInput } from "../../../components/ui/TravesiaInput";
import { TravesiaSelect } from "../../../components/ui/TravesiaSelect";
import { TravesiaDateTimePicker } from "../../../components/ui/TravesiaDateTimePicker";
import { BtnSave, BtnCancel } from "../../../components/ui/CrudButtons";

// Esquema de Validación
const schema = z.object({
    amount: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
    transactionDate: z.string().min(1, "La fecha es requerida"),
    paymentMethodType: z.coerce.number().min(1, "Seleccione un método de pago"),
    bankReference: z.string().max(200, "Máximo 200 caracteres").optional(),
    statusType: z.coerce.number().min(1, "Seleccione un estado"),
    // proofUrl no se valida en form visual, se maneja interno
});

interface Props {
    isOpen: boolean;
    onClose: () => void;
    transactionToEdit: TransactionResponse | null;
}

export const TransactionFormModal = ({ isOpen, onClose, transactionToEdit }: Props) => {
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();

    // Carga de Parámetros (No hardcodeamos nada)
    const { parameters: paymentMethods, isLoading: loadingPayments } = useParameters(PARAM_CATEGORIES.PAYMENT_METHOD);
    const { parameters: statuses, isLoading: loadingStatuses } = useParameters(PARAM_CATEGORIES.TRANSACTION_STATUS);

    const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: 0,
            transactionDate: new Date().toISOString(),
            paymentMethodType: 0,
            bankReference: "",
            statusType: 0
        }
    });

    // Cargar datos al abrir para editar
    useEffect(() => {
        if (isOpen && transactionToEdit) {
            reset({
                amount: transactionToEdit.amount,
                transactionDate: transactionToEdit.transactionDate,
                paymentMethodType: transactionToEdit.paymentMethodCode,
                bankReference: transactionToEdit.bankReference || "",
                statusType: transactionToEdit.statusCode
            });
        }
    }, [isOpen, transactionToEdit, reset]);

    // Mutación
    const mutation = useMutation({
        mutationFn: (data: any) => updateTransaction(transactionToEdit!.id, {
            ...data,
            proofUrl: transactionToEdit?.proofUrl // Mantenemos la URL existente oculta
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['finance', 'income'] });
            success("Transacción actualizada correctamente");
            onClose();
        },
        onError: () => {
            toastError("Error al actualizar la transacción");
        }
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    return (
        <TravesiaModal
            isOpen={isOpen}
            onClose={onClose}
            title={transactionToEdit ? `Editar Transacción #${transactionToEdit.id}` : "Nueva Transacción"}
            size="md"
            actions={
                <div className="flex justify-end gap-2 w-full">
                    <BtnCancel onClick={onClose} disabled={isSubmitting} />
                    <BtnSave 
                        onClick={handleSubmit(onSubmit)} 
                        isLoading={isSubmitting || mutation.isPending} 
                    />
                </div>
            }
        >
            <form className="space-y-4 pt-2">
                
                {/* Monto y Estado */}
                <div className="grid grid-cols-2 gap-4">
                    <TravesiaInput
                        label="Monto (Bs)"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("amount")}
                        error={errors.amount?.message as string}
                    />
                    
                    <TravesiaSelect
                        label="Estado"
                        options={statuses.map(p => ({ value: p.numericCode, label: p.name }))}
                        isLoading={loadingStatuses}
                        {...register("statusType")}
                        error={errors.statusType?.message as string}
                    />
                </div>

                {/* Fecha */}
                <div className="w-full">
                    <TravesiaDateTimePicker
                        label="Fecha y Hora de Transacción"
                        name="transactionDate"
                        control={control}
                        maxDate={new Date()} // No permitir fechas futuras
                        helperText={errors.transactionDate?.message as string}
                    />
                </div>

                {/* Método de Pago y Referencia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TravesiaSelect
                        label="Método de Pago"
                        options={paymentMethods.map(p => ({ value: p.numericCode, label: p.name }))}
                        isLoading={loadingPayments}
                        {...register("paymentMethodType")}
                        error={errors.paymentMethodType?.message as string}
                    />
                    
                    <TravesiaInput
                        label="Referencia Bancaria"
                        placeholder="Ej: 12345678"
                        {...register("bankReference")}
                        error={errors.bankReference?.message as string}
                    />
                </div>
            </form>
        </TravesiaModal>
    );
};