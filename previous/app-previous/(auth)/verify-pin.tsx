import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { appPaths } from '@/src/core/navigation/paths';
import { AppScreen } from '@/src/components/common/app-screen';
import { SectionCard } from '@/src/components/common/feature-blocks';
import { FormSubmitButton, FormTextField } from '@/src/components/forms/form-fields';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { getDefaultRouteForSession } from '@/src/core/navigation/default-route';
import { useSession } from '@/src/core/providers/session-provider';
import { authService } from '@/src/features/auth/services/auth-service';
import { palette, spacing, typography } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';
import { z } from 'zod';

const pinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, 'Enter a valid PIN'),
});

type PinFormValues = z.infer<typeof pinSchema>;

export default function VerifyPinScreen() {
  const { language, resolvedTheme } = useAppPreferences();
  const { session, updateSession } = useSession();
  const colors = palette[resolvedTheme];
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);
  const form = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: '' },
    mode: 'onChange',
  });

  if (!session) {
    return (
      <AppScreen
        eyebrow={{ en: 'Security', gu: 'સિક્યુરિટી' }}
        title={{ en: 'Verify PIN', gu: 'PIN ચકાસો' }}
        description={{
          en: 'PIN verification is only available after a valid login session is restored.',
          gu: 'માન્ય લોગિન સેશન મળ્યા પછી જ PIN ચકાસણી ઉપલબ્ધ છે.',
        }}
        tone="cool">
        <SectionCard title={t('Session Required', 'સેશન જરૂરી')}>
          <View style={styles.form}>
            <Text style={[styles.error, { color: colors.danger }]}>
              {t('Your session is missing. Sign in again to continue.', 'તમારું સેશન ઉપલબ્ધ નથી. આગળ વધવા માટે ફરી સાઇન ઇન કરો.')}
            </Text>
            <FormSubmitButton
              label={t('Back to Login', 'લોગિન પર પાછા જાઓ')}
              onPress={() => {
                router.replace(appPaths.auth.login);
              }}
            />
          </View>
        </SectionCard>
      </AppScreen>
    );
  }

  return (
    <AppScreen eyebrow={{ en: 'Security', gu: 'સિક્યુરિટી' }} title={{ en: 'Verify PIN', gu: 'PIN ચકાસો' }} description={{ en: 'PIN verification checkpoint before opening the app shell.', gu: 'એપ શેલ ખોલતા પહેલાં PIN ચકાસણી ચેકપોઇન્ટ.' }} tone="cool">
      <SectionCard title={t('Enter PIN', 'PIN દાખલ કરો')}>
        <View style={styles.form}>
          <FormTextField control={form.control} name="pin" label={t('PIN', 'PIN')} placeholder="1234" keyboardType="number-pad" secureTextEntry disabled={form.formState.isSubmitting} />
          {form.formState.errors.pin?.message ? <Text style={[styles.error, { color: colors.danger }]}>{form.formState.errors.pin.message}</Text> : null}
          {submitError ? <Text style={[styles.error, { color: colors.danger }]}>{submitError}</Text> : null}
          {successMessage ? <Text style={[styles.success, { color: colors.primary }]}>{successMessage}</Text> : null}
          <FormSubmitButton
            label={t('Continue', 'આગળ વધો')}
            onPress={form.handleSubmit(async ({ pin }) => {
              setSubmitError(undefined);
              setSuccessMessage(undefined);
              try {
                await authService.setupPin(pin);
                setSuccessMessage(t('PIN verified successfully.', 'PIN સફળતાપૂર્વક ચકાસાયું.'));
                await updateSession((current) => ({
                  ...current,
                  user: {
                    ...current.user,
                    pinVerified: true,
                  },
                }));
                router.replace(
                  getDefaultRouteForSession({
                    ...session,
                    user: {
                      ...session.user,
                      pinVerified: true,
                    },
                  }),
                );
              } catch (error) {
                setSubmitError(error instanceof Error ? error.message : t('Unable to verify PIN.', 'PIN ચકાસી શક્યા નથી.'));
              }
            })}
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
            loadingLabel={t('Checking PIN...', 'PIN ચકાસી રહ્યું છે...')}
          />
        </View>
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  error: {
    ...typography.body,
  },
  success: {
    ...typography.body,
  },
});
