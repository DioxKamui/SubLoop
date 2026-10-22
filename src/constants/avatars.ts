// ============================================================================
// avatars.ts — Catálogo de avatares (monstruos clásicos)
// ----------------------------------------------------------------------------
// Opciones de "foto de perfil" que el usuario puede elegir para representarse.
// La clave `id` es lo que se guarda en `profiles.avatar`.
// ============================================================================
export interface AvatarOption {
  id: string;
  label: string;
}

export const AVATARS: AvatarOption[] = [
  { id: 'ghost', label: 'Ghost' },
  { id: 'vampire', label: 'Vampire' },
  { id: 'vampira', label: 'Vampira' },
  { id: 'werewolf', label: 'Werewolf' },
  { id: 'mummy', label: 'Mummy' },
  { id: 'zombie', label: 'Zombie' },
  { id: 'witch', label: 'Witch' },
  { id: 'frankenstein', label: 'Frankenstein' },
];

export const DEFAULT_AVATAR = 'ghost';
