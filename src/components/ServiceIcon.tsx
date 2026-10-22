// ============================================================================
// ServiceIcon.tsx — Icono de un servicio de streaming
// ----------------------------------------------------------------------------
// La BD guarda un nombre de icono en string (ej. "clapperboard"). Aquí lo
// mapeamos al componente de lucide correspondiente, coloreado con el color de
// marca del servicio. Si el nombre no está mapeado, usamos un fallback.
// ============================================================================
import type { ComponentType } from 'react';
import {
  Apple,
  Castle,
  Clapperboard,
  Film,
  Flame,
  Headphones,
  MonitorPlay,
  Mountain,
  Music,
  Play,
  Tv,
} from 'lucide-react-native';

// Props mínimas que aceptan todos los iconos de lucide.
type IconProps = { color?: string; size?: number };

// Mapa nombre (string en la BD) → componente de lucide.
// Nota: los iconos de marca (Youtube, etc.) ya no están en lucide; usamos
// "play" como aproximación visual para YouTube Premium.
const ICONS: Record<string, ComponentType<IconProps>> = {
  clapperboard: Clapperboard,
  castle: Castle,
  film: Film,
  play: Play,
  apple: Apple,
  mountain: Mountain,
  flame: Flame,
  tv: Tv,
  'monitor-play': MonitorPlay,
  youtube: Play,
  music: Music,
  headphones: Headphones,
};

interface ServiceIconProps {
  name: string;
  color?: string;
  size?: number;
}

export function ServiceIcon({ name, color = '#7C3AED', size = 24 }: ServiceIconProps) {
  const Icon = ICONS[name] ?? Clapperboard;
  return <Icon color={color} size={size} />;
}
