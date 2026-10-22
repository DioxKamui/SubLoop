// ============================================================================
// useSubscriptions.ts — Datos de las suscripciones del usuario
// ----------------------------------------------------------------------------
// Una consulta (con el servicio relacionado) y tres mutaciones: agregar,
// pausar/reactivar y eliminar. Cada mutación invalida la caché para que la UI
// se actualice sola.
// ============================================================================
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserId, supabase } from '@/lib/supabase';
import type { Subscription } from '@/types/models';

export const subscriptionsKeys = ['subscriptions'] as const;

// Datos mínimos para crear una suscripción.
export interface NewSubscription {
  service_id: string;
  price_cents: number;
  billing_day: number;
  priority: number;
}

export function useSubscriptions() {
  return useQuery({
    queryKey: subscriptionsKeys,
    queryFn: async () => {
      // El join `service:services(*)` trae el servicio completo de cada fila.
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, service:services(*)')
        .order('created_at');
      if (error) throw error;
      return data as Subscription[];
    },
  });
}

export function useAddSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewSubscription) => {
      const user_id = await getUserId();
      const { error } = await supabase.from('subscriptions').insert({
        user_id,
        service_id: input.service_id,
        price_cents: input.price_cents,
        billing_day: input.billing_day,
        priority: input.priority,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionsKeys }),
  });
}

export function useToggleSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'paused' }) => {
      const { error } = await supabase.from('subscriptions').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionsKeys }),
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subscriptions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subscriptionsKeys }),
  });
}
