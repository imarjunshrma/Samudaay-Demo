import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';

import { Button, OTPInput, Text } from '@/src/components';
import { useSession } from '@/src/core/providers/session-provider';
import type { AuthSecurityController } from '@/src/features/auth/hooks/use-auth-security';
import { useTranslations } from '@/src/i18n/use-translations';
import { AuthSecurityShell } from '@/src/features/auth/components/auth-security-shell';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

type Stage =
  | 'idle'
  | 'setup'
  | 'pin-entry'
  | 'forgot-pin'
  | 'verify-otp'
  | 'set-new-pin';
type PendingAction = 'pin' | 'setup' | 'otp' | 'verify-otp' | 'reset-pin' | null;

function PinEntryScreen({
  value,
  error,
  onChange,
  onForgotPin,
  forgotPinHint,
  displayName,
  busy,
  pinLoading,
}: {
  value: string;
  error?: string | null;
  onChange: (value: string) => void;
  onForgotPin: () => void;
  forgotPinHint?: string | null;
  displayName: string;
  busy?: boolean;
  pinLoading?: boolean;
}) {
  const t = useTranslations();
  return (
    <View style={styles.pinScreen}>
      <ScrollView contentContainerStyle={styles.pinScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.pinBrand}>
          <Text variant="caption" style={styles.pinEyebrow}>
            {t('authSecurity.flow.secureAccess')}
          </Text>
          <View style={styles.pinBrandCircle}>
            <MaterialIcons name="lock" size={28} color={colors.primary.DEFAULT} />
          </View>
          <Text variant="h1" style={styles.pinWelcome}>
            {t('authSecurity.flow.welcomeBack')}
          </Text>
          <Text variant="h1" style={styles.pinMaster}>
            {displayName}
          </Text>
        </View>

        <View style={styles.pinHeroCard}>
          <View style={styles.pinHeroRow}>
            <View style={styles.pinHeroBadge}>
              <MaterialIcons name="shield" size={18} color={colors.primary.DEFAULT} />
              <Text variant="caption" style={styles.pinHeroBadgeText}>
                {t('authSecurity.flow.protectedOnDevice')}
              </Text>
            </View>
          </View>
          <OTPInput
            length={4}
            label={t('authSecurity.flow.enterPin')}
            value={value}
            onChange={onChange}
            error={error ?? undefined}
          />
          <Text variant="caption" style={styles.pinMicrocopy}>
            {t('authSecurity.flow.enterPinHint')}
          </Text>
          {pinLoading ? (
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ marginTop: spacing[2], textAlign: 'center' }}>
              {t('authSecurity.flow.verifyingPin')}
            </Text>
          ) : null}
        </View>

        <View style={styles.pinActions}>
          <Button variant="ghost" fullWidth onPress={onForgotPin} disabled={busy}>
            {t('authSecurity.flow.forgotPin')}
          </Button>
          {forgotPinHint ? (
            <Text variant="caption" color={colors.text.secondary} style={{ textAlign: 'center' }}>
              {forgotPinHint}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function ForgotPinScreen({
  onSendOtp,
  onCancel,
  busy,
  otpLoading,
  error,
}: {
  onSendOtp: () => void;
  onCancel: () => void;
  busy?: boolean;
  otpLoading?: boolean;
  error?: string | null;
}) {
  const t = useTranslations();
  return (
    <View style={styles.genericScreen}>
      <View style={styles.genericCenter}>
        <View style={styles.lockCircle}>
          <MaterialIcons name="lock" size={48} color={colors.primary.DEFAULT} />
          <View style={styles.lockBadge}>
            <MaterialIcons name="verified" size={14} color={colors.text.inverse} />
          </View>
        </View>
        <Text variant="h1" style={styles.genericTitle}>
          {t('authSecurity.flow.forgotPin')}
        </Text>
        <Text variant="body" style={styles.genericSubtitle}>
          {t('authSecurity.flow.resetDescription')}
        </Text>
        {error ? (
          <Text variant="caption" color={colors.status.error} style={{ textAlign: 'center' }}>
            {error}
          </Text>
        ) : null}
        <View style={styles.forgotActions}>
          <Button fullWidth rounded onPress={onSendOtp} loading={otpLoading} disabled={busy} variant="outline" leftIcon={<MaterialIcons name="smartphone" size={20} color={colors.primary.DEFAULT} />}>
            {t('authSecurity.flow.sendOtp')}
          </Button>
        </View>
      </View>
      <View style={styles.pinFooter}>
        <Button fullWidth rounded variant="outline" onPress={onCancel} disabled={busy}>
          {t('authSecurity.flow.cancel')}
        </Button>
      </View>
    </View>
  );
}

function SetNewPinScreen({
  value,
  confirmValue,
  onChange,
  onConfirmChange,
  error,
  onBack,
  onConfirm,
  busy,
}: {
  value: string;
  confirmValue: string;
  onChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  error?: string | null;
  onBack: () => void;
  onConfirm: () => void;
  busy?: boolean;
}) {
  const t = useTranslations();
  return (
    <ScrollView style={styles.setPinScreen} contentContainerStyle={styles.keyboardScreenContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.pinSetupBody}>
        <View style={styles.pinSetupBrand}>
          <Text variant="caption" style={styles.pinSetupEyebrow}>
            {t('authSecurity.flow.resetPinEyebrow')}
          </Text>
          <View style={styles.pinSetupIconCircle}>
            <MaterialIcons name="verified-user" size={28} color={colors.primary.DEFAULT} />
          </View>
          <Text variant="h1" style={styles.pinSetupTitle}>
            {t('authSecurity.flow.setNewPin')}
          </Text>
          <Text variant="body" style={styles.pinSetupSubtitle}>
            {t('authSecurity.flow.setNewPinDescription')}
          </Text>
        </View>
        <View style={styles.pinInputGroup}>
          <OTPInput length={4} label={t('authSecurity.flow.newPin')} value={value} onChange={onChange} />
          <OTPInput length={4} label={t('authSecurity.flow.confirmPin')} value={confirmValue} onChange={onConfirmChange} />
        </View>
        <View style={styles.newPinInfoCard}>
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            <MaterialIcons name="info" size={18} color={colors.primary.DEFAULT} />
            <Text variant="caption" style={styles.newPinHelper}>
              {t('authSecurity.flow.pinHelper')}
            </Text>
          </View>
          {error ? (
            <Text variant="caption" color={colors.status.error} style={{ marginTop: spacing[2] }}>
              {error}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.newPinFooter}>
        <Button variant="outline" fullWidth rounded onPress={onBack} disabled={busy}>
          {t('authSecurity.flow.cancel')}
        </Button>
        <Button fullWidth rounded disabled={value.length < 4 || confirmValue.length < 4 || busy} loading={busy} onPress={onConfirm}>
          {t('authSecurity.flow.confirmNewPin')}
        </Button>
        <Text variant="caption" style={styles.newPinFooterHint}>
          {t('authSecurity.flow.completeSixDigits')}
        </Text>
      </View>
    </ScrollView>
  );
}

function VerifyOtpScreen({
  value,
  error,
  busy,
  onChange,
  onBack,
  onConfirm,
}: {
  value: string;
  error?: string | null;
  busy?: boolean;
  onChange: (value: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations();
  return (
    <ScrollView style={styles.setPinScreen} contentContainerStyle={styles.keyboardScreenContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.pinSetupBody}>
        <View style={styles.pinSetupBrand}>
          <View style={styles.pinSetupIconCircle}>
            <MaterialIcons name="verified-user" size={28} color={colors.primary.DEFAULT} />
          </View>
          <Text variant="h1" style={styles.pinSetupTitle}>
            {t('authSecurity.flow.verifyOtp')}
          </Text>
          <Text variant="body" style={styles.pinSetupSubtitle}>
            {t('authSecurity.flow.verifyOtpDescription')}
          </Text>
        </View>
        <OTPInput length={6} label={t('otp.label')} value={value} onChange={onChange} error={error ?? undefined} />
      </View>
      <View style={styles.newPinFooter}>
        <Button variant="outline" fullWidth rounded onPress={onBack} disabled={busy}>
          {t('authSecurity.flow.cancel')}
        </Button>
        <Button fullWidth rounded disabled={value.length < 6 || busy} loading={busy} onPress={onConfirm}>
          {t('authSecurity.flow.verifyOtp')}
        </Button>
      </View>
    </ScrollView>
  );
}

export function AuthSecurityFlow({ security }: { security: AuthSecurityController }) {
  const t = useTranslations();
  const { session } = useSession();
  const {
    isSetupRequired,
    isLocked,
    isReady,
    pinResetAuthorized,
    unlockWithPin,
    setupPin,
    requestRecoveryOtp,
    verifyRecoveryOtp,
    dismissSetupPrompt,
  } = security;

  const [stage, setStage] = useState<Stage>('idle');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [recoveryFlowActive, setRecoveryFlowActive] = useState(false);
  const [forgotPinConfirmArmed, setForgotPinConfirmArmed] = useState(false);
  const actionInFlightRef = useRef(false);
  const displayName = useMemo(() => {
    const fullName = session?.user.fullName?.trim();
    if (fullName) {
      return fullName;
    }

    return session?.user.role === 'admin'
      ? t('authSecurity.flow.adminDisplayName')
      : t('authSecurity.flow.memberDisplayName');
  }, [session?.user.fullName, session?.user.role, t]);
  const isBusy = pendingAction !== null;

  const runAction = useCallback(async <T,>(action: Exclude<PendingAction, null>, task: () => Promise<T>) => {
    if (actionInFlightRef.current) {
      return null;
    }

    actionInFlightRef.current = true;
    setPendingAction(action);
    try {
      return await task();
    } finally {
      actionInFlightRef.current = false;
      setPendingAction(null);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (isSetupRequired) {
      setError(null);
      setRecoveryFlowActive(false);
      setStage('setup');
      return;
    }

    if (pinResetAuthorized) {
      setError(null);
      setRecoveryFlowActive(true);
      setStage('set-new-pin');
      return;
    }

    if (isLocked && !recoveryFlowActive && stage !== 'pin-entry') {
      setError(null);
      setStage('pin-entry');
    }
  }, [isLocked, isReady, isSetupRequired, pinResetAuthorized, recoveryFlowActive, stage]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!pinResetAuthorized && !isSetupRequired && !isLocked && stage !== 'idle') {
      setRecoveryFlowActive(false);
      setStage('idle');
      setPin('');
      setConfirmPin('');
      setError(null);
    }
  }, [isLocked, isReady, isSetupRequired, pinResetAuthorized, stage]);

  async function handlePinChange(nextValue: string) {
    const next = nextValue;
    setPin(next);
    setError(null);
    setForgotPinConfirmArmed(false);

    if (stage === 'pin-entry' && next.length === 4) {
      try {
        const ok = await runAction('pin', () => unlockWithPin(next));
        if (ok === null) {
          return;
        }
        if (!ok) {
          setError(t('authSecurity.errors.pinIncorrect'));
          setRecoveryFlowActive(false);
          setStage('pin-entry');
          setPin('');
        }
      } catch (pinError) {
        setError(pinError instanceof Error ? pinError.message : t('authSecurity.errors.pinIncorrect'));
        setRecoveryFlowActive(false);
        setStage('pin-entry');
        setPin('');
      }
    }
  }

  async function handleContinueSetup() {
    if (pin.length < 4) {
      setError(t('authSecurity.errors.pinLength'));
      return;
    }

    if (pin !== confirmPin) {
      setError(t('authSecurity.errors.pinMismatch'));
      return;
    }

    const ok = await runAction('setup', () => setupPin(pin));
    if (ok === null) {
      return;
    }
    if (!ok) {
      setError(t('authSecurity.errors.pinSaveFailed'));
      return;
    }

    setError(null);
    setRecoveryFlowActive(false);
    setPin('');
    setConfirmPin('');
  }
  function switchStage(nextStage: Stage) {
    setError(null);
    setForgotPinConfirmArmed(false);
    if (nextStage !== 'pin-entry' && nextStage !== 'verify-otp') {
      setPin('');
    }
    if (nextStage !== 'setup' && nextStage !== 'set-new-pin') {
      setConfirmPin('');
    }
    if (nextStage !== 'verify-otp') {
      setOtp('');
    }
    setStage(nextStage);
  }

  async function handleForgotPinSendOtp() {
    setRecoveryFlowActive(true);
    setForgotPinConfirmArmed(false);
    const ok = await runAction('otp', () => requestRecoveryOtp());
    if (ok === null) {
      return;
    }
    if (ok) {
      setPin('');
      setOtp('');
      setError(null);
      setStage('verify-otp');
    }
  }

  async function handleVerifyRecoveryOtp() {
    if (otp.length < 6) {
      setError(t('authSecurity.errors.enterOtp'));
      return;
    }

    try {
      const ok = await runAction('verify-otp', () => verifyRecoveryOtp(otp));
      if (ok === null) {
        return;
      }

      if (!ok) {
        setError(t('authSecurity.errors.invalidOtp'));
        return;
      }
    } catch {
      setError(t('authSecurity.errors.invalidOtp'));
      return;
    }

    setPin('');
    setConfirmPin('');
    setOtp('');
    setError(null);
    setRecoveryFlowActive(true);
    setForgotPinConfirmArmed(false);
    setStage('set-new-pin');
  }

  async function handleConfirmNewPin() {
    if (pin.length < 4) {
      setError(t('authSecurity.errors.pinLength'));
      return;
    }

    if (pin !== confirmPin) {
      setError(t('authSecurity.errors.pinMismatch'));
      return;
    }

    const ok = await runAction('reset-pin', () => setupPin(pin));
    if (ok === null) {
      return;
    }
    if (ok) {
      setError(null);
      setRecoveryFlowActive(false);
      setForgotPinConfirmArmed(false);
      setPin('');
      setConfirmPin('');
      setStage('idle');
    }
  }

  function handleForgotPinPress() {
    if (pin.length > 0 && !forgotPinConfirmArmed) {
      setForgotPinConfirmArmed(true);
      return;
    }

    setRecoveryFlowActive(true);
    setForgotPinConfirmArmed(false);
    switchStage('forgot-pin');
  }

  if (!isReady || stage === 'idle') {
    return null;
  }

  return (
    <Modal visible transparent animationType="fade">
      <AuthSecurityShell>
        {stage === 'setup' ? (
          <ScrollView style={styles.modalCard} contentContainerStyle={styles.keyboardScreenContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.pinSetupBody}>
              <View style={styles.pinSetupBrand}>
                <Text variant="caption" style={styles.pinSetupEyebrow}>
                  {t('authSecurity.flow.deviceSecurity')}
                </Text>
                <View style={styles.pinSetupIconCircle}>
                  <MaterialIcons name="verified-user" size={28} color={colors.primary.DEFAULT} />
                </View>
                <Text variant="h1" style={styles.pinSetupTitle}>
                  {t('authSecurity.flow.createPinTitle')}
                </Text>
                <Text variant="body" style={styles.pinSetupSubtitle}>
                  {t('authSecurity.flow.createPinDescription')}
                </Text>
              </View>
              <View style={styles.pinInputGroup}>
                <OTPInput length={4} label={t('authSecurity.flow.securityPin')} value={pin} onChange={setPin} />
                <OTPInput length={4} label={t('authSecurity.flow.confirmPin')} value={confirmPin} onChange={setConfirmPin} />
              </View>
              <View style={styles.newPinInfoCard}>
                <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                  <MaterialIcons name="info" size={18} color={colors.primary.DEFAULT} />
                  <Text variant="caption" style={styles.newPinHelper}>
                    {t('authSecurity.flow.pinHelper')}
                  </Text>
                </View>
                {error ? (
                  <Text variant="caption" color={colors.status.error} style={{ marginTop: spacing[2] }}>
                    {error}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={styles.newPinFooter}>
              <Button fullWidth rounded disabled={pin.length < 4 || confirmPin.length < 4 || isBusy} loading={pendingAction === 'setup'} onPress={() => void handleContinueSetup()}>
                {t('authSecurity.flow.savePin')}
              </Button>
              <Text variant="caption" style={styles.newPinFooterHint}>
                {t('authSecurity.flow.completeSixDigits')}
              </Text>
              <Button variant="outline" fullWidth rounded onPress={dismissSetupPrompt} disabled={isBusy}>
                {t('profile.security.pin.skip')}
              </Button>
            </View>
          </ScrollView>
        ) : null}

        {stage === 'pin-entry' ? (
          <View style={styles.modalCard}>
            <PinEntryScreen
              value={pin}
              error={error}
              forgotPinHint={forgotPinConfirmArmed ? 'Tap Forgot PIN again to continue.' : null}
              displayName={displayName}
              onChange={(value) => void handlePinChange(value)}
              onForgotPin={() => {
                handleForgotPinPress();
              }}
              busy={isBusy}
              pinLoading={pendingAction === 'pin'}
            />
          </View>
        ) : null}

        {stage === 'forgot-pin' ? (
          <View style={styles.modalCard}>
            <ForgotPinScreen
              onSendOtp={() => void handleForgotPinSendOtp()}
              onCancel={() => switchStage('pin-entry')}
              busy={isBusy}
              otpLoading={pendingAction === 'otp'}
              error={error}
            />
          </View>
        ) : null}

        {stage === 'set-new-pin' ? (
          <View style={styles.modalCard}>
            <SetNewPinScreen
              value={pin}
              confirmValue={confirmPin}
              onChange={(value) => void handlePinChange(value)}
              onConfirmChange={setConfirmPin}
              error={error}
              onBack={() => switchStage('forgot-pin')}
              onConfirm={() => void handleConfirmNewPin()}
              busy={isBusy}
            />
          </View>
        ) : null}

        {stage === 'verify-otp' ? (
          <View style={styles.modalCard}>
            <VerifyOtpScreen
              value={otp}
              error={error}
              onChange={(value) => {
                setOtp(value);
                setError(null);
              }}
              onBack={() => switchStage('forgot-pin')}
              onConfirm={() => void handleVerifyRecoveryOtp()}
              busy={pendingAction === 'verify-otp'}
            />
          </View>
        ) : null}
      </AuthSecurityShell>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalCard: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  screen: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  genericScreen: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  keyboardScreenContent: {
    flexGrow: 1,
  },
  successScreen: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
  },
  progressActive: {
    width: 48,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary.DEFAULT,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  faceCircle: {
    width: 192,
    height: 192,
    borderRadius: 999,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: '#e8d7cb',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  faceRing: {
    position: 'absolute',
    width: 256,
    height: 256,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(242, 120, 13, 0.12)',
  },
  titleCenter: {
    marginTop: spacing[8],
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
  },
  subtitleCenter: {
    marginTop: spacing[2],
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  infoCard: {
    marginTop: spacing[8],
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(142, 114, 100, 0.2)',
    backgroundColor: 'rgba(255, 234, 223, 0.6)',
  },
  infoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242, 120, 13, 0.1)',
  },
  infoLabel: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  infoValue: {
    color: colors.primary.DEFAULT,
    fontFamily: typography.fontFamily.semibold,
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[3],
  },
  genericCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
  },
  biometricCircle: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: 'rgba(242, 120, 13, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  genericTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
  },
  genericSubtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  artisanCard: {
    marginTop: spacing[6],
    width: '100%',
    backgroundColor: colors.background.surface,
    borderRadius: radius.xl,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: 'rgba(222, 193, 176, 0.3)',
  },
  artisanImage: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(242, 120, 13, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genericFooter: {
    width: '100%',
    marginTop: spacing[8],
    gap: spacing[3],
  },
  secureLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  secureLabel: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  safeBottom: {
    height: 24,
  },
  successMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
  },
  successPulseOuter: {
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(242, 120, 13, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[8],
  },
  successPulseInner: {
    width: 128,
    height: 128,
    borderRadius: 999,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(242, 120, 13, 0.12)',
  },
  successTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
  },
  successMessage: {
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  successCard: {
    marginTop: spacing[8],
    width: '100%',
    backgroundColor: colors.background.surface,
    borderRadius: radius.xl,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: 'rgba(242, 120, 13, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  successCardImage: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(242, 120, 13, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCardTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
  },
  successCardSubtitle: {
    color: colors.text.secondary,
  },
  successFooter: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[3],
  },
  securedBy: {
    color: colors.text.secondary,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pinScreen: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  pinScroll: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
    paddingTop: spacing[5],
  },
  pinBrand: {
    alignItems: 'center',
    marginTop: spacing[5],
    marginBottom: spacing[5],
  },
  pinEyebrow: {
    marginBottom: spacing[3],
    color: colors.primary.dark,
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  pinBrandCircle: {
    width: 104,
    height: 104,
    borderRadius: 999,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[5],
    ...shadows.md,
  },
  pinWelcome: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
  },
  pinMaster: {
    color: colors.primary.DEFAULT,
    fontFamily: typography.fontFamily.bold,
    marginTop: spacing[1],
    textAlign: 'center',
  },
  pinHeroCard: {
    paddingVertical: spacing[2],
    marginBottom: spacing[4],
  },
  pinHeroRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  pinHeroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    backgroundColor: colors.primary.subtle,
  },
  pinHeroBadgeText: {
    color: colors.primary.dark,
    fontFamily: typography.fontFamily.semibold,
  },
  pinMicrocopy: {
    marginTop: spacing[3],
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  pinActions: {
    width: '100%',
    marginTop: spacing[3],
    gap: spacing[3],
  },
  forgotActions: {
    width: '100%',
    marginTop: spacing[6],
    gap: spacing[3],
  },
  supportCard: {
    width: '100%',
    marginTop: spacing[6],
    padding: spacing[4],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(142, 114, 100, 0.16)',
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    gap: spacing[2],
  },
  supportLabel: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  pinFooter: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  setPinScreen: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  pinSetupBody: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
  },
  pinSetupBrand: {
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  pinSetupEyebrow: {
    marginBottom: spacing[3],
    color: colors.primary.dark,
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  pinSetupIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    ...shadows.sm,
  },
  pinSetupTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
  },
  pinSetupSubtitle: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing[2],
    lineHeight: 22,
    maxWidth: 320,
  },
  pinInputGroup: {
    gap: spacing[4],
  },
  newPinInfoCard: {
    marginTop: spacing[4],
    marginBottom: spacing[4],
    padding: spacing[4],
    borderRadius: radius.xl + 4,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    ...shadows.sm,
  },
  newPinHelper: {
    color: colors.text.secondary,
    lineHeight: 20,
  },
  newPinFooter: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[3],
  },
  newPinFooterHint: {
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  lockCircle: {
    width: 104,
    height: 104,
    borderRadius: 999,
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.primary.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    ...shadows.md,
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
