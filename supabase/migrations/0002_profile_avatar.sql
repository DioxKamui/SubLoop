-- ============================================================================
-- 0002_profile_avatar.sql — Avatar (monstruo) del usuario
-- ----------------------------------------------------------------------------
-- Añade al perfil la clave del monstruo elegido como "foto de perfil".
-- Por defecto 'ghost' (fantasma). Es un cambio aditivo: no borra nada.
-- ============================================================================
alter table public.profiles add column avatar text not null default 'ghost';
