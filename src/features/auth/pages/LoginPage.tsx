import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import { TravesiaInput } from '../../../components/ui/TravesiaInput';
import api from '../../../lib/axios';
import type { LoginResponse } from '../types';
import { BtnLogin } from "../../../components/ui/CrudButtons";

export const LoginPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login); // Acción del store

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Llamada al backend
            const { data } = await api.post<LoginResponse>('/auth/login', { 
                username, 
                password 
            });

            // Si es exitoso, actualizamos el store global
            login(data.token);

            // Redirigimos al dashboard
            navigate('/dashboard');
            
        } catch (err) {
            console.error(err);
            setError('Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold justify-center mb-4">Mumanal</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TravesiaInput 
                            label="Usuario" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        
                        <TravesiaInput 
                            label="Contraseña" 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <div className="alert alert-error text-sm py-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="card-actions justify-end mt-4">
                            {/* Reemplazamos el TravesiaButton genérico por el específico */}
                            <BtnLogin 
                                type="submit" 
                                isLoading={loading} 
                                // label="Ingresar" // Ya viene por defecto, pero puedes cambiarlo
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};