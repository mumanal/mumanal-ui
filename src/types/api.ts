// Esta interfaz debe coincidir con la estructura que devuelve tu Spring Boot
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    // Agrega aquí otros campos si tu backend los manda (ej: timestamp, errorCode)
}

// Para respuestas paginadas (Page<T> de Spring)
export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // página actual
}