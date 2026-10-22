// ============================================================================
// (tabs)/subscriptions.tsx — Pantalla de servicios
// ----------------------------------------------------------------------------
// CRUD de suscripciones: lista, agregar (con picker del catálogo), pausar/
// reactivar y eliminar. Los datos vienen de los hooks de useSubscriptions.
// Además: abre el servicio (deep link) y programa/cancela su recordatorio.
// ============================================================================
import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ExternalLink, Trash2 } from 'lucide-react-native';

import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ServiceIcon } from '@/components/ServiceIcon';
import { ServicePicker } from '@/components/ServicePicker';
import { useServices } from '@/hooks/useServices';
import {
  useAddSubscription,
  useDeleteSubscription,
  useSubscriptions,
  useToggleSubscription,
} from '@/hooks/useSubscriptions';
import { useProfile } from '@/hooks/useProfile';
import { formatMoney } from '@/lib/money';
import { openServiceLink } from '@/lib/deepLinks';
import { cancelBillingReminder, scheduleBillingReminder } from '@/lib/notifications';
import { colors, fonts, radius, spacing, type } from '@/constants/theme';

export default function SubscriptionsScreen() {
  const { data: services = [] } = useServices();
  const { data: subscriptions = [], isLoading } = useSubscriptions();
  const { data: profile } = useProfile();
  const addSubscription = useAddSubscription();
  const toggleSubscription = useToggleSubscription();
  const deleteSubscription = useDeleteSubscription();

  // Estado local del formulario "agregar suscripción".
  const [modalVisible, setModalVisible] = useState(false);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [price, setPrice] = useState('');        // pesos enteros (se convierten a centavos)
  const [billingDay, setBillingDay] = useState('1');
  const [priority, setPriority] = useState(3);

  // Al elegir un servicio, precargamos su precio por defecto.
  const selectService = (id: string) => {
    setServiceId(id);
    const service = services.find((s) => s.id === id);
    if (service) setPrice(String(service.default_price_cents / 100));
  };

  const openModal = () => {
    setServiceId(null);
    setPrice('');
    setBillingDay('1');
    setPriority(3);
    setModalVisible(true);
  };

  const submit = () => {
    if (!serviceId || !price) return;
    addSubscription.mutate(
      {
        service_id: serviceId,
        price_cents: Math.round(parseFloat(price) * 100),
        billing_day: parseInt(billingDay, 10) || 1,
        priority,
      },
      {
        onSuccess: () => {
          setModalVisible(false);
          // Programa el recordatorio de cobro si las notificaciones están activas.
          if (profile?.notify_enabled) {
            const service = services.find((s) => s.id === serviceId);
            void scheduleBillingReminder(
              serviceId,
              service?.name ?? 'Service',
              parseInt(billingDay, 10) || 1,
              profile.notify_days_before,
            );
          }
        },
      },
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Button label="Add" onPress={openModal} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <ServiceIcon
                name={item.service?.icon ?? 'clapperboard'}
                color={item.service?.color}
                size={28}
              />
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{item.service?.name ?? 'Service'}</Text>
                <Text style={styles.rowMeta}>
                  {formatMoney(item.price_cents)} · day {item.billing_day} · P{item.priority}
                </Text>
              </View>

              {/* Pausar / reactivar. */}
              <Pressable
                onPress={() =>
                  toggleSubscription.mutate({
                    id: item.id,
                    status: item.status === 'active' ? 'paused' : 'active',
                  })
                }
                style={styles.statusBadge}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === 'active' ? styles.statusActive : styles.statusPaused,
                  ]}
                >
                  {item.status === 'active' ? 'Active' : 'Paused'}
                </Text>
              </Pressable>

              {/* Abrir el servicio (deep link). */}
              <Pressable onPress={() => void openServiceLink(item.service?.deep_link ?? '')} hitSlop={8}>
                <ExternalLink color={colors.textMuted} size={20} />
              </Pressable>

              {/* Eliminar (y cancelar su recordatorio). */}
              <Pressable
                onPress={() =>
                  deleteSubscription.mutate(item.id, {
                    onSuccess: () => void cancelBillingReminder(item.service_id),
                  })
                }
                hitSlop={8}
              >
                <Trash2 color={colors.textMuted} size={20} />
              </Pressable>
            </View>
          )}
        />
      )}

      {/* Modal para agregar una suscripción. */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add subscription</Text>

            <ServicePicker services={services} selectedId={serviceId} onSelect={selectService} />

            <Input
              label="Monthly price (MXN)"
              placeholder="219"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <Input
              label="Billing day (1-31)"
              placeholder="1"
              keyboardType="numeric"
              value={billingDay}
              onChangeText={setBillingDay}
            />

            {/* Prioridad 1-5: cuánto le importa al usuario (pesa en el algoritmo). */}
            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setPriority(n)}
                  style={[styles.priorityDot, priority === n && styles.priorityDotActive]}
                >
                  <Text style={[styles.priorityText, priority === n && styles.priorityTextActive]}>
                    {n}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button label="Cancel" onPress={() => setModalVisible(false)} variant="ghost" />
              <Button
                label="Save"
                onPress={submit}
                loading={addSubscription.isPending}
                disabled={!serviceId || !price}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: type.heading,
  },
  loading: {
    marginTop: spacing.lg,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: colors.text,
    fontFamily: fonts.bodySemi,
    fontSize: type.body,
  },
  rowMeta: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.caption,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  statusText: {
    fontFamily: fonts.bodySemi,
    fontSize: type.caption,
  },
  statusActive: {
    color: colors.savings,
    borderColor: colors.savings,
  },
  statusPaused: {
    color: colors.textMuted,
    borderColor: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: type.title,
  },
  fieldLabel: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: type.body,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityDot: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  priorityDotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  priorityText: {
    color: colors.textMuted,
    fontFamily: fonts.bodySemi,
    fontSize: type.body,
  },
  priorityTextActive: {
    color: colors.onPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});
