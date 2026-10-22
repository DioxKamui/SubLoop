// ============================================================================
// (tabs)/index.tsx — Pantalla de inicio (dashboard)
// ----------------------------------------------------------------------------
// Calcula el plan de rotación con el algoritmo puro y lo muestra: el hero de
// ahorro y la gráfica de los próximos 12 meses. Maneja estados de carga,
// vacío y presupuesto sin configurar. Usa el monstruo del usuario como avatar
// y como mascota de apoyo visual.
// ============================================================================
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { SavingsHero } from '@/components/SavingsHero';
import { MonthlyBars } from '@/components/MonthlyBars';
import { MonsterAvatar } from '@/components/MonsterAvatar';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useProfile } from '@/hooks/useProfile';
import { buildRotationPlan } from '@/lib/rotation/algorithm';
import { DEFAULT_AVATAR } from '@/constants/avatars';
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
  const avatarId = profile?.avatar ?? DEFAULT_AVATAR;

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
        {/* Cabecera con el avatar del usuario. */}
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <MonsterAvatar id={avatarId} size={44} />
        </View>

        {!hasServices ? (
          <View style={styles.emptyCard}>
            <MonsterAvatar id={avatarId} size={64} />
            <Text style={styles.emptyTitle}>No services yet</Text>
            <Text style={styles.emptyText}>
              Add your streaming subscriptions to see how much you could save.
            </Text>
          </View>
        ) : !hasBudget ? (
          <View style={styles.emptyCard}>
            <MonsterAvatar id={avatarId} size={64} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.bodySemi,
    fontSize: type.subtitle,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.body,
    textAlign: 'center',
  },
});
