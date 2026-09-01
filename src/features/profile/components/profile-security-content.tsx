import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { Button, OTPInput, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { isAdminLikeSession } from '@/src/core/navigation/default-route';
import { useSession } from '@/src/core/providers/session-provider';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';
import { authService } from '@/src/features/auth/services/auth-service';
import { readPinEnabled, verifyStoredPin } from '../services/security-settings.service';

export function ProfileSecurityContent() {
  const t = useTranslations();
  const navigateBack = useBackNavigation();
  const { session } = useSession();
  const isAdmin = isAdminLikeSession(session);
  const isActive = isAdmin || session?.user.kycStatus === 'APPROVED';
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [currentPinValue, setCurrentPinValue] = useState('');
  const [pinValue, setPinValue] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');
  const [pinSaving, setPinSaving] = useState(false);
  const [pinMessage, setPinMessage] = useState<string | null>(null);
  const [pinEnabled, setPinEnabled] = useState(false);

  useEffect(() => {
    let active = true;

    readPinEnabled({
        mobileNumber: session?.user.mobileNumber,
        tenantId: session?.user.tenantId,
      })
      .then((nextPinEnabled) => {
        if (!active) return;
        setPinEnabled(nextPinEnabled);
      })
      .catch(() => {
        if (!active) return;
      });

    return () => {
      active = false;
    };
  }, [session?.user.mobileNumber, session?.user.tenantId]);

  function handleBackPress() {
    navigateBack();
  }

  async function handleSavePin() {
    setPinMessage(null);

    if (!isActive) {
      setPinMessage(t('profile.security.errors.activeRequired'));
      return;
    }

    const pin = pinValue.trim();
    const confirmPin = confirmPinValue.trim();
    const currentPin = currentPinValue.trim();

    if (pinEnabled) {
      if (currentPin.length !== 4) {
        setPinMessage(t('authSecurity.errors.pinLength'));
        return;
      }

      const currentPinValid = await verifyStoredPin(currentPin, {
        mobileNumber: session?.user.mobileNumber,
        tenantId: session?.user.tenantId,
      });

      if (!currentPinValid) {
        setPinMessage(t('authSecurity.errors.pinIncorrect'));
        return;
      }
    }

    if (pin.length !== 4) {
      setPinMessage(t('profile.security.errors.pinLength'));
      return;
    }

    if (pin !== confirmPin) {
      setPinMessage(t('profile.security.errors.pinMismatch'));
      return;
    }

    setPinSaving(true);
    try {
      await authService.setupPin(pin, {
        mobileNumber: session?.user.mobileNumber,
        tenantId: session?.user.tenantId,
        session,
      });
      setPinModalOpen(false);
      setCurrentPinValue('');
      setPinValue('');
      setConfirmPinValue('');
      setPinMessage(null);
      setPinEnabled(true);
    } catch (error) {
      setPinMessage(error instanceof Error ? error.message : t('profile.security.errors.pinSaveFailed'));
    } finally {
      setPinSaving(false);
    }
  }

  function handleSkipPinSetup() {
    setPinModalOpen(false);
    setCurrentPinValue('');
    setPinValue('');
    setConfirmPinValue('');
    setPinMessage(null);
  }

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing[4],
            height: 64,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary.borderLight,
            backgroundColor: colors.background.DEFAULT,
            gap: spacing[3],
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], flex: 1 }}>
            <Pressable
              accessibilityRole="button"
              onPress={handleBackPress}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.full,
              }}>
              <MaterialIcons name="arrow-back" size={28} color={colors.text.primary} />
            </Pressable>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
              {t('profile.security.title')}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing[4],
            paddingTop: spacing[5],
            paddingBottom: 120,
            gap: spacing[4],
          }}>
          {!isActive ? (
            <View
              style={{
                padding: spacing[4],
                borderRadius: radius.xl,
                backgroundColor: '#fff4e6',
                borderWidth: 1,
                borderColor: '#f5c98b',
                gap: spacing[2],
              }}>
              <Text variant="label" color="#9a3412" style={{ fontFamily: typography.fontFamily.bold }}>
                {t('profile.security.inactive.title')}
              </Text>
              <Text variant="body" color="#9a3412" style={{ lineHeight: 22 }}>
                {t('profile.security.inactive.description')}
              </Text>
            </View>
          ) : null}

          <View
            style={{
              padding: spacing[4],
              borderRadius: radius.xl + 4,
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.primary.borderLight,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3], flex: 1, minWidth: 0 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 999,
                    backgroundColor: colors.primary.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                  <MaterialIcons name="pin" size={24} color={colors.primary.DEFAULT} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text variant="h4" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                    {t('profile.security.pin.cardTitle')}
                  </Text>
                  <Text variant="body" style={{ color: colors.text.secondary, marginTop: 2 }}>
                    {t('profile.security.pin.subtitle')}
                  </Text>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: spacing[2],
                      paddingHorizontal: spacing[3],
                      paddingVertical: 4,
                      borderRadius: radius.full,
                      backgroundColor: pinEnabled ? colors.status.successLight : colors.background.muted,
                    }}>
                    <Text
                      variant="caption"
                      style={{
                        color: pinEnabled ? colors.status.success : colors.text.muted,
                        fontFamily: typography.fontFamily.bold,
                        textTransform: 'uppercase',
                        letterSpacing: 0.7,
                      }}>
                      {pinEnabled ? t('profile.security.pin.enabled') : t('profile.security.pin.disabled')}
                    </Text>
                  </View>
                </View>
              </View>

            </View>

            <Pressable
              accessibilityRole="button"
              disabled={!isActive || pinSaving}
              onPress={() => {
                setPinModalOpen(true);
              }}
              style={({ pressed }) => ({
                marginTop: spacing[4],
                height: 42,
                borderRadius: radius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary.muted,
                opacity: !isActive || pinSaving ? 0.55 : pressed ? 0.82 : 1,
              })}>
              <Text variant="label" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                {pinEnabled ? t('profile.security.actions.change') : t('profile.security.pin.enable')}
              </Text>
            </Pressable>

            <View style={{ marginTop: spacing[5] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[2], paddingHorizontal: spacing[1] }}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 44,
                      height: 48,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(242,120,13,0.20)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.background.surface,
                    }}>
                    <Text variant="h4" style={{ color: colors.text.primary }}>
                      •
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(250, 228, 216, 0.5)',
              padding: spacing[4],
              borderRadius: radius.xl + 4,
              borderWidth: 1,
              borderColor: 'rgba(242,120,13,0.10)',
              flexDirection: 'row',
              gap: spacing[4],
            }}>
            <MaterialIcons name="shield" size={22} color={colors.primary.DEFAULT} />
            <Text variant="body" color={colors.text.secondary} style={{ flex: 1, lineHeight: 22 }}>
              {t('profile.security.info')}
            </Text>
          </View>
        </ScrollView>

        <Modal visible={pinModalOpen} transparent animationType="fade" onRequestClose={handleSkipPinSetup}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Pressable
              onPress={handleSkipPinSetup}
              style={{
                flex: 1,
                backgroundColor: 'rgba(17,24,39,0.45)',
                justifyContent: 'flex-end',
                paddingTop: spacing[3],
              }}>
              <View style={{ position: 'relative', width: '100%', alignSelf: 'stretch', height: '82%' }}>
                <Pressable
                  onPress={handleSkipPinSetup}
                  accessibilityRole="button"
                  accessibilityLabel={t('profile.security.sheet.close')}
                  hitSlop={12}
                  style={{
                    position: 'absolute',
                    top: -8,
                    alignSelf: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.text.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    elevation: 4,
                  }}>
                  <MaterialIcons name="close" size={24} color={colors.text.inverse} />
                </Pressable>

                <Pressable
                  onPress={(event) => event.stopPropagation()}
                  style={{
                    backgroundColor: colors.background.surface,
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    borderWidth: 1,
                    borderColor: colors.border.DEFAULT,
                    flex: 1,
                    overflow: 'hidden',
                    ...shadows.lg,
                  }}>
                  <View style={{ alignItems: 'center', paddingTop: spacing[2], paddingBottom: spacing[2] }}>
                    <View style={{ width: 44, height: 5, borderRadius: 999, backgroundColor: colors.border.light }} />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: spacing[3],
                      paddingHorizontal: spacing[4],
                      paddingBottom: spacing[4],
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border.light,
                      backgroundColor: 'rgba(255,249,244,0.95)',
                    }}>
                    <View style={{ flex: 1, gap: spacing[1] }}>
                      <Text
                        variant="caption"
                        style={{
                          color: colors.primary.dark,
                          fontFamily: typography.fontFamily.bold,
                          textTransform: 'uppercase',
                          letterSpacing: 1.4,
                        }}>
                        {pinEnabled ? t('profile.security.sheet.updateEyebrow') : t('profile.security.sheet.createEyebrow')}
                      </Text>
                      <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                        {t('profile.security.pin.cardTitle')}
                      </Text>
                      <Text variant="caption" color={colors.text.muted} style={{ lineHeight: 18 }}>
                        {t('profile.security.sheet.headerDescription')}
                      </Text>
                    </View>
                  </View>

                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, minHeight: 0 }}
                    contentContainerStyle={{ padding: spacing[4], paddingBottom: spacing[7], gap: spacing[4], flexGrow: 1 }}>
                    <View
                      style={{
                        borderRadius: radius.xl + 4,
                        borderWidth: 1,
                        borderColor: colors.border.muted,
                        backgroundColor: colors.background.surface,
                        padding: spacing[4],
                        gap: spacing[2],
                        ...shadows.sm,
                      }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.background.surface,
                          }}>
                          <MaterialIcons name="shield" size={18} color={colors.primary.DEFAULT} />
                        </View>
                        <Text variant="label" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                          {t('profile.security.sheet.deviceLockTitle')}
                        </Text>
                      </View>
                      <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
                        {t('profile.security.pin.subtitle')}
                      </Text>
                    </View>

                    {pinEnabled ? (
                      <View
                        style={{
                          borderRadius: radius.xl + 8,
                          borderWidth: 1,
                          borderColor: colors.primary.borderLight,
                          backgroundColor: colors.background.surface,
                          padding: spacing[4],
                          gap: spacing[3],
                          ...shadows.sm,
                        }}>
                        <View style={{ gap: spacing[1] }}>
                          <Text variant="label" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                            {t('profile.security.sheet.verifyCurrentTitle')}
                          </Text>
                          <Text variant="caption" color={colors.text.muted}>
                            {t('profile.security.sheet.verifyCurrentDescription')}
                          </Text>
                        </View>
                        <OTPInput
                          length={4}
                          label={t('authSecurity.flow.currentPin')}
                          value={currentPinValue}
                          onChange={setCurrentPinValue}
                        />
                      </View>
                    ) : null}

                    <View
                      style={{
                        borderRadius: radius.xl + 8,
                        borderWidth: 1,
                        borderColor: colors.primary.borderLight,
                        backgroundColor: colors.background.surface,
                        padding: spacing[4],
                        gap: spacing[3],
                        ...shadows.sm,
                      }}>
                      <View style={{ gap: spacing[1] }}>
                        <Text variant="label" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                          {pinEnabled ? t('profile.security.sheet.createNewTitle') : t('profile.security.sheet.setPinTitle')}
                        </Text>
                        <Text variant="caption" color={colors.text.muted}>
                          {t('profile.security.sheet.setPinDescription')}
                        </Text>
                      </View>

                      <OTPInput
                        length={4}
                        label={t('profile.security.pin.newLabel')}
                        value={pinValue}
                        onChange={setPinValue}
                      />

                      <View
                        style={{
                          height: 1,
                          backgroundColor: colors.border.muted,
                          marginVertical: spacing[1],
                        }}
                      />

                      <OTPInput
                        length={4}
                        label={t('profile.security.pin.confirmLabel')}
                        value={confirmPinValue}
                        onChange={setConfirmPinValue}
                      />
                    </View>

                    {pinMessage ? (
                      <View
                        style={{
                          borderRadius: radius.lg,
                          backgroundColor: colors.status.errorLight,
                          borderWidth: 1,
                          borderColor: 'rgba(186,26,26,0.12)',
                          paddingHorizontal: spacing[3],
                          paddingVertical: spacing[3],
                        }}>
                        <Text variant="caption" color={colors.status.error}>
                          {pinMessage}
                        </Text>
                      </View>
                    ) : null}
                  </ScrollView>

                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: spacing[3],
                      borderTopWidth: 1,
                      borderTopColor: colors.border.light,
                    }}>
                    <Pressable
                      accessibilityRole="button"
                      disabled={pinSaving}
                      onPress={handleSkipPinSetup}
                      style={{
                        flex: 1,
                        minHeight: 52,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.background.surface,
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderColor: colors.primary.border ?? colors.border.DEFAULT,
                        borderTopLeftRadius: radius.xl,
                        borderBottomLeftRadius: radius.xl,
                      }}>
                      <Text style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
                        {pinEnabled ? t('actions.cancel') : t('profile.security.pin.skip')}
                      </Text>
                    </Pressable>

                    <View style={{ flex: 1 }}>
                      <Button fullWidth rounded loading={pinSaving} onPress={() => void handleSavePin()}>
                        {t('profile.security.pin.save')}
                      </Button>
                    </View>
                  </View>
                </Pressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </AppSafeAreaView>
  );
}
