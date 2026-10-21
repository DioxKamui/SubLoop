-- ============================================================================
-- 0001_init.sql — Esquema inicial de SubLoop
-- ----------------------------------------------------------------------------
-- Una "migración" es un archivo SQL que cambia la estructura de la base de
-- datos. Se numeran para aplicarse EN ORDEN. Esta crea:
--   1. Las tablas (profiles, services, subscriptions, watchlist, rotation_plans).
--   2. La seguridad por filas (RLS): cada usuario solo ve SUS datos.
--   3. Un trigger que crea el perfil cuando alguien se registra.
--   4. El catálogo de servicios de streaming (seed).
--
-- Convenciones (igual que FINA):
--   * El dinero va SIEMPRE en CENTAVOS enteros (bigint): 219.00 = 21900.
--   * Cada tabla de datos lleva user_id (el dueño de la fila).
--   * Requiere PostgreSQL 15 o superior (Supabase lo cumple).
-- ============================================================================


-- ============================================================================
-- 1. TABLAS
-- ============================================================================

-- ---- profiles: un perfil por usuario; guarda su presupuesto y preferencias. -
-- Supabase guarda las cuentas en auth.users (tabla interna). No la tocamos:
-- creamos "profiles" con el mismo id y le añadimos nuestros datos.
create table public.profiles (
  -- "references ... on delete cascade": si se borra la cuenta, se borra el perfil.
  id                    uuid primary key references auth.users (id) on delete cascade,
  display_name          text not null default '',
  -- Presupuesto mensual que el usuario quiere gastar en streaming (en centavos).
  monthly_budget_cents  bigint not null default 0,
  currency              text not null default 'MXN',
  notify_enabled        boolean not null default true,
  -- Cuántos días antes del cobro avisar (ej. 3 = "cobra en 3 días").
  notify_days_before    smallint not null default 3
    check (notify_days_before between 1 and 30),
  created_at            timestamptz not null default now()
);

-- ---- services: catálogo estático de servicios de streaming (compartido). ----
create table public.services (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,       -- 'netflix', 'disney-plus'...
  name                 text not null,
  category             text not null check (category in ('video', 'music', 'other')),
  icon                 text not null default 'clapperboard',  -- nombre de icono (lucide)
  color                text not null default '#7C3AED',       -- color de marca (hex)
  -- URL para abrir el servicio desde la app (deep link; web por ahora).
  deep_link            text not null default '',
  -- Precio mensual por defecto (centavos). El usuario puede ajustarlo.
  default_price_cents  bigint not null check (default_price_cents > 0),
  sort                 integer not null default 0,  -- orden en el picker
  created_at           timestamptz not null default now()
);

-- ---- subscriptions: qué servicios tiene cada usuario y cuánto le cuestan. ---
create table public.subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  service_id    uuid not null references public.services (id) on delete cascade,
  -- Precio real que paga el usuario (puede diferir del precio por defecto).
  price_cents   bigint not null check (price_cents > 0),
  -- Día del mes (1-31) en que se cobra. Sirve para avisar antes del cobro.
  billing_day   smallint not null check (billing_day between 1 and 31),
  -- 1-5: cuánto le importa al usuario (pesa en el algoritmo de rotación).
  priority      smallint not null default 3 check (priority between 1 and 5),
  status        text not null default 'active' check (status in ('active', 'paused')),
  notes         text,
  created_at    timestamptz not null default now(),
  -- Un usuario no puede registrar dos veces el mismo servicio.
  unique (user_id, service_id)
);
create index subscriptions_user_idx on public.subscriptions (user_id);

-- ---- watchlist: lo que el usuario quiere ver, asociado a un servicio. -------
create table public.watchlist (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  service_id   uuid not null references public.services (id) on delete cascade,
  title        text not null,
  -- 'want' = pendiente (pesa en el algoritmo); 'done' = ya visto.
  status       text not null default 'want' check (status in ('want', 'done')),
  created_at   timestamptz not null default now()
);
create index watchlist_user_idx on public.watchlist (user_id);

-- ---- rotation_plans: el resultado del algoritmo, guardado para consultarlo. -
create table public.rotation_plans (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references auth.users (id) on delete cascade,
  generated_at              timestamptz not null default now(),
  months                    smallint not null default 12,
  -- Cuánto pagaría manteniendo TODO activo (suma de suscripciones).
  baseline_monthly_cents    bigint not null,
  -- Promedio mensual del plan optimizado.
  optimized_monthly_cents   bigint not null,
  -- Ahorro anual estimado: (baseline - optimized) * 12.
  annual_savings_cents      bigint not null,
  -- Detalle mes a mes: [{ "month": "2026-10", "service_ids": [...], "total_cents": ... }].
  plan                      jsonb not null default '[]'::jsonb
);
create index rotation_plans_user_idx on public.rotation_plans (user_id, generated_at desc);


