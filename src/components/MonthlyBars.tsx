// ============================================================================
// MonthlyBars.tsx — Gráfica de barras de los 12 meses
// ----------------------------------------------------------------------------
// Compara el costo optimizado por mes (barras doradas) contra la línea base
// (línea discontinua rosa). Las barras crecen con un escalonado sutil.
// ============================================================================
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';

import { colors, fonts, spacing, type } from '@/constants/theme';
import type { PlanMonth } from '@/types/models';

const CHART_HEIGHT = 140;

interface MonthlyBarsProps {
  months: PlanMonth[];
  baselineMonthlyCents: number;
}

export function MonthlyBars({ months, baselineMonthlyCents }: MonthlyBarsProps) {
  // El valor máximo define la escala; evita dividir entre 0.
  const maxValue = Math.max(baselineMonthlyCents, ...months.map((m) => m.total_cents), 1);

  // Una barra animada por mes, creada una sola vez (estable).
  const [bars] = useState(() => months.map(() => new Animated.Value(0)));

  useEffect(() => {
    Animated.stagger(
      40,
      bars.map((bar) =>
        Animated.timing(bar, { toValue: 1, duration: 420, useNativeDriver: false }),
      ),
    ).start();
  }, [bars]);

  // Altura de la línea base dentro de la escala.
  const baselineHeight = (baselineMonthlyCents / maxValue) * CHART_HEIGHT;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {/* Línea de referencia de la línea base. */}
        <View style={[styles.baseline, { bottom: baselineHeight }]} />

        {months.map((month, i) => {
          const height = (month.total_cents / maxValue) * CHART_HEIGHT;
          return (
            <View key={month.month} style={styles.column}>
              <View style={styles.track}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: bars[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, height],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.label}>{shortMonth(month.month)}</Text>
            </View>
          );
        })}
      </View>

      {/* Leyenda breve. */}
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Optimized</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.dot, styles.dashDot]} />
          <Text style={styles.legendText}>Baseline</Text>
        </View>
      </View>
    </View>
  );
}

// Convierte 'YYYY-MM' en una etiqueta corta de mes ('Oct').
function shortMonth(monthKey: string): string {
  const date = new Date(`${monthKey}-01`);
  return format(date, 'MMM');
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 24, // espacio extra para las etiquetas
    gap: spacing.xs,
  },
  baseline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.waste,
    zIndex: 1,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  track: {
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    width: '100%',
  },
  bar: {
    width: '100%',
    maxWidth: 20,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 4,
    opacity: 0.9,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.caption,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dashDot: {
    borderWidth: 1,
    borderColor: colors.waste,
    backgroundColor: 'transparent',
  },
  legendText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.caption,
  },
});
