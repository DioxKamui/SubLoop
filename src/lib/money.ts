// ============================================================================
// money.ts — Formateo de dinero
// ----------------------------------------------------------------------------
// Convención (igual que FINA): el dinero se guarda SIEMPRE en CENTAVOS
// enteros, sin decimales. Estas funciones lo convierten a texto legible SOLO
// en el borde de la interfaz (nunca en la lógica de negocio).
// ============================================================================

// Convierte centavos a moneda con 2 decimales y separador de miles.
// Ejemplo: formatMoney(123700) → "$1,237.00"
export function formatMoney(cents: number, currency = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

// Versión sin decimales, para cifras grandes y limpias (el hero de ahorro).
// Ejemplo: formatMoneyWhole(123700) → "$1,237"
export function formatMoneyWhole(cents: number, currency = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
