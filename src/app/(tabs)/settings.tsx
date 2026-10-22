// ============================================================================
// (tabs)/settings.tsx — Pantalla de ajustes
// ----------------------------------------------------------------------------
// Presupuesto mensual, recordatorios de cobro y cierre de sesión. El perfil se
// carga con useProfile y se guarda con useUpdateProfile.
// ----------------------------------------------------------------------------
// El formulario vive en un componente hijo que se monta SOLO cuando el perfil
// ya está cargado. Así inicializamos el estado directamente desde `profile`
// (sin useEffect), que es el patrón recomendado por React.
// ============================================================================
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { colors, spacing, type } from '@/constants/theme';
import type { Profile } from '@/types/models';

export default function SettingsScreen() {
  const { data: profile, isLoading } = useProfile();

  // Cierra sesión; el layout raíz detecta el cambio y vuelve a (auth).
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>

      {isLoading || !profile ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <SettingsForm profile={profile} />
      )}

      <Button label="Sign out" onPress={signOut} variant="ghost" />
    </Screen>
  );
}

// Formulario que se monta con el perfil ya resuelto.
function SettingsForm({ profile }: { profile: Profile }) {
  const updateProfile = useUpdateProfile();

  // Inicializamos el estado desde el perfil (sin efecto): el componente se
  // monta una vez por cada valor distinto de `profile`.
  const [budget, setBudget] = useState(String(profile.monthly_budget_cents / 100));
  const [notify, setNotify] = useState(profile.notify_enabled);

  const save = () => {
    updateProfile.mutate({
      monthly_budget_cents: Math.round(parseFloat(budget || '0') * 100),
      currency: 'MXN',
      notify_enabled: notify,
    });
  };

  return (
    <View style={styles.form}>
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
  title: {
    color: colors.text,
    fontSize: type.heading,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  loading: {
    marginTop: spacing.lg,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    color: colors.text,
    fontSize: type.body,
  },
});
