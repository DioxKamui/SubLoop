// ============================================================================
// useServices.ts — Catálogo de servicios de streaming
// ----------------------------------------------------------------------------
// Lee la tabla `services` (catálogo estático, igual para todos). No tiene
// mutaciones: es de solo lectura desde el cliente.
// ============================================================================
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { Service } from '@/types/models';

// Clave de caché compartida; si algo cambia el catálogo, se invalida con ella.
export const servicesKeys = ['services'] as const;

export function useServices() {
  return useQuery({
    queryKey: servicesKeys,
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('sort');
      if (error) throw error;
      return data as Service[];
    },
  });
}
