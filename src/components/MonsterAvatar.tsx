// ============================================================================
// MonsterAvatar.tsx — Avatar de monstruo (dibujado con SVG)
// ----------------------------------------------------------------------------
// Dibuja un "dibujito" de monstruo clásico según su clave (vampiro, hombre
// lobo, fantasma, momia, zombi, bruja, Frankenstein...). Se usa como foto de
// perfil y como mascota de apoyo visual. Todo con react-native-svg, sin assets.
// ============================================================================
import type { ReactElement } from 'react';
import Svg, { Circle, Ellipse, Path, Polygon, Rect } from 'react-native-svg';

interface MonsterAvatarProps {
  id: string;
  size?: number;
}

export function MonsterAvatar({ id, size = 48 }: MonsterAvatarProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {MONSTERS[id] ?? MONSTERS.ghost}
    </Svg>
  );
}

// Conjunto de monstruos. Cada entrada es el contenido SVG dentro de un viewBox 64x64.
const MONSTERS: Record<string, ReactElement> = {
  // Fantasma: sábana blanca con borde ondulado y dos ojos grandes.
  ghost: (
    <>
      <Path
        d="M32 7 C20 7 13 16 13 29 L13 55 L19 48 L25 55 L32 48 L39 55 L45 48 L51 55 L51 29 C51 16 44 7 32 7 Z"
        fill="#EDF2F7"
        stroke="#94A3B8"
        strokeWidth={1}
      />
      <Circle cx="24" cy="28" r="4" fill="#1E293B" />
      <Circle cx="40" cy="28" r="4" fill="#1E293B" />
      <Ellipse cx="32" cy="39" rx="3.5" ry="4.5" fill="#1E293B" />
    </>
  ),

  // Vampiro: cara pálida, pico de viuda, colmillos y capa roja.
  vampire: (
    <>
      <Circle cx="32" cy="33" r="25" fill="#E9D8FD" />
      <Path
        d="M12 29 C13 13 21 7 32 7 C43 7 51 13 52 29 L52 21 C52 11 44 5 32 5 C20 5 12 11 12 21 Z"
        fill="#1E293B"
      />
      <Circle cx="23" cy="32" r="3.5" fill="#1E293B" />
      <Circle cx="41" cy="32" r="3.5" fill="#1E293B" />
      <Path d="M26 43 Q32 40 38 43 L38 46 Q32 49 26 46 Z" fill="#991B1B" />
      <Polygon points="28,43 30,43 29,48" fill="#FFFFFF" />
      <Polygon points="36,43 34,43 35,48" fill="#FFFFFF" />
      <Path d="M17 60 L32 45 L47 60 Z" fill="#DC2626" />
    </>
  ),

  // Vampira: pelo largo oscuro, labios rojos y colmillos.
  vampira: (
    <>
      <Circle cx="32" cy="32" r="24" fill="#F6E7F4" />
      <Path d="M14 22 C14 12 20 8 32 8 C44 8 50 12 50 22 L50 34 C44 30 20 30 14 34 Z" fill="#1E293B" />
      <Path d="M14 26 C12 40 14 54 16 60 L22 52 L20 40 L20 24 Z" fill="#1E293B" />
      <Path d="M50 26 C52 40 50 54 48 60 L42 52 L44 40 L44 24 Z" fill="#1E293B" />
      <Circle cx="24" cy="30" r="3" fill="#1E293B" />
      <Circle cx="40" cy="30" r="3" fill="#1E293B" />
      <Path d="M27 40 Q32 37 37 40 Q32 43 27 40 Z" fill="#DB2777" />
      <Polygon points="29,40 31,40 30,44" fill="#FFFFFF" />
      <Polygon points="35,40 33,40 34,44" fill="#FFFFFF" />
    </>
  ),

  // Hombre lobo: pelaje marrón, orejas puntiagudas y hocico con colmillos.
  werewolf: (
    <>
      <Circle cx="32" cy="34" r="24" fill="#A9795B" />
      <Polygon points="12,18 20,6 24,20" fill="#A9795B" />
      <Polygon points="52,18 44,6 40,20" fill="#A9795B" />
      <Circle cx="23" cy="30" r="3.5" fill="#1E293B" />
      <Circle cx="41" cy="30" r="3.5" fill="#1E293B" />
      <Ellipse cx="32" cy="40" rx="7" ry="5" fill="#D9B99B" />
      <Ellipse cx="32" cy="38" rx="3" ry="2.5" fill="#1E293B" />
      <Polygon points="28,44 30,44 29,49" fill="#FFFFFF" />
      <Polygon points="36,44 34,44 35,49" fill="#FFFFFF" />
    </>
  ),

  // Momia: vendas beige y ojos asomando.
  mummy: (
    <>
      <Circle cx="32" cy="32" r="25" fill="#E4D5B5" />
      <Path d="M12 24 Q32 20 52 24" stroke="#C9B58B" strokeWidth={3} fill="none" />
      <Path d="M12 32 Q32 28 52 32" stroke="#C9B58B" strokeWidth={3} fill="none" />
      <Path d="M12 40 Q32 36 52 40" stroke="#C9B58B" strokeWidth={3} fill="none" />
      <Path d="M12 48 Q32 44 52 48" stroke="#C9B58B" strokeWidth={3} fill="none" />
      <Circle cx="24" cy="27" r="3.5" fill="#1E293B" />
      <Circle cx="40" cy="27" r="3.5" fill="#1E293B" />
    </>
  ),

  // Zombi: cara verde, ojos desparejos y boca cosida.
  zombie: (
    <>
      <Circle cx="32" cy="32" r="25" fill="#93C572" />
      <Circle cx="24" cy="28" r="4" fill="#FFFFFF" />
      <Circle cx="24" cy="29" r="2" fill="#1E293B" />
      <Ellipse cx="40" cy="28" rx="3" ry="4" fill="#FFFFFF" />
      <Circle cx="40" cy="30" r="1.5" fill="#1E293B" />
      <Path d="M22 42 L42 42" stroke="#5B8A3C" strokeWidth={3} />
      <Path d="M26 42 L28 46 M32 42 L32 46 M38 42 L36 46" stroke="#5B8A3C" strokeWidth={2} />
      <Path d="M18 20 Q22 14 28 18" stroke="#5B8A3C" strokeWidth={2} fill="none" />
    </>
  ),

  // Bruja: cara verde, sombrero morado puntiagudo, nariz y verruga.
  witch: (
    <>
      <Circle cx="32" cy="36" r="22" fill="#9ACD8C" />
      <Polygon points="18,22 32,2 46,22 32,16" fill="#7C3AED" />
      <Rect x="18" y="18" width="28" height="5" rx="2.5" fill="#7C3AED" />
      <Circle cx="24" cy="34" r="3" fill="#1E293B" />
      <Circle cx="40" cy="34" r="3" fill="#1E293B" />
      <Polygon points="32,36 44,44 32,43" fill="#9ACD8C" />
      <Circle cx="44" cy="44" r="2" fill="#6B8A5C" />
      <Path d="M24 46 Q32 42 40 46" stroke="#1E293B" strokeWidth={2} fill="none" />
    </>
  ),

  // Frankenstein: cabeza verde cuadrada, flequillo recto y tornillos.
  frankenstein: (
    <>
      <Rect x="10" y="12" width="44" height="42" rx="8" fill="#A6C48A" />
      <Path d="M10 22 L54 22 L54 16 L10 16 Z" fill="#1E293B" />
      <Path d="M14 16 L22 8 L22 16 Z" fill="#1E293B" />
      <Path d="M50 16 L42 8 L42 16 Z" fill="#1E293B" />
      <Circle cx="24" cy="30" r="3" fill="#1E293B" />
      <Circle cx="40" cy="30" r="3" fill="#1E293B" />
      <Path d="M26 40 L38 40" stroke="#1E293B" strokeWidth={2} />
      <Rect x="6" y="38" width="5" height="10" rx="1.5" fill="#9CA3AF" />
      <Rect x="53" y="38" width="5" height="10" rx="1.5" fill="#9CA3AF" />
    </>
  ),
};
