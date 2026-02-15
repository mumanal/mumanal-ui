import axios from 'axios';

// 1. Crear instancia base
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Lee del .env
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor de Solicitud (Request)
// Aquí inyectamos el token JWT automáticamente a CADA petición
api.interceptors.request.use(
    (config) => {
        // Simulación: Más adelante leeremos esto del LocalStorage o Zustand
        const token = localStorage.getItem('token'); 
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor de Respuesta (Response)
// Aquí manejamos los errores globales (Tu @ControllerAdvice)
api.interceptors.response.use(
    (response) => {
        // Si el backend devuelve 200, pasamos la respuesta limpia
        return response;
    },
    (error) => {
        // Manejo centralizado de errores
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                // Token expirado o inválido
                console.error("Sesión expirada. Redirigiendo al login...");
                // Aquí podrías forzar un logout: localStorage.clear(); window.location.href = '/login';
            }
            
            if (status === 403) {
                console.error("No tienes permisos para realizar esta acción.");
            }

            if (status >= 500) {
                console.error("Error crítico en el servidor. Contacte a soporte.");
            }
        } else {
            // Error de red (Backend caído)
            console.error("No se pudo conectar con el servidor.");
        }

        return Promise.reject(error);
    }
);

export default api;