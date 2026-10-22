// ============================================================================
// SavingsHero.tsx — Tarjeta principal de ahorro (el elemento "llamativo")
// ----------------------------------------------------------------------------
// Muestra, de forma animada pero breve:
//   - un anillo "loop" con el % de ahorro (con gradiente y glow),
//   - cuánto pagarías optimizando (cifra que cuenta hacia arriba),
//   - la línea base (cuánto pagarías manteniendo todo),
//   - y el ahorro anual estimado.
// ============================================================================
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { useCountUp } from '@/hooks/useCountUp';
import { formatMoneyWhole } from '@/lib/money';
import { colors, fonts, radius, spacing, type } from '@/constants/theme';

const RING_SIZE = 120;
const RING_RADIUS = 52;
const RING_STROKE = 10;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface SavingsHeroProps {
  baselineMonthlyCents: number;
  optimizedMonthlyCents: number;
  annualSavingsCents: number;
}

export function SavingsHero({
  baselineMonthlyCents,
  optimizedMonthlyCents,
  annualSavingsCents,
}: SavingsHeroProps) {
  // Cifras animadas (solo las "buenas noticias" cuentan hacia arriba).
  const optimized = useCountUp(optimizedMonthlyCents);
  const annual = useCountUp(annualSavingsCents);

  // Porcentaje de ahorro para el anillo (0-100).
  const savingsPct =
    baselineMonthlyCents > 0
      ? Math.max(0, Math.min(100, Math.round((1 - optimizedMonthlyCents / baselineMonthlyCents) * 100)))
      : 0;

  // Entrada sutil de la tarjeta (fade + deslizamiento).
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(12));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.eyebrow}>ROTATION PLAN</Text>

      {/* Anillo "loop": el elemento firma de la marca, con gradiente. */}
      <View style={styles.ringWrap}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Defs>
            <LinearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} />
              <Stop offset="100%" stopColor={colors.savings} />
            </LinearGradient>
          </Defs>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke={colors.border}
            strokeWidth={RING_STROKE}
            fill="none"
          />
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke="url(#ring-grad)"
            strokeWidth={RING_STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${RING_CIRCUMFERENCE}`}
            strokeDashoffset={`${RING_CIRCUMFERENCE * (1 - savingsPct / 100)}`}
            rotation={-90}
            originX={RING_SIZE / 2}
            originY={RING_SIZE / 2}
          />
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={styles.ringPct}>{savingsPct}%</Text>
          <Text style={styles.ringLabel}>saved</Text>
        </View>
      </View>

      <Text style={styles.payLabel}>You&apos;d pay</Text>
      <Text style={styles.optimized}>
        {formatMoneyWhole(optimized)}
        <Text style={styles.unit}> /mo</Text>
      </Text>
      <Text style={styles.baseline}>instead of {formatMoneyWhole(baselineMonthlyCents)} /mo</Text>

      <View style={styles.divider} />

      <Text style={styles.savings}>Save {formatMoneyWhole(annual)} a year</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    // Glow dorado suave para dar profundidad.
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: type.caption,
    fontFamily: fonts.bodySemi,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  ringWrap: {
    alignSelf: 'center',
    marginVertical: spacing.md,
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPct: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: type.heading,
  },
  ringLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.caption,
  },
  payLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.body,
  },
  optimized: {
    color: colors.primary,
    fontFamily: fonts.display,
    fontSize: type.display,
    lineHeight: type.display + 6,
  },
  unit: {
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
    fontSize: type.body,
  },
  baseline: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.body,
    textDecorationLine: 'line-through',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  savings: {
    color: colors.savings,
    fontFamily: fonts.bodySemi,
    fontSize: type.subtitle,
  },
});
