// ============================================================================
// ServicePicker.tsx — Selector horizontal de servicios
// ----------------------------------------------------------------------------
// Muestra los servicios del catálogo como "chips" (icono + nombre). Se usa en
// los formularios para elegir a qué servicio se asocia una suscripción o un
// título de la watchlist.
// ============================================================================
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { ServiceIcon } from '@/components/ServiceIcon';
import { colors, radius, spacing, type } from '@/constants/theme';
import type { Service } from '@/types/models';

interface ServicePickerProps {
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ServicePicker({ services, selectedId, onSelect }: ServicePickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {services.map((service) => {
        const selected = service.id === selectedId;
        return (
          <Pressable
            key={service.id}
            onPress={() => onSelect(service.id)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <ServiceIcon name={service.icon} color={service.color} size={18} />
            <Text style={[styles.label, selected && styles.labelSelected]}>{service.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
  },
  label: {
    color: colors.text,
    fontSize: type.body,
  },
  labelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
