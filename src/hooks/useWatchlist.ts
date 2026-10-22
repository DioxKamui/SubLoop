// ============================================================================
// useWatchlist.ts — Datos de la watchlist del usuario
// ----------------------------------------------------------------------------
// Igual que useSubscriptions: una consulta con el servicio relacionado y
// mutaciones para agregar, marcar como visto y eliminar.
// ============================================================================
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getUserId, supabase } from '@/lib/supabase';
import type { WatchlistItem } from '@/types/models';

export const watchlistKeys = ['watchlist'] as const;

export interface NewWatchlistItem {
  service_id: string;
  title: string;
}

export function useWatchlist() {
  return useQuery({
    queryKey: watchlistKeys,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*, service:services(*)')
        .order('created_at');
      if (error) throw error;
      return data as WatchlistItem[];
    },
  });
}

export function useAddWatchlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewWatchlistItem) => {
      const user_id = await getUserId();
      const { error } = await supabase.from('watchlist').insert({
        user_id,
        service_id: input.service_id,
        title: input.title,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: watchlistKeys }),
  });
}

export function useToggleWatchlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'want' | 'done' }) => {
      const { error } = await supabase.from('watchlist').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: watchlistKeys }),
  });
}

export function useDeleteWatchlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('watchlist').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: watchlistKeys }),
  });
}
