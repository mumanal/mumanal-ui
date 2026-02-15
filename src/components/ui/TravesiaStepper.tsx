interface Props {
    steps: string[];      // ["Información", "Precios", "Ubicación", "Imágenes"]
    currentStep: number;  // 1-based index
    className?: string;
}

export const TravesiaStepper = ({ steps, currentStep, className = "" }: Props) => {
    // Calculamos el nombre del paso actual de forma segura
    const currentStepName = steps[currentStep - 1] || "";
    
    // Calculamos porcentaje para la barra de progreso en móvil
    const progressPercentage = (currentStep / steps.length) * 100;

    return (
        <div className={`w-full ${className}`}>
            
            {/* --- VISTA DE ESCRITORIO (PC) --- */}
            {/* Se oculta en pantallas pequeñas (hidden), se muestra en medianas en adelante (md:block) */}
            <div className="hidden md:block px-4 mb-6">
                <ul className="steps steps-horizontal w-full">
                    {steps.map((label, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber <= currentStep;
                        
                        return (
                            <li 
                                key={index}
                                data-content={isActive ? "✓" : stepNumber}
                                className={`step transition-colors duration-300 ${isActive ? 'step-primary font-bold text-primary' : 'text-base-content/60'}`}
                            >
                                {label}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* --- VISTA MÓVIL (Celular) --- */}
            {/* Se muestra en pantallas pequeñas (block), se oculta en medianas en adelante (md:hidden) */}
            <div className="md:hidden mb-6">
                <div className="bg-base-200/50 rounded-xl p-4 border border-base-200 flex flex-col items-center text-center relative overflow-hidden">
                    
                    {/* Indicador de Texto */}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-1">
                        Paso {currentStep} de {steps.length}
                    </span>
                    
                    {/* Nombre del Paso Actual (Con animación key para que haga fade al cambiar) */}
                    <h3 
                        key={currentStep} 
                        className="text-lg font-bold text-primary animate-fade-in"
                    >
                        {currentStepName}
                    </h3>

                    {/* Barra de Progreso Sutil */}
                    <div className="w-full h-1 bg-base-300 mt-3 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};