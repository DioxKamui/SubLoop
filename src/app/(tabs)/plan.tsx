// ============================================================================
// (tabs)/plan.tsx — Pantalla del plan de rotación
// ----------------------------------------------------------------------------
// Muestra el detalle mes a mes: qué servicios mantener y cuánto costaría cada
// mes según el algoritmo.
// ============================================================================
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';

import { Screen } from '@/components/ui/Screen';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useProfile } from '@/hooks/useProfile';
import { buildRotationPlan } from '@/lib/rotation/algorithm';
import { formatMoney } from '@/lib/money';
import { colors, fonts, radius, spacing, type } from '@/constants/theme';

export default function PlanScreen() {
  const { data: subscriptions = [], isLoading: subsLoading } = useSubscriptions();
  const { data: watchlist = [], isLoading: watchLoading } = useWatchlist();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const plan = useMemo(
    () =>
      buildRotationPlan({
        subscriptions,
        watchlist,
        monthlyBudgetCents: profile?.monthly_budget_cents ?? 0,
      }),
    [subscriptions, watchlist, profile?.monthly_budget_cents],
  );

  // Mapa service_id → nombre del servicio (para mostrar nombres legibles).
  const serviceNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of subscriptions) {
      if (s.service) map.set(s.service_id, s.service.name);
    }
    return map;
  }, [subscriptions]);

  const isLoading = subsLoading || watchLoading || profileLoading;

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={plan.months}
        keyExtractor={(item) => item.month}
        ListHeaderComponent={<Text style={styles.title}>Rotation plan</Text>}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.month}>{format(new Date(`${item.month}-01`), 'MMMM yyyy')}</Text>
            <Text style={styles.services}>
              {item.service_ids.map((id) => serviceNames.get(id) ?? 'Unknown').join(', ') ||
                'No services'}
            </Text>
            <Text style={styles.cost}>{formatMoney(item.total_cents)}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: spacing.xl,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: type.heading,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  month: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.bodySemi,
    fontSize: type.body,
  },
  services: {
    flex: 2,
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.caption,
  },
  cost: {
    color: colors.primary,
    fontFamily: fonts.number,
    fontSize: type.body,
  },
});
