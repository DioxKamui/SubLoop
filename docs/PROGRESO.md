# PROGRESO — SubLoop

Bitácora del proyecto. Se actualiza al final de cada bloque de trabajo para
retomar el contexto sin releer todo.

## Estado actual (2026-10-21)

**Fase 1 (Setup) — COMPLETA.**

Proyecto Expo SDK 58 + TypeScript + expo-router, limpio y compilando
(`npx tsc --noEmit` y `npx eslint .` sin errores). Commit `6a68d45` en `main`.

### Lo que ya existe

- App móvil Expo (RN 0.88, React 19.3) en `D:\DEV proyects\SubLoop`.
- Repo GitHub: https://github.com/DioxKamui/SubLoop (público).
- Identidad visual "dinero cinematográfico": fondo oscuro + violeta de marca,
  verde de ahorro y ámbar de gasto, centralizada en `src/constants/theme.ts`.
- Pantallas de auth (login/register) con `react-hook-form` + `zod` + Supabase.
- Navegación por 5 tabs: Home, Services, Watchlist, Plan, Settings.
- Cliente Supabase (`src/lib/supabase.ts`), formateo (`src/lib/money.ts`),
  tipos espejo de la BD (`src/types/models.ts`).
- Migración SQL (`supabase/migrations/0001_init.sql`): profiles, services,
  subscriptions, watchlist, rotation_plans + RLS + trigger + seed de 12 servicios.

### Pendiente / siguiente paso

1. **Configurar Supabase** (decisión pendiente): hosted en supabase.com
   (recomendado) vs local Docker. Faltan `EXPO_PUBLIC_SUPABASE_URL` y
   `EXPO_PUBLIC_SUPABASE_ANON_KEY` en `.env`, y aplicar la migración.
2. **Fase 2** — CRUD de suscripciones + watchlist + settings (presupuesto).
3. **Fase 3** — algoritmo de rotación (`src/lib/rotation/algorithm.ts`) + tests
   + hero de ahorro + gráfica mensual.
4. **Fase 4** — notificaciones locales + deep-links + caché offline
   (react-query persist) + Realtime.
5. **Fase 5** — pulido, animaciones, modo demo.

## Decisiones tomadas

- **Nombre:** SubLoop (app), slug `subloop`, scheme `subloop`.
- **Stack:** Expo (expo-router) + TypeScript + Supabase + @tanstack/react-query +
  react-hook-form + zod + lucide-react-native + date-fns.
- **Backend:** Supabase (Postgres + Auth + Realtime + Edge Functions).
- **Offline:** caché + sync simple (Supabase fuente de verdad + Realtime).
- **Algoritmo:** plan mensual a 12 meses, puro y testeado, corre en cliente.
- **UI:** inglés (público). **Comentarios de código:** español (aprendizaje).
- **Estilo:** fondo oscuro; tokens en `theme.ts` (marca #7C3AED, ahorro #10B981,
  gasto #F59E0B). Se usa StyleSheet + tokens (no NativeWind).
- **Dinero:** centavos enteros, formateado solo en `money.ts`.
- **Skills usadas:** ui-ux-pro-max (design system), frontend-design (identidad),
  project-memory (esta bitácora).

## Convenciones de código (respetar siempre)

- Comentarios en español explicando qué y por qué (no lo obvio).
- Una responsabilidad por archivo: pantallas (`src/app`), presentación
  (`components/ui`), datos (`hooks`), lógica pura (`lib`).
- Tokens centralizados: nunca hex sueltos en componentes.
- Tipos en `src/types/models.ts` (espejo de la BD).
- Módulos nativos con `npx expo install` (versiones compatibles SDK 58).
- Validar con `npx tsc --noEmit` y `npx eslint .` antes de dar por terminado.

## Para retomar

- La app NO arranca sin `.env`: lanza un error claro pidiendo las variables de
  Supabase. Crear `.env` con las dos variables al configurar el backend.
- La migración está lista pero aún no aplicada a ningún proyecto Supabase.
- La Fase 1 no conectó Supabase: la decisión hosted/local quedó pendiente.
