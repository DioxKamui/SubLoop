// ============================================================================
// algorithm.test.ts — Tests del algoritmo de rotación
// ----------------------------------------------------------------------------
// Verifican el comportamiento puro del algoritmo sin tocar Supabase ni la red.
// ============================================================================
import { describe, expect, it } from 'vitest';

import { buildRotationPlan } from './algorithm';
import type { Subscription, WatchlistItem } from '@/types/models';

// Helpers para construir datos de prueba sin repetir campos en cada test.
function sub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: 's1',
    user_id: 'u1',
    service_id: 'netflix',
    price_cents: 21900,
    billing_day: 1,
    priority: 3,
    status: 'active',
    notes: null,
    created_at: '',
    ...overrides,
  };
}

function watch(overrides: Partial<WatchlistItem> = {}): WatchlistItem {
  return {
    id: 'w1',
    user_id: 'u1',
    service_id: 'netflix',
    title: 'Title',
    status: 'want',
    created_at: '',
    ...overrides,
  };
}

describe('buildRotationPlan', () => {
  it('calcula la línea base como la suma de las suscripciones activas', () => {
    const result = buildRotationPlan({
      subscriptions: [
        sub({ id: 'a', price_cents: 20000 }),
        sub({ id: 'b', price_cents: 30000 }),
        sub({ id: 'c', price_cents: 50000, status: 'paused' }), // pausada: no cuenta
      ],
      watchlist: [],
      monthlyBudgetCents: 100000,
    });

    expect(result.baselineMonthlyCents).toBe(50000);
  });

  it('no excede el presupuesto en ningún mes', () => {
    const result = buildRotationPlan({
      subscriptions: [
        sub({ id: 'a', price_cents: 20000 }),
        sub({ id: 'b', price_cents: 30000 }),
        sub({ id: 'c', price_cents: 40000 }),
      ],
      watchlist: [],
      monthlyBudgetCents: 50000,
      months: 12,
    });

    for (const month of result.months) {
      expect(month.total_cents).toBeLessThanOrEqual(50000);
    }
  });

  it('prioriza el servicio con más títulos pendientes', () => {
    const result = buildRotationPlan({
      subscriptions: [
        sub({ id: 'a', service_id: 'srv-a', price_cents: 30000 }),
        sub({ id: 'b', service_id: 'srv-b', price_cents: 30000 }),
      ],
      watchlist: [
        watch({ service_id: 'srv-b' }),
        watch({ service_id: 'srv-b' }),
        watch({ service_id: 'srv-a' }),
      ],
      monthlyBudgetCents: 30000, // solo cabe un servicio
      months: 1,
    });

    // srv-b tiene 2 títulos pendientes vs 1 de srv-a → debe ganar srv-b.
    expect(result.months[0].service_ids).toEqual(['srv-b']);
  });

  it('calcula el ahorro anual correctamente', () => {
    const result = buildRotationPlan({
      subscriptions: [
        sub({ id: 'a', price_cents: 30000 }),
        sub({ id: 'b', price_cents: 30000 }),
      ],
      watchlist: [],
      monthlyBudgetCents: 30000, // solo cabe uno de los dos
      months: 12,
    });

    expect(result.baselineMonthlyCents).toBe(60000);
    expect(result.optimizedMonthlyCents).toBe(30000);
    expect(result.annualSavingsCents).toBe(360000);
  });

  it('proyecta la cantidad de meses solicitada', () => {
    const result = buildRotationPlan({
      subscriptions: [sub()],
      watchlist: [],
      monthlyBudgetCents: 50000,
      months: 6,
    });

    expect(result.months).toHaveLength(6);
  });
});
