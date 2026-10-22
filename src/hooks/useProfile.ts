// ============================================================================
// useProfile.ts — Datos del perfil del usuario
// ----------------------------------------------------------------------------
// El perfil se crea automáticamente al registrarse (trigger handle_new_user).
// Aquí lo leemos y permitimos actualizar presupuesto, moneda y notificaciones.
// ============================================================================
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserId, supabase } from '@/lib/supabase';
import type { Profile } from '@/types/models';

export const profileKeys = ['profile'] as const;

export interface UpdateProfileInput {
  monthly_budget_cents: number;
  currency: string;
  notify_enabled: boolean;
}

export function useProfile() {
  return useQuery({
    queryKey: profileKeys,
    queryFn: async () => {
      const id = await getUserId();
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const id = await getUserId();
      const { error } = await supabase.from('profiles').update(input).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys }),
  });
}
