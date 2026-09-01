import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { getDefaultRouteForSession } from '@/src/core/navigation/default-route';
import { appPaths } from '@/src/core/navigation/paths';
import { useAppPreferences } from '@/src/core/providers/app-provider';
import { AppScreen } from '@/src/components/common/app-screen';
import { SectionCard } from '@/src/components/common/feature-blocks';
import { FormSubmitButton, FormTextField } from '@/src/components/forms/form-fields';
import { useAuthActions } from '@/src/features/auth/hooks/use-auth-actions';
import { authService } from '@/src/features/auth/services/auth-service';
import { palette, spacing, typography } from '@/src/theme/tokens';
import { selectLanguage } from '@/src/utils/select-language';

const otpSchema = z.object({
  otpCode: z.string().regex(/^\d{6}$/, 'Enter the 6-digit OTP'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { language, resolvedTheme } = useAppPreferences();
  const { confirmOtp, resendOtp, isSubmitting, errorMessage } = useAuthActions();
  const colors = palette[resolvedTheme];
  const [pendingMobile, setPendingMobile] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [isContextLoading, setIsContextLoading] = useState(true);
  const [needsResend, setNeedsResend] = useState(false);
  const t = (en: string, gu: string) => selectLanguage(language, en, gu);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    let active = true;

    authService
      .getPendingLoginContext()
      .then((context) => {
        if (!active) {
          return;
        }
        if (!context) {
          router.replace(appPaths.auth.login);
          return;
        }

        setPendingMobile(context.mobileNumber);
        setNeedsResend(!authService.hasPendingOtpVerification());
      })
      .catch(() => {
        if (active) {
          router.replace(appPaths.auth.login);
        }
      })
      .finally(() => {
        if (active) {
          setIsContextLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <AppScreen
      eyebrow={{ en: 'Auth', gu: 'ઓથ' }}
      title={{ en: 'Verify OTP', gu: 'OTP ચકાસો' }}
      description={{
        en: 'Confirm the Firebase one-time password to create a real authenticated session.',
        gu: 'વાસ્તવિક authenticated session બનાવવા Firebase one-time password ચકાસો.',
      }}
      tone="cool">
      <SectionCard title={t('One-Time Password', 'વન-ટાઇમ પાસવર્ડ')}>
        <View style={styles.form}>
          <Text style={[styles.helper, { color: colors.textMuted }]}>
            {isContextLoading
              ? t('Checking the active OTP session...', 'સક્રિય OTP સેશન ચકાસી રહ્યું છે...')
              : pendingMobile
              ? t(`Enter the OTP sent to ${pendingMobile}.`, `${pendingMobile} પર મોકલાયેલ OTP દાખલ કરો.`)
              : t('Waiting for the active OTP session.', 'સક્રિય OTP સેશનની રાહ જોવાઈ રહી છે.')}
          </Text>
          {needsResend ? (
            <Text style={[styles.helper, { color: colors.danger }]}>
              {t(
                'The previous OTP session is no longer active on this device. Resend a fresh OTP before verifying.',
                'આ ઉપકરણ પર પહેલું OTP સેશન હવે સક્રિય નથી. ચકાસતા પહેલાં નવો OTP ફરી મોકલો.',
              )}
            </Text>
          ) : null}
          <FormTextField control={form.control} name="otpCode" label={t('OTP Code', 'OTP કોડ')} placeholder="123456" keyboardType="number-pad" />
          {errorMessage ? <Text style={[styles.error, { color: colors.danger }]}>{errorMessage}</Text> : null}
          {form.formState.errors.root?.message ? <Text style={[styles.error, { color: colors.danger }]}>{form.formState.errors.root.message}</Text> : null}
          {successMessage ? <Text style={[styles.success, { color: colors.primary }]}>{successMessage}</Text> : null}
          <FormSubmitButton
            label={t('Verify OTP', 'OTP ચકાસો')}
            onPress={form.handleSubmit(async ({ otpCode }) => {
              form.clearErrors('root');
              setSuccessMessage(undefined);
              const session = await confirmOtp(otpCode);
              if (!session) {
                form.setError('root', {
                  message: t('Unable to verify OTP. Please try again.', 'OTP ચકાસી શકાયો નથી. ફરી પ્રયાસ કરો.'),
                });
                return;
              }

              setSuccessMessage(t('OTP verified successfully.', 'OTP સફળતાપૂર્વક ચકાસાયો.'));
              router.replace(session.user.pinVerified ? getDefaultRouteForSession(session) : appPaths.auth.pin);
            })}
            loading={isSubmitting}
            loadingLabel={t('Verifying...', 'ચકાસી રહ્યું છે...')}
            disabled={!form.formState.isValid || isContextLoading || needsResend}
          />
          <FormSubmitButton
            label={t('Resend OTP', 'OTP ફરી મોકલો')}
            onPress={async () => {
              setSuccessMessage(undefined);
              const resent = await resendOtp();
              if (resent) {
                setNeedsResend(false);
                setSuccessMessage(t('A fresh OTP has been sent.', 'નવો OTP મોકલાયો છે.'));
              }
            }}
            loading={isSubmitting}
            loadingLabel={t('Resending...', 'ફરી મોકલી રહ્યું છે...')}
            disabled={!pendingMobile || isContextLoading}
          />
          <FormSubmitButton
            label={t('Back to Login', 'લોગિન પર પાછા જાઓ')}
            onPress={async () => {
              await authService.clearPendingOtp();
              router.replace(appPaths.auth.login);
            }}
            disabled={isSubmitting}
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
  helper: {
    ...typography.body,
  },
  error: {
    ...typography.body,
  },
  success: {
    ...typography.body,
  },
});
