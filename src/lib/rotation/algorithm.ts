// ============================================================================
// algorithm.ts — Algoritmo de rotación (puro y testeable)
// ----------------------------------------------------------------------------
// Función pura: no lee ni escribe nada externo (ni red, ni BD, ni estado).
// Dadas las suscripciones, la watchlist y un presupuesto, calcula qué servicios
// mantener cada mes para maximizar el contenido que ves por cada peso.
//
// Estrategia (greedy "valor por peso"):
//   - Cada servicio se puntúa: (títulos pendientes * PESO + prioridad) / precio.
//   - Se ordenan de mayor a menor puntuación.
//   - Se eligen en orden mientras quepa en el presupuesto mensual.
// ============================================================================
import { addMonths, format } from 'date-fns';

import type { PlanMonth, Subscription, WatchlistItem } from '@/types/models';

// Cuánto pesa un título pendiente frente a la prioridad (1-5) del usuario.
const WATCH_WEIGHT = 2;

export interface RotationInput {
  subscriptions: Subscription[];
  watchlist: WatchlistItem[];
  monthlyBudgetCents: number;
  months?: number;       // cuántos meses proyectar (por defecto 12)
  startDate?: Date;      // mes de inicio (por defecto el mes actual)
}

export interface RotationResult {
  baselineMonthlyCents: number;   // suma de TODAS las suscripciones activas
  optimizedMonthlyCents: number;  // promedio mensual del plan optimizado
  annualSavingsCents: number;     // ahorro anual estimado
  months: PlanMonth[];            // detalle mes a mes
}

export function buildRotationPlan(input: RotationInput): RotationResult {
  const {
    subscriptions,
    watchlist,
    monthlyBudgetCents,
    months = 12,
    startDate = new Date(),
  } = input;

  // Solo consideramos suscripciones activas.
  const active = subscriptions.filter((s) => s.status === 'active');

  // Línea base: pagar todo a la vez.
  const baselineMonthlyCents = active.reduce((sum, s) => sum + s.price_cents, 0);

  // Cuenta cuántos títulos pendientes hay por servicio.
  const wantCount = new Map<string, number>();
  for (const item of watchlist) {
    if (item.status === 'want') {
      wantCount.set(item.service_id, (wantCount.get(item.service_id) ?? 0) + 1);
    }
  }

  // Puntúa cada servicio por "valor por peso".
  const scored = active
    .map((subscription) => ({
      subscription,
      score:
        ((wantCount.get(subscription.service_id) ?? 0) * WATCH_WEIGHT +
          subscription.priority) /
        subscription.price_cents,
    }))
    .sort((a, b) => b.score - a.score);

  const plan: PlanMonth[] = [];
  let totalAcrossMonths = 0;

  for (let i = 0; i < months; i++) {
    const month = format(addMonths(startDate, i), 'yyyy-MM');

    const service_ids: string[] = [];
    let total_cents = 0;

    // Selección greedy: agrega servicios en orden de puntuación mientras quepan.
    for (const { subscription } of scored) {
      if (total_cents + subscription.price_cents <= monthlyBudgetCents) {
        service_ids.push(subscription.service_id);
        total_cents += subscription.price_cents;
      }
    }

    plan.push({ month, service_ids, total_cents });
    totalAcrossMonths += total_cents;
  }

  const optimizedMonthlyCents = Math.round(totalAcrossMonths / months);
  // El ahorro nunca puede ser negativo (si el presupuesto cubre todo, es 0).
  const annualSavingsCents = Math.max(0, (baselineMonthlyCents - optimizedMonthlyCents) * 12);

  return {
    baselineMonthlyCents,
    optimizedMonthlyCents,
    annualSavingsCents,
    months: plan,
  };
}
