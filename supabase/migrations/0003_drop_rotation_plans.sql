-- ============================================================================
-- 0003_drop_rotation_plans.sql — Limpieza
-- ----------------------------------------------------------------------------
-- Elimina la tabla rotation_plans: no se usaba (el plan de rotación se calcula
-- en el cliente y no se persiste).
-- ============================================================================
drop table if exists public.rotation_plans;
