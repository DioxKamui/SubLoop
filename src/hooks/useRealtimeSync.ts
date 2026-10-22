// ============================================================================
// useRealtimeSync.ts — Sincronización en tiempo real con Supabase Realtime
// ----------------------------------------------------------------------------
// Se suscribe a los cambios de las tablas relevantes y refresca la caché de
// react-query cuando llegan eventos. Así los datos se actualizan solos sin
// recargar la pantalla.
// ============================================================================
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { subscriptionsKeys } from '@/hooks/useSubscriptions';
import { watchlistKeys } from '@/hooks/useWatchlist';

export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('data-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions' }, () => {
        queryClient.invalidateQueries({ queryKey: subscriptionsKeys });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'watchlist' }, () => {
        queryClient.invalidateQueries({ queryKey: watchlistKeys });
      })
      .subscribe();

    // Al desmontar, cerramos el canal para no dejar conexiones abiertas.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
