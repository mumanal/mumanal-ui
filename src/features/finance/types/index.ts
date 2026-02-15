export interface Bank {
    id: number;
    name: string;
    bankCode: string;
}

export interface Affiliate {
    id: number;
    fullName: string;
    firstName: string;
    secondName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    identityCard: string;
}

export interface Voucher {
    id: number;
    depositNumber: number;
    depositDate: string;      // LocalDateTime ISO
    registrationDate: string; // LocalDateTime ISO
    amount: number;           // BigDecimal
    period: string;           // LocalDate (YYYY-MM-DD)
    
    // Objetos anidados
    bank: Bank;
    affiliate: Affiliate;
}