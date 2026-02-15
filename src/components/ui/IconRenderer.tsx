import { useMemo } from 'react';
// 1. Importamos TODO como un objeto para búsqueda dinámica
import * as LucideIcons from 'lucide-react';
// 2. Importamos explícitamente el fallback (CircleHelp es el nuevo nombre de HelpCircle)
import { CircleHelp } from 'lucide-react';
// 3. Importación de solo tipo corregida
import type { LucideProps } from 'lucide-react';

interface IconRendererProps extends Omit<LucideProps, 'ref'> {
  iconName?: string;
}

export const IconRenderer = ({ iconName, className, size = 20, ...props }: IconRendererProps) => {
  
  const IconComponent = useMemo(() => {
    // Si no viene nombre, devolvemos el fallback directo
    if (!iconName) return CircleHelp;

    // 1. Normalización de nombre (PascalCase)
    // Convertimos "shopping-cart" -> "ShoppingCart" por si acaso
    const pascalName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    // 2. Buscamos en el objeto gigante de iconos
    // @ts-ignore: Acceso dinámico necesario
    const icon = LucideIcons[pascalName] || LucideIcons[iconName];

    // 3. Retornamos el icono encontrado O el fallback si no existe
    return icon || CircleHelp;
    
  }, [iconName]);

  // Renderizamos el componente encontrado
  return <IconComponent className={className} size={size} {...props} />;
};