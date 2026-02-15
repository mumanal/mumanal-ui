import { Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UnderConstruction = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
      <div className="p-4 bg-warning/10 rounded-full text-warning">
        <Construction size={64} />
      </div>
      <h1 className="text-3xl font-bold">Módulo en Desarrollo</h1>
      <p className="text-base-content/60 max-w-md">
        Esta funcionalidad ya está en el menú, pero la vista aún se está programando.
      </p>
      <button onClick={() => navigate(-1)} className="btn btn-outline">
        Regresar
      </button>
    </div>
  );
};