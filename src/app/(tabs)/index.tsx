// ============================================================================
// (tabs)/index.tsx — Pantalla de inicio (dashboard)
// ----------------------------------------------------------------------------
// Calcula el plan de rotación con el algoritmo puro y lo muestra: el hero de
// ahorro y la gráfica de los próximos 12 meses. Maneja estados de carga,
// vacío y presupuesto sin configurar.
// ============================================================================
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { SavingsHero } from '@/components/SavingsHero';
import { MonthlyBars } from '@/components/MonthlyBars';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useProfile } from '@/hooks/useProfile';
import { buildRotationPlan } from '@/lib/rotation/algorithm';
import { colors, fonts, radius, spacing, type } from '@/constants/theme';

export default function HomeScreen() {
  const { data: subscriptions = [], isLoading: subsLoading } = useSubscriptions();
  const { data: watchlist = [], isLoading: watchLoading } = useWatchlist();
  const { data: profile, isLoading: profileLoading } = useProfile();

  // Calculamos el plan SOLO cuando cambian los datos de entrada.
  const plan = useMemo(
    () =>
      buildRotationPlan({
        subscriptions,
        watchlist,
        monthlyBudgetCents: profile?.monthly_budget_cents ?? 0,
      }),
    [subscriptions, watchlist, profile?.monthly_budget_cents],
  );

  const isLoading = subsLoading || watchLoading || profileLoading;
  const hasServices = subscriptions.some((s) => s.status === 'active');
  const hasBudget = (profile?.monthly_budget_cents ?? 0) > 0;

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Home</Text>

        {!hasServices ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No services yet</Text>
            <Text style={styles.emptyText}>
              Add your streaming subscriptions to see how much you could save.
            </Text>
          </View>
        ) : !hasBudget ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Set your budget</Text>
            <Text style={styles.emptyText}>
              Add a monthly budget in Settings to generate your rotation plan.
            </Text>
          </View>
        ) : (
          <>
            <SavingsHero
              baselineMonthlyCents={plan.baselineMonthlyCents}
              optimizedMonthlyCents={plan.optimizedMonthlyCents}
              annualSavingsCents={plan.annualSavingsCents}
            />

            <Text style={styles.sectionTitle}>Next 12 months</Text>
            <MonthlyBars months={plan.months} baselineMonthlyCents={plan.baselineMonthlyCents} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: spacing.xl,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: type.heading,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.displaySemi,
    fontSize: type.title,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.bodySemi,
    fontSize: type.subtitle,
  },
  emptyText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.body,
  },
});
