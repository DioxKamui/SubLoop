// ============================================================================
// deepLinks.ts — Abre un servicio externo desde la app
// ----------------------------------------------------------------------------
// Cada servicio del catálogo guarda un `deep_link` (URL). Esta función lo abre
// con el navegador o la app correspondiente si el sistema puede manejarlo.
// ============================================================================
import { Linking } from 'react-native';

export async function openServiceLink(url: string): Promise<void> {
  if (!url) return;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch {
    // Ignoramos errores de apertura (URL inválida, app no instalada, etc.).
  }
}
