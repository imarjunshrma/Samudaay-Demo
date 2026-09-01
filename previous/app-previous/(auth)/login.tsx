import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { StyleSheet, Text, View } from 'react-native';

import { appPaths } from '@/src/core/navigation/paths';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { useSession } from '@/src/core/providers/session-provider';
import { AppScreen } from '@/src/components/common/app-screen';
import { FormSubmitButton, FormTextField } from '@/src/components/forms/form-fields';
import { SectionCard } from '@/src/components/common/feature-blocks';
import { useAuthActions } from '@/src/features/auth/hooks/use-auth-actions';
import { palette, spacing, typography } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

const loginSchema = z.object({
  mobileNumber: z.string().regex(/^\+?\d{10,14}$/, 'Enter a valid mobile number'),
  pin: z.string().regex(/^\d{4,6}$/, 'Enter a 4 to 6 digit PIN'),
  preferredLanguage: z.enum(['en', 'gu']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { language, resolvedTheme } = useAppPreferences();
  const { bootstrapError, refreshSession, status } = useSession();
  const { signIn, isSubmitting, errorMessage } = useAuthActions();
  const router = useRouter();
  const colors = palette[resolvedTheme];
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobileNumber: '',
      pin: '',
      preferredLanguage: language,
    },
    mode: 'onChange',
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors('root');
    const otpRequested = await signIn(values);
    if (otpRequested) {
      router.replace(appPaths.auth.otp);
    } else {
      form.setError('root', {
        message: t('Unable to send the OTP. Check your number and try again.', 'OTP મોકલી શકાયો નથી. નંબર ચકાસો અને ફરી પ્રયાસ કરો.'),
      });
    }
  });

  return (
    <AppScreen
      eyebrow={{ en: 'Auth', gu: 'ઓથ' }}
      title={{ en: 'Sign In', gu: 'સાઇન ઇન' }}
      description={{
        en: 'Use your mobile number to receive a Firebase OTP. The PIN is checked after OTP verification to unlock the app shell.',
        gu: 'Firebase OTP મેળવવા માટે તમારો મોબાઇલ નંબર વાપરો. OTP ચકાસણી પછી એપ શેલ ખોલવા PIN ચકાસાય છે.',
      }}
      tone="warm">
      <SectionCard title={t('Credentials', 'ઓળખ માહિતી')}>
        <View style={styles.form}>
          <FormTextField control={form.control} name="mobileNumber" label={t('Mobile Number', 'મોબાઇલ નંબર')} placeholder="+91 98765 43210" keyboardType="phone-pad" />
          <FormTextField control={form.control} name="pin" label={t('PIN', 'PIN')} placeholder="1234" keyboardType="number-pad" secureTextEntry disabled={isSubmitting} />
          <Text style={styles.helper}>{t('Roles now come from Firestore user records. New phone-auth users start in onboarding until an admin updates their role.', 'હવે રોલ Firestore user record માંથી આવે છે. નવા phone-auth યૂઝર એડમિન રોલ અપડેટ કરે ત્યાં સુધી onboarding માં શરૂ થાય છે.')}</Text>
          {bootstrapError ? <Text style={[styles.error, { color: colors.danger }]}>{bootstrapError}</Text> : null}
          {errorMessage || form.formState.errors.root?.message ? <Text style={[styles.error, { color: colors.danger }]}>{form.formState.errors.root?.message ?? errorMessage}</Text> : null}
          <FormSubmitButton label={t('Send OTP', 'OTP મોકલો')} loadingLabel={t('Sending OTP...', 'OTP મોકલી રહ્યું છે...')} onPress={handleSubmit} loading={isSubmitting} disabled={!form.formState.isValid} />
          {bootstrapError ? (
            <FormSubmitButton
              label={t('Retry Session Check', 'સેશન ચેક ફરી કરો')}
              onPress={() => {
                void refreshSession();
              }}
              loading={status === 'loading'}
            />
          ) : null}
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
  helper: {
    ...typography.body,
  },
});
