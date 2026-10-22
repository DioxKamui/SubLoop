// ============================================================================
// register.tsx — Pantalla de registro
// ----------------------------------------------------------------------------
// Crea la cuenta con Supabase (email + contraseña) y guarda el nombre en
// raw_user_meta_data; el trigger handle_new_user lo usa para el display_name.
// ============================================================================
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { supabase } from '@/lib/supabase';
import { Screen } from '@/components/ui/Screen';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors, fonts, spacing, type } from '@/constants/theme';

// El nombre es opcional; el correo y la contraseña son obligatorios.
const schema = z.object({
  displayName: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterScreen() {
  const [error, setError] = useState<string | null>(null);
  // Mensaje de éxito (cuando hay que confirmar el correo).
  const [message, setMessage] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: '', email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setMessage(null);
    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { display_name: values.displayName } },
    });
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage('Check your inbox to confirm your account.');
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start rotating and saving.</Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="displayName"
          render={({ field, fieldState }) => (
            <Input
              label="Name (optional)"
              placeholder="Your name"
              autoCapitalize="words"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="new-password"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.success}>{message}</Text> : null}

        <Button label="Sign up" onPress={handleSubmit(onSubmit)} loading={formState.isSubmitting} />
      </View>

      <Link href="/login" style={styles.link}>
        Already have an account? Log in
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: type.heading,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: type.subtitle,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: type.body,
  },
  success: {
    color: colors.savings,
    fontFamily: fonts.body,
    fontSize: type.body,
  },
  link: {
    color: colors.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: type.body,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
