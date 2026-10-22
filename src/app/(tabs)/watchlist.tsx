// ============================================================================
// (tabs)/watchlist.tsx — Pantalla de watchlist
// ----------------------------------------------------------------------------
// CRUD de la watchlist: lista, agregar título (asociado a un servicio),
// marcar como visto y eliminar. Alimenta el algoritmo de rotación.
// ============================================================================
import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';

import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ServiceIcon } from '@/components/ServiceIcon';
import { ServicePicker } from '@/components/ServicePicker';
import { useServices } from '@/hooks/useServices';
import {
  useAddWatchlistItem,
  useDeleteWatchlistItem,
  useToggleWatchlistItem,
  useWatchlist,
} from '@/hooks/useWatchlist';
import { colors, fonts, radius, spacing, type } from '@/constants/theme';

export default function WatchlistScreen() {
  const { data: services = [] } = useServices();
  const { data: items = [], isLoading } = useWatchlist();
  const addItem = useAddWatchlistItem();
  const toggleItem = useToggleWatchlistItem();
  const deleteItem = useDeleteWatchlistItem();

  const [modalVisible, setModalVisible] = useState(false);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  const openModal = () => {
    setServiceId(null);
    setTitle('');
    setModalVisible(true);
  };

  const submit = () => {
    if (!serviceId || !title.trim()) return;
    addItem.mutate(
      { service_id: serviceId, title: title.trim() },
      { onSuccess: () => setModalVisible(false) },
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Watchlist</Text>
        <Button label="Add" onPress={openModal} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={items}
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
                <Text style={[styles.rowTitle, item.status === 'done' && styles.rowTitleDone]}>
                  {item.title}
                </Text>
                <Text style={styles.rowMeta}>{item.service?.name ?? 'Service'}</Text>
              </View>

              {/* Marcar como visto / pendiente. */}
              <Pressable
                onPress={() =>
                  toggleItem.mutate({
                    id: item.id,
                    status: item.status === 'want' ? 'done' : 'want',
                  })
                }
                style={styles.statusBadge}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === 'done' ? styles.statusDone : styles.statusWant,
                  ]}
                >
                  {item.status === 'done' ? 'Done' : 'Want'}
                </Text>
              </Pressable>

              <Pressable onPress={() => deleteItem.mutate(item.id)} hitSlop={8}>
                <Trash2 color={colors.textMuted} size={20} />
              </Pressable>
            </View>
          )}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add to watchlist</Text>

            <Input
              label="Title"
              placeholder="The Bear"
              value={title}
              onChangeText={setTitle}
            />

            <ServicePicker services={services} selectedId={serviceId} onSelect={setServiceId} />

            <View style={styles.modalActions}>
              <Button label="Cancel" onPress={() => setModalVisible(false)} variant="ghost" />
              <Button
                label="Save"
                onPress={submit}
                loading={addItem.isPending}
                disabled={!serviceId || !title.trim()}
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
  rowTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
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
  statusDone: {
    color: colors.savings,
    borderColor: colors.savings,
  },
  statusWant: {
    color: colors.waste,
    borderColor: colors.waste,
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});
