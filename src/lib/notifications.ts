// ============================================================================
// notifications.ts — Recordatorios locales de cobro
// ----------------------------------------------------------------------------
// Usa expo-notifications para programar avisos locales antes de la fecha de
// cobro de cada suscripción. El identificador se deriva del service_id (que es
// único por usuario), así podemos cancelar o reemplazar cada recordatorio.
// ============================================================================
import * as Notifications from 'expo-notifications';

// Configura cómo se muestra una notificación cuando la app está en primer plano.
export function configureNotifications() {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // No soportado (p. ej. web): se ignora.
  }
}

// Identificador determinista del recordatorio de una suscripción.
function reminderIdentifier(serviceId: string): string {
  return `billing-reminder-${serviceId}`;
}

// Pide permiso solo si aún no está resuelto; devuelve true si está concedido.
async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

// Calcula la próxima fecha de recordatorio: N días antes del próximo cobro.
function nextReminderDate(billingDay: number, notifyDaysBefore: number): Date {
  const now = new Date();

  // Próximo día de cobro (a las 9:00 de la mañana).
  const billing = new Date(now.getFullYear(), now.getMonth(), billingDay, 9, 0, 0, 0);
  if (billing.getTime() <= now.getTime()) {
    billing.setMonth(billing.getMonth() + 1);
  }

  // Restamos los días de antelación.
  const reminder = new Date(billing.getTime());
  reminder.setDate(reminder.getDate() - notifyDaysBefore);

  // Si el recordatorio ya pasó, lo movemos al mes siguiente.
  if (reminder.getTime() <= now.getTime()) {
    reminder.setMonth(reminder.getMonth() + 1);
  }

  return reminder;
}

// Programa (o reemplaza) el recordatorio de cobro de una suscripción.
export async function scheduleBillingReminder(
  serviceId: string,
  serviceName: string,
  billingDay: number,
  notifyDaysBefore: number,
): Promise<void> {
  const granted = await ensureNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    identifier: reminderIdentifier(serviceId),
    content: {
      title: 'Billing reminder',
      body: `${serviceName} renews in ${notifyDaysBefore} day(s).`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: nextReminderDate(billingDay, notifyDaysBefore),
    },
  });
}

// Cancela el recordatorio de cobro de una suscripción.
export async function cancelBillingReminder(serviceId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(reminderIdentifier(serviceId));
}
