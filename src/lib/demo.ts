// ============================================================================
// demo.ts — Modo demo: cuenta de ejemplo con datos sembrados
// ----------------------------------------------------------------------------
// Permite entrar a una cuenta demo con un clic y sembrar datos realistas
// (suscripciones, watchlist y presupuesto) para que el producto se vea lleno.
// ============================================================================
import { getUserId, supabase } from '@/lib/supabase';
import type { Service } from '@/types/models';

const DEMO_EMAIL = 'demo@subloop.app';
const DEMO_PASSWORD = 'subloop-demo-2026';

// Servicios de ejemplo: slug → (día de cobro, prioridad).
const DEMO_SUBSCRIPTIONS = [
  { slug: 'netflix', day: 5, priority: 5 },
  { slug: 'disney-plus', day: 12, priority: 4 },
  { slug: 'max', day: 20, priority: 3 },
  { slug: 'prime-video', day: 8, priority: 2 },
  { slug: 'spotify', day: 15, priority: 5 },
  { slug: 'youtube-premium', day: 25, priority: 4 },
];

// Títulos de ejemplo por servicio.
const DEMO_WATCHLIST = [
  { slug: 'netflix', title: 'Stranger Things' },
  { slug: 'netflix', title: 'Wednesday' },
  { slug: 'disney-plus', title: 'The Mandalorian' },
  { slug: 'disney-plus', title: 'Loki' },
  { slug: 'max', title: 'The Last of Us' },
  { slug: 'max', title: 'House of the Dragon' },
  { slug: 'prime-video', title: 'The Boys' },
  { slug: 'spotify', title: 'New Music Friday' },
  { slug: 'youtube-premium', title: 'Cobra Kai' },
];

const DEMO_BUDGET_CENTS = 40000; // $400 MXN
const DEMO_AVATAR = 'werewolf';

// Entra (o crea) la cuenta demo y siembra sus datos si está vacía.
export async function loginToDemo(): Promise<void> {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  // Si no existe, la creamos.
  if (signInError) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (signUpError) throw signUpError;
    if (!signUpData.session) {
      // Requiere confirmar el correo: para el demo hay que desactivarlo.
      throw new Error('El demo requiere "Confirm email" desactivado en Supabase.');
    }
  }

  await seedDemoData();
}

// Siembra suscripciones, watchlist y presupuesto solo si la cuenta está vacía.
async function seedDemoData(): Promise<void> {
  const userId = await getUserId();

  // Si ya tiene suscripciones, no volvemos a sembrar.
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
  if (existing && existing.length > 0) return;

  const { data } = await supabase.from('services').select('*');
  const catalog = (data as Service[]) ?? [];
  const bySlug = (slug: string) => catalog.find((s) => s.slug === slug);

  // Suscripciones (usa el precio por defecto del catálogo).
  const subscriptions = DEMO_SUBSCRIPTIONS.flatMap(({ slug, day, priority }) => {
    const service = bySlug(slug);
    return service
      ? [
          {
            user_id: userId,
            service_id: service.id,
            price_cents: service.default_price_cents,
            billing_day: day,
            priority,
          },
        ]
      : [];
  });
  if (subscriptions.length > 0) {
    await supabase.from('subscriptions').insert(subscriptions);
  }

  // Watchlist.
  const watchlist = DEMO_WATCHLIST.flatMap(({ slug, title }) => {
    const service = bySlug(slug);
    return service ? [{ user_id: userId, service_id: service.id, title }] : [];
  });
  if (watchlist.length > 0) {
    await supabase.from('watchlist').insert(watchlist);
  }

  // Presupuesto + avatar.
  await supabase
    .from('profiles')
    .update({ monthly_budget_cents: DEMO_BUDGET_CENTS, avatar: DEMO_AVATAR })
    .eq('id', userId);
}
