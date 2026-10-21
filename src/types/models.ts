// ============================================================================
// models.ts — Tipos compartidos (espejo del esquema de la base de datos)
// ----------------------------------------------------------------------------
// Cada interfaz representa una tabla. Usamos "string" para los uuid y las
// fechas porque así llegan desde Supabase (Postgres los serializa a JSON).
// El dinero va SIEMPRE en CENTAVOS enteros (number en TS, bigint en SQL).
// ============================================================================

// Perfil del usuario (tabla `profiles`).
export interface Profile {
  id: string;
  displayName: string;
  monthlyBudgetCents: number;
  currency: string;
  notifyEnabled: boolean;
  notifyDaysBefore: number;
  createdAt: string;
}

// Servicio de streaming (tabla `services`, catálogo estático con seed).
export interface Service {
  id: string;
  slug: string;
  name: string;
  category: 'video' | 'music' | 'other';
  icon: string;       // nombre de icono de lucide (ej. "clapperboard")
  color: string;      // color de marca del servicio (hex)
  deepLink: string;   // esquema/url para abrir la app del servicio
  defaultPriceCents: number;
}

// Suscripción del usuario a un servicio (tabla `subscriptions`).
export interface Subscription {
  id: string;
  userId: string;
  serviceId: string;
  priceCents: number;
  billingDay: number;   // día del mes (1-31) en que cobra
  priority: number;     // 1-5, cuánto le importa al usuario
  status: 'active' | 'paused';
  notes: string | null;
  createdAt: string;
  service?: Service;    // relación resuelta (join con `services`)
}

// Ítem de la watchlist (tabla `watchlist`).
export interface WatchlistItem {
  id: string;
  userId: string;
  serviceId: string;
  title: string;
  status: 'want' | 'done';
  createdAt: string;
  service?: Service;
}

// Un mes dentro del plan de rotación (guardado en `rotation_plans.plan` JSONB).
export interface PlanMonth {
  month: string;        // 'YYYY-MM'
  serviceIds: string[];
  totalCents: number;
}

// Plan de rotación completo (tabla `rotation_plans`).
export interface RotationPlan {
  id: string;
  userId: string;
  generatedAt: string;
  baselineMonthlyCents: number;   // cuánto pagarías manteniendo todo activo
  optimizedMonthlyCents: number;  // promedio mensual del plan optimizado
  annualSavingsCents: number;     // ahorro anual estimado
  months: PlanMonth[];
}
