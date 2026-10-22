// ============================================================================
// models.ts — Tipos compartidos (espejo del esquema de la base de datos)
// ----------------------------------------------------------------------------
// IMPORTANTE: los nombres de las propiedades usan snake_case a propósito, para
// que coincidan EXACTAMENTE con las columnas de Postgres. Así, cuando Supabase
// devuelve una fila, podemos castearla a estos tipos sin mentirle a TypeScript.
// El dinero va SIEMPRE en CENTAVOS enteros (number en TS, bigint en SQL).
// ============================================================================

// Perfil del usuario (tabla `profiles`).
export interface Profile {
  id: string;
  display_name: string;
  monthly_budget_cents: number;
  currency: string;
  notify_enabled: boolean;
  notify_days_before: number;
  created_at: string;
}

// Servicio de streaming (tabla `services`, catálogo estático con seed).
export interface Service {
  id: string;
  slug: string;
  name: string;
  category: 'video' | 'music' | 'other';
  icon: string;       // nombre de icono de lucide (ej. "clapperboard")
  color: string;      // color de marca del servicio (hex)
  deep_link: string;  // url para abrir el servicio desde la app
  default_price_cents: number;
  sort: number;
}

// Suscripción del usuario a un servicio (tabla `subscriptions`).
export interface Subscription {
  id: string;
  user_id: string;
  service_id: string;
  price_cents: number;
  billing_day: number;   // día del mes (1-31) en que cobra
  priority: number;      // 1-5, cuánto le importa al usuario
  status: 'active' | 'paused';
  notes: string | null;
  created_at: string;
  service?: Service;     // relación resuelta (join con `services`)
}

// Ítem de la watchlist (tabla `watchlist`).
export interface WatchlistItem {
  id: string;
  user_id: string;
  service_id: string;
  title: string;
  status: 'want' | 'done';
  created_at: string;
  service?: Service;
}

// Un mes dentro del plan de rotación (guardado en `rotation_plans.plan` JSONB).
export interface PlanMonth {
  month: string;        // 'YYYY-MM'
  service_ids: string[];
  total_cents: number;
}

// Plan de rotación completo (tabla `rotation_plans`).
export interface RotationPlan {
  id: string;
  user_id: string;
  generated_at: string;
  baseline_monthly_cents: number;   // cuánto pagarías manteniendo todo activo
  optimized_monthly_cents: number;  // promedio mensual del plan optimizado
  annual_savings_cents: number;     // ahorro anual estimado
  plan: PlanMonth[];
}