-- ============================================================================
-- 2. TRIGGER: crear el perfil cuando alguien se registra
-- ============================================================================
-- Un "trigger" es código que la BD ejecuta automáticamente ante un evento.
-- Aquí: tras insertar en auth.users (alguien se registró), creamos su fila en
-- public.profiles. "new" es la fila recién insertada.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    -- Usa el nombre enviado al registrarse; si no hay, la parte del correo antes de "@".
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================================
-- 3. SEGURIDAD POR FILAS (RLS — Row Level Security)
-- ============================================================================
-- Con RLS activado, NADIE ve ninguna fila salvo que una política lo permita.
-- Las políticas se evalúan en la base de datos, así que aunque la "anon key"
-- del cliente sea pública, nadie puede leer datos de otros usuarios.
-- Definimos permisos explícitos: no dependemos de grants por defecto.

-- Quitamos todo y damos solo lo necesario.
revoke all on public.profiles, public.services, public.subscriptions,
  public.watchlist, public.rotation_plans from anon, authenticated;

-- services: catálogo de solo lectura para cualquier usuario con sesión.
grant select on public.services to authenticated;
grant select on public.services to anon;  -- permite leer el catálogo antes de entrar

-- profiles: leer el propio; editar solo campos de preferencias (no el id).
grant select on public.profiles to authenticated;
grant update (display_name, monthly_budget_cents, currency, notify_enabled, notify_days_before)
  on public.profiles to authenticated;

-- subscriptions, watchlist, rotation_plans: CRUD completo (limitado por RLS).
grant select, insert, update, delete on public.subscriptions,
  public.watchlist, public.rotation_plans to authenticated;

alter table public.profiles       enable row level security;
alter table public.services       enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.watchlist      enable row level security;
alter table public.rotation_plans enable row level security;

-- ---- profiles: cada quien ve y edita solo SU perfil. ------------------------
create policy "ver mi perfil" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy "editar mi perfil" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---- services: catálogo visible para todos (lectura). -----------------------
create policy "leer catalogo de servicios" on public.services
  for select to anon, authenticated
  using (true);

-- ---- Tablas de datos: todo se limita al usuario dueño de la fila. -----------
-- "for all" cubre select, insert, update y delete.
--   using      → qué filas se pueden ver / modificar / borrar.
--   with check → qué filas se pueden insertar o dejar tras modificar.
create policy "mis suscripciones" on public.subscriptions
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "mi watchlist" on public.watchlist
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "mis planes de rotacion" on public.rotation_plans
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));


-- ============================================================================
-- 4. SEED: catálogo de servicios de streaming
-- ============================================================================
-- Precios mensuales aproximados en MXN (centavos). El usuario puede editarlos.
insert into public.services (slug, name, category, icon, color, deep_link, default_price_cents, sort)
values
  ('netflix',         'Netflix',        'video', 'clapperboard', '#E50914', 'https://www.netflix.com/',          21900,  1),
  ('disney-plus',     'Disney+',        'video', 'castle',       '#113CCF', 'https://www.disneyplus.com/',      19900,  2),
  ('max',             'Max',            'video', 'film',         '#0038A8', 'https://www.max.com/',             17900,  3),
  ('prime-video',     'Prime Video',    'video', 'play',         '#00A8E1', 'https://www.primevideo.com/',       9900,  4),
  ('apple-tv-plus',   'Apple TV+',      'video', 'apple',        '#000000', 'https://tv.apple.com/',            12900,  5),
  ('paramount-plus',  'Paramount+',     'video', 'mountain',     '#0064FF', 'https://www.paramountplus.com/',   12900,  6),
  ('crunchyroll',     'Crunchyroll',    'video', 'flame',        '#F47521', 'https://www.crunchyroll.com/',      11900,  7),
  ('vix-premium',     'Vix Premium',    'video', 'tv',           '#00A3A3', 'https://vix.com/',                 11900,  8),
  ('claro-video',     'Claro Video',    'video', 'monitor-play', '#E30613', 'https://www.clarovideo.com/',      12900,  9),
  ('youtube-premium', 'YouTube Premium','video', 'youtube',      '#FF0000', 'https://www.youtube.com/premium',  12900, 10),
  ('spotify',         'Spotify',        'music', 'music',        '#1DB954', 'https://www.spotify.com/',         14900, 11),
  ('deezer',          'Deezer',         'music', 'headphones',   '#A238FF', 'https://www.deezer.com/',          14900, 12);


-- ============================================================================
-- 5. TIEMPO REAL
-- ============================================================================
-- Supabase Realtime avisa al cliente de los cambios en las tablas que estén en
-- la publicación "supabase_realtime". El bloque DO comprueba que la publicación
-- exista (en Postgres "pelón" no existe).
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.subscriptions;
    alter publication supabase_realtime add table public.watchlist;
    alter publication supabase_realtime add table public.rotation_plans;
  end if;
end;
$$;
