import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, User, FileText, PlusCircle, Search, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

// Servicios y Hooks
import { createVoucher, updateVoucher } from "../services/voucherService";
import { createBank } from "../services/bankService";
import { createAffiliate } from "../services/affiliateService";
import { useBanks } from "../hooks/useBanks";
import { useAffiliates } from "../hooks/useAffiliates";
import { useToast } from "../../../context/ToastContext";

// UI Components
import { TravesiaModal } from "../../../components/ui/TravesiaModal";
import { TravesiaInput } from "../../../components/ui/TravesiaInput";
import { TravesiaSelect } from "../../../components/ui/TravesiaSelect"; // Necesario para Mes/Año
import { RichSelect } from "../../../components/ui/RichSelect";
import { TravesiaStepper } from "../../../components/ui/TravesiaStepper";
import { BtnSave, BtnCancel, BtnBack, BtnNext } from "../../../components/ui/CrudButtons";

// types
import type { Voucher } from "../types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    voucherToEdit?: Voucher | null; 
}

const STEPS = ["Datos del Depósito", "Entidad Bancaria", "Afiliado / Aportante"];

// Constantes para el Selector de Meses
const MONTHS = [
    { value: "01", label: "Enero" }, { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" }, { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
    { value: "07", label: "Julio" }, { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" }, { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" }
];

export const VoucherFormModal = ({ isOpen, onClose, voucherToEdit }: Props) => {
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();

    // Hooks de Data
    const { data: banks = [], isLoading: loadingBanks } = useBanks();
    const { data: affiliates = [], isLoading: loadingAffiliates } = useAffiliates();

    // Estados Locales
    const [currentStep, setCurrentStep] = useState(1);
    const [manualShake, setManualShake] = useState(0);
    const [isNewBank, setIsNewBank] = useState(false);
    const [isNewAffiliate, setIsNewAffiliate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // Generar dinámicamente los últimos 6 años
    const currentYear = new Date().getFullYear();
    const years = useMemo(() => 
        Array.from({ length: 6 }, (_, i) => (currentYear - i).toString()), 
    [currentYear]);

    // Formulario
    const { register, handleSubmit, setValue, watch, reset, trigger, formState: { errors, submitCount } } = useForm({
        defaultValues: {
            // Paso 1
            depositNumber: "",
            depositDate: "", // Solo fecha (YYYY-MM-DD)
            amount: "",
            
            // Periodo (Selectores separados)
            periodMonth: "",
            periodYear: "",
            
            // Banco
            bankId: "",
            newBankName: "",
            newBankCode: "",

            // Afiliado
            affiliateId: "",
            affFirstName: "",
            affSecondName: "",
            affPaternalSurname: "",
            affMaternalSurname: "",
            affIdentityCard: ""
        }
    });

    
    // Reset al abrir (Configurar defaults)
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setManualShake(0);
            setIsNewBank(false);
            setIsNewAffiliate(false);
            setIsSubmitting(false);
            
            if (voucherToEdit) {
                // Parsear Fechas
                const depDate = parseISO(voucherToEdit.depositDate); // YYYY-MM-DDTHH:mm:ss
                const perDate = parseISO(voucherToEdit.period);      // YYYY-MM-DD

                reset({
                    depositNumber: voucherToEdit.depositNumber.toString(),
                    depositDate: format(depDate, 'yyyy-MM-dd'),
                    amount: voucherToEdit.amount.toString(),
                    
                    periodMonth: format(perDate, 'MM'),
                    periodYear: format(perDate, 'yyyy'),

                    // Banco Existente
                    bankId: voucherToEdit.bank.id as any,
                    newBankName: "", newBankCode: "",

                    // Afiliado Existente
                    affiliateId: voucherToEdit.affiliate.id as any,
                    affFirstName: "", affSecondName: "", affPaternalSurname: "", affMaternalSurname: "", affIdentityCard: ""
                });
            } else {
                const now = new Date();
                const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0'); // "02"
                
                reset({
                    depositNumber: "",
                    depositDate: now.toISOString().split('T')[0], // "2026-02-11"
                    amount: "",
                    
                    // Defaults: Mes y Año actual
                    periodMonth: currentMonth,
                    periodYear: now.getFullYear().toString(),
                    
                    bankId: "", 
                    newBankName: "", 
                    newBankCode: "",
                    affiliateId: "", 
                    affFirstName: "", 
                    affSecondName: "",
                    affPaternalSurname: "", 
                    affMaternalSurname: "", 
                    affIdentityCard: ""
                });
            }
        }
    }, [isOpen, voucherToEdit, reset]);

    // --- LOGICA DE NAVEGACION ---
    const handleNext = async () => {
        let isValid = false;

        if (currentStep === 1) {
            // Validamos los campos separados del periodo
            isValid = await trigger(["depositNumber", "depositDate", "amount", "periodMonth", "periodYear"]);
        } else if (currentStep === 2) {
            if (isNewBank) {
                isValid = await trigger(["newBankName", "newBankCode"]);
            } else {
                isValid = await trigger("bankId");
                if (!watch("bankId")) isValid = false;
            }
        }

        if (isValid) {
            setCurrentStep(prev => prev + 1);
            setManualShake(0);
        } else {
            setManualShake(prev => prev + 1);
        }
    };

    const handleBack = () => setCurrentStep(prev => prev - 1);

    // --- HELPER: CLEANER ---
    const toUpperClean = (text: string) => text ? text.trim().toUpperCase() : "";

    // --- MUTATION ---
    // const mutation = useMutation({
    //     mutationFn: (payload: any) => createVoucher(payload),
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ["vouchers"] });
    //         if (isNewBank) queryClient.invalidateQueries({ queryKey: ["banks"] });
    //         if (isNewAffiliate) queryClient.invalidateQueries({ queryKey: ["affiliates"] });
            
    //         success("Voucher registrado exitosamente.");
    //         onClose();
    //     },
    //     onError: (err: any) => {
    //         console.error(err);
    //         toastError("Error al registrar el voucher.");
    //     }
    // });
    
    // --- LOGICA PRINCIPAL DE GUARDADO ---
    const onSubmit = async (data: any) => {
        // Validación final
        if (isNewAffiliate && (!data.affFirstName || !data.affIdentityCard)) { setManualShake(p => p + 1); return; }
        else if (!isNewAffiliate && !data.affiliateId) { setManualShake(p => p + 1); return; }

        setIsSubmitting(true);
        try {
            // Preparar Fechas
            const now = new Date();
            const currentTime = now.toTimeString().split(' ')[0];
            const finalDepositDateTime = `${data.depositDate}T${currentTime}`;
            const finalPeriodDate = `${data.periodYear}-${data.periodMonth}-01`;

            // === LÓGICA DE UPDATE ===
            if (voucherToEdit) {
                let finalBankId = Number(data.bankId);
                let finalPersonId = Number(data.affiliateId);

                // 1. Resolver Banco (Si el usuario eligió crear uno nuevo en el tab)
                if (isNewBank) {
                    const bankPayload = {
                        name: toUpperClean(data.newBankName),
                        bankCode: toUpperClean(data.newBankCode)
                    };
                    const newBank = await createBank(bankPayload); // POST
                    finalBankId = newBank.id;
                }
                
                // 2. Resolver Afiliado (Si el usuario eligió crear uno nuevo en el tab)
                if (isNewAffiliate) {
                    const affPayload = {
                        person: {
                            firstName: toUpperClean(data.affFirstName),
                            secondName: toUpperClean(data.affSecondName),
                            paternalSurname: toUpperClean(data.affPaternalSurname),
                            maternalSurname: toUpperClean(data.affMaternalSurname),
                            identityCard: toUpperClean(data.affIdentityCard),
                            phoneNumber: null, email: null, imageUrl: null
                        },
                        affiliateCode: `GEN-${toUpperClean(data.affIdentityCard)}`, // Generar código temporal
                        admissionDate: new Date().toISOString().split('T')[0],
                        status: "ACTIVE"
                    };
                    const newAff = await createAffiliate(affPayload); // POST
                    finalPersonId = newAff.id;
                }

                // 3. Update Voucher (PUT)
                const updatePayload = {
                    depositNumber: Number(data.depositNumber),
                    depositDate: finalDepositDateTime,
                    amount: Number(data.amount),
                    period: finalPeriodDate,
                    bankId: finalBankId,     // Enviamos ID
                    personId: finalPersonId  // Enviamos ID
                };

                await updateVoucher(voucherToEdit.id, updatePayload);
                success("Voucher actualizado correctamente.");

            } 
            // === LÓGICA DE CREATE (Legacy - Mantenemos objetos) ===
            else {
                const createPayload = {
                    depositNumber: Number(data.depositNumber),
                    depositDate: finalDepositDateTime,
                    amount: Number(data.amount),
                    period: finalPeriodDate,
                    
                    bank: isNewBank ? {
                        id: null,
                        name: toUpperClean(data.newBankName),
                        bankCode: toUpperClean(data.newBankCode)
                    } : { id: Number(data.bankId), name: "", bankCode: "" },

                    affiliate: isNewAffiliate ? {
                        id: null,
                        firstName: toUpperClean(data.affFirstName),
                        secondName: toUpperClean(data.affSecondName),
                        paternalSurname: toUpperClean(data.affPaternalSurname),
                        maternalSurname: toUpperClean(data.affMaternalSurname),
                        identityCard: toUpperClean(data.affIdentityCard)
                    } : { id: Number(data.affiliateId), firstName: "", identityCard: "" }
                };

                await createVoucher(createPayload);
                success("Voucher registrado correctamente.");
            }

            // Inalidación y Cierre
            queryClient.invalidateQueries({ queryKey: ["vouchers"] });
            if (isNewBank) queryClient.invalidateQueries({ queryKey: ["banks"] });
            if (isNewAffiliate) queryClient.invalidateQueries({ queryKey: ["affiliates"] });
            onClose();

        } catch (error) {
            console.error(error);
            toastError("Error al procesar la solicitud.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Componente Toggle Tab (Reutilizado)
    const ToggleTab = ({ isNew, setIsNew, labelExisting, labelNew }: any) => (
        <div className="tabs tabs-boxed bg-base-100 border border-base-300 p-1 mb-4 w-full grid grid-cols-2">
            <a className={`tab h-8 min-h-0 text-xs font-bold rounded-md ${!isNew ? 'tab-active bg-primary text-primary-content' : ''}`} onClick={() => setIsNew(false)}>
                <Search size={14} className="mr-2"/> {labelExisting}
            </a>
            <a className={`tab h-8 min-h-0 text-xs font-bold rounded-md ${isNew ? 'tab-active bg-primary text-primary-content' : ''}`} onClick={() => setIsNew(true)}>
                <PlusCircle size={14} className="mr-2"/> {labelNew}
            </a>
        </div>
    );

    return (
        <TravesiaModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                        <FileText size={20} className="text-primary"/> 
                        {voucherToEdit ? "Modificar Voucher" : "Nuevo Voucher"}
                    </span>
                </div>
            }
            actions={
                <div className="flex justify-between w-full">
                    <div>{currentStep > 1 && <BtnBack onClick={handleBack} />}</div>
                    <div className="flex gap-2">
                        <BtnCancel onClick={onClose} disabled={isSubmitting} />
                        {currentStep < 3 ? (
                            <BtnNext onClick={handleNext} />
                        ) : (
                            <BtnSave 
                                label={isSubmitting ? "Procesando..." : (voucherToEdit ? "Guardar Cambios" : "Finalizar Registro")} 
                                isLoading={isSubmitting}
                                onClick={handleSubmit(onSubmit)}
                            />
                        )}
                    </div>
                </div>
            }
        >
            <TravesiaStepper steps={STEPS} currentStep={currentStep} className="mb-6" />

            <form className="min-h-[350px]">
                
                {/* --- PASO 1: DATOS DEL VOUCHER (ORDEN MODIFICADO) --- */}
                <div className={currentStep === 1 ? "block space-y-5 animate-fade-in" : "hidden"}>
                    
                    {/* FILA 1: N° Depósito | Fecha Depósito */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TravesiaInput 
                            label="N° Depósito" 
                            type="number"
                            placeholder="Ej: 12345678"
                            icon="hash"
                            isRequired
                            shakeKey={submitCount + manualShake}
                            error={errors.depositNumber ? "Requerido" : undefined}
                            {...register("depositNumber", { required: true })}
                        />
                        <TravesiaInput 
                            label="Fecha Depósito" 
                            type="date" // Solo fecha, sin hora
                            // subtitle="Año/Mes/Día"
                            isRequired
                            shakeKey={submitCount + manualShake}
                            error={errors.depositDate ? "Requerido" : undefined}
                            {...register("depositDate", { required: true })}
                        />
                    </div>

                    {/* FILA 2: Importe */}
                    <TravesiaInput 
                        label="IMPORTE DEPÓSITO APORTE" 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        icon="dollar-sign"
                        isRequired
                        className="input-success font-bold text-lg" // Un poco más grande para resaltar
                        shakeKey={submitCount + manualShake}
                        error={errors.amount ? "Requerido" : undefined}
                        {...register("amount", { required: true, min: 0.01 })}
                    />

                    {/* FILA 3: Sección Periodo (Título + Selectores) */}
                    <div className="bg-base-200/50 p-4 rounded-xl border border-base-200 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-2">
                            <Calendar size={14}/> Depósito corresponde al mes y año de:
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <TravesiaSelect 
                                label="Mes"
                                options={MONTHS} // Enero, Febrero...
                                isRequired
                                shakeKey={submitCount + manualShake}
                                error={errors.periodMonth ? "Requerido" : undefined}
                                {...register("periodMonth", { required: true })}
                            />
                            
                            <TravesiaSelect 
                                label="Año"
                                options={years.map(y => ({ value: y, label: y }))} // 2026, 2025...
                                isRequired
                                shakeKey={submitCount + manualShake}
                                error={errors.periodYear ? "Requerido" : undefined}
                                {...register("periodYear", { required: true })}
                            />
                        </div>
                    </div>
                </div>

                {/* --- PASO 2: BANCO --- */}
                <div className={currentStep === 2 ? "block space-y-4 animate-fade-in" : "hidden"}>
                    <div className="bg-base-200/40 p-5 rounded-xl border border-base-200 h-full">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-base-content/60">
                            <Building2 size={16}/> Información Bancaria
                        </div>
                        
                        <ToggleTab 
                            isNew={isNewBank} setIsNew={setIsNewBank} 
                            labelExisting="Buscar Banco" labelNew="Registrar Nuevo" 
                        />

                        {isNewBank ? (
                            <div className="space-y-4 animate-fade-in">
                                <TravesiaInput 
                                    label="Nombre del Banco" 
                                    placeholder="Ej: Banco Ganadero S.A." 
                                    shakeKey={submitCount + manualShake}
                                    {...register("newBankName", { required: isNewBank })}
                                />
                                <TravesiaInput 
                                    label="Código Corto" 
                                    placeholder="Ej: GANADERO" 
                                    shakeKey={submitCount + manualShake}
                                    {...register("newBankCode", { required: isNewBank })}
                                />
                            </div>
                        ) : (
                            <div className="animate-fade-in pt-2">
                                <RichSelect 
                                    label="Seleccionar Banco" 
                                    isLoading={loadingBanks}
                                    options={banks.map(b => ({
                                        value: b.id,
                                        label: b.name,
                                        subtitle: `Cód: ${b.bankCode}`
                                    }))}
                                    value={watch("bankId")}
                                    onChange={(val) => setValue("bankId", val as any)}
                                    error={!isNewBank && !watch("bankId") && manualShake > 0 ? "Seleccione un banco" : undefined}
                                    shakeKey={submitCount + manualShake}
                                    placeholder="Buscar por nombre..."
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* --- PASO 3: AFILIADO --- */}
                <div className={currentStep === 3 ? "block space-y-4 animate-fade-in" : "hidden"}>
                    <div className="bg-base-200/40 p-5 rounded-xl border border-base-200">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-base-content/60">
                            <User size={16}/> Datos del Aportante
                        </div>

                        <ToggleTab 
                            isNew={isNewAffiliate} setIsNew={setIsNewAffiliate} 
                            labelExisting="Buscar Afiliado" labelNew="Nuevo Aportante" 
                        />

                        {isNewAffiliate ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                    <TravesiaInput 
                                        label="Primer Nombre" 
                                        placeholder="Ej: Juan" 
                                        isRequired
                                        shakeKey={submitCount + manualShake}
                                        error={errors.affFirstName ? "Requerido" : undefined}
                                        {...register("affFirstName", { required: isNewAffiliate })}
                                    />
                                    <TravesiaInput 
                                        label="Segundo Nombre" 
                                        placeholder="Ej: Daniel" 
                                        {...register("affSecondName")} 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <TravesiaInput 
                                        label="Ap. Paterno" 
                                        placeholder="Ej: Perez" 
                                        {...register("affPaternalSurname")}
                                    />
                                    <TravesiaInput 
                                        label="Ap. Materno" 
                                        placeholder="Ej: Mamani" 
                                        {...register("affMaternalSurname")}
                                    />
                                </div>
                                
                                    <TravesiaInput 
                                        label="C.I." 
                                        placeholder="Ej: 4839201" 
                                        isRequired
                                        shakeKey={submitCount + manualShake}
                                        error={errors.affIdentityCard ? "Requerido" : undefined}
                                        {...register("affIdentityCard", { required: isNewAffiliate })}
                                    />
                            </div>
                        ) : (
                            <div className="animate-fade-in pt-2">
                                <RichSelect 
                                    label="Buscar Persona" 
                                    isLoading={loadingAffiliates}
                                    options={affiliates.map(a => ({
                                        value: a.id,
                                        label: a.fullName,
                                        subtitle: `CI: ${a.identityCard}`,
                                        icon: <User size={14}/>
                                    }))}
                                    value={watch("affiliateId")}
                                    onChange={(val) => setValue("affiliateId", val as any)}
                                    error={!isNewAffiliate && !watch("affiliateId") && manualShake > 0 ? "Seleccione una persona" : undefined}
                                    shakeKey={submitCount + manualShake}
                                    placeholder="Nombre o Carnet..."
                                />
                            </div>
                        )}
                    </div>
                </div>

            </form>
        </TravesiaModal>
    );
};