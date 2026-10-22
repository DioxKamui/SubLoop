// ============================================================================
// (tabs)/settings.tsx — Pantalla de ajustes
// ----------------------------------------------------------------------------
// Presupuesto mensual, recordatorios de cobro, avatar (monstruo) y cierre de
// sesión. El perfil se carga con useProfile y se guarda con useUpdateProfile.
// ----------------------------------------------------------------------------
// El formulario vive en un componente hijo que se monta SOLO cuando el perfil
// ya está cargado. Así inicializamos el estado directamente desde `profile`
// (sin useEffect), que es el patrón recomendado por React.
// ============================================================================
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MonsterAvatar } from '@/components/MonsterAvatar';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { AVATARS, DEFAULT_AVATAR } from '@/constants/avatars';
import { colors, fonts, radius, spacing, type } from '@/constants/theme';
import type { Profile } from '@/types/models';

export default function SettingsScreen() {
  const { data: profile, isLoading } = useProfile();

  // Cierra sesión; el layout raíz detecta el cambio y vuelve a (auth).
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        {isLoading || !profile ? (
          <ActivityIndicator color={colors.primary} style={styles.loading} />
        ) : (
          <SettingsForm profile={profile} />
        )}

        <Button label="Sign out" onPress={signOut} variant="ghost" />
      </ScrollView>
    </Screen>
  );
}

// Formulario que se monta con el perfil ya resuelto.
function SettingsForm({ profile }: { profile: Profile }) {
  const updateProfile = useUpdateProfile();

  // Inicializamos el estado desde el perfil (sin efecto). El avatar puede no
  // existir en cachés viejas, así que caemos al avatar por defecto.
  const [budget, setBudget] = useState(String(profile.monthly_budget_cents / 100));
  const [notify, setNotify] = useState(profile.notify_enabled);
  const [avatar, setAvatar] = useState(profile.avatar ?? DEFAULT_AVATAR);

  const save = () => {
    updateProfile.mutate({
      monthly_budget_cents: Math.round(parseFloat(budget || '0') * 100),
      currency: 'MXN',
      avatar,
      notify_enabled: notify,
    });
  };

  return (
    <View style={styles.form}>
      {/* Selector de avatar (monstruo clásico). */}
      <Text style={styles.fieldLabel}>Avatar</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarRow}
      >
        {AVATARS.map((option) => {
          const selected = option.id === avatar;
          return (
            <Pressable
              key={option.id}
              onPress={() => setAvatar(option.id)}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              style={[styles.avatarItem, selected && styles.avatarSelected]}
            >
              <MonsterAvatar id={option.id} size={52} />
              <Text style={styles.avatarLabel}>{option.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Input
        label="Monthly budget (MXN)"
        placeholder="500"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Billing reminders</Text>
        <Switch
          value={notify}
          onValueChange={setNotify}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor={notify ? colors.onPrimary : colors.textMuted}
        />
      </View>

      <Button label="Save" onPress={save} loading={updateProfile.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: type.heading,
  },
  loading: {
    marginTop: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  fieldLabel: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: type.body,
  },
  avatarRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  avatarItem: {
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  avatarSelected: {
    borderColor: colors.primary,
  },
  avatarLabel: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.caption,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: type.body,
  },
});
