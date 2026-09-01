import { Modal, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/src/components/ui';
import { colors, radius, spacing, typography } from '@/src/theme';

export type DialogVariant = 'info' | 'success' | 'warning' | 'error' | 'confirm';

export interface DialogProps {
  visible: boolean;
  variant?: DialogVariant;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const dialogTone = {
  info: {
    icon: 'info',
    accent: colors.text.primary,
    tint: colors.background.surface,
  },
  success: {
    icon: 'check-circle',
    accent: colors.status.success,
    tint: colors.status.successLight,
  },
  warning: {
    icon: 'warning',
    accent: colors.status.warning,
    tint: colors.status.warningLight,
  },
  error: {
    icon: 'error',
    accent: colors.status.error,
    tint: '#fee2e2',
  },
  confirm: {
    icon: 'help',
    accent: colors.primary.DEFAULT,
    tint: colors.primary.subtle,
  },
} as const;

export function Dialog({
  visible,
  variant = 'info',
  title,
  description,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: DialogProps) {
  const insets = useSafeAreaInsets();
  const tone = dialogTone[variant];
  const showCancel = variant === 'confirm' && Boolean(onCancel);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      hardwareAccelerated
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancel ?? onConfirm}>
      <View style={{ flex: 1 }}>
        <Pressable
          onPress={onCancel ?? onConfirm}
          style={{
            flex: 1,
            backgroundColor: 'rgba(17,24,39,0.48)',
            justifyContent: 'center',
            padding: 0,
          }}>
          <View
            style={{
              paddingTop: spacing[4] + insets.top,
              paddingHorizontal: spacing[4],
              paddingBottom: spacing[4] + insets.bottom,
            }}>
            <Pressable
              onPress={(event) => event.stopPropagation()}
              style={{
                borderRadius: radius.xl,
                backgroundColor: colors.background.surface,
                borderWidth: 1,
                borderColor: variant === 'error' ? '#fecaca' : colors.primary.borderLight,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  padding: spacing[4],
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing[3],
                  backgroundColor: tone.tint,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.primary.borderLight,
                }}>
                <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.surface }}>
                  <MaterialIcons name={tone.icon as never} size={22} color={tone.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                    {title}
                  </Text>
                  {description ? (
                    <Text variant="body" color={colors.text.secondary} style={{ marginTop: 2, lineHeight: 20 }}>
                      {description}
                    </Text>
                  ) : null}
                </View>
                {variant !== 'confirm' && onCancel ? (
                  <Pressable accessibilityRole="button" onPress={onCancel} style={{ width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="close" size={18} color={colors.text.muted} />
                  </Pressable>
                ) : null}
              </View>

              <View style={{ padding: spacing[4], gap: spacing[3] }}>
                {variant === 'confirm' ? (
                  <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                    {showCancel ? (
                      <View style={{ flex: 1 }}>
                        <Button variant="outline" fullWidth rounded onPress={onCancel}>
                          {cancelLabel}
                        </Button>
                      </View>
                    ) : null}
                    <View style={{ flex: 1 }}>
                      <Button fullWidth rounded onPress={onConfirm}>
                        {confirmLabel}
                      </Button>
                    </View>
                  </View>
                ) : (
                  <Button fullWidth rounded onPress={onConfirm}>
                    {confirmLabel}
                  </Button>
                )}
              </View>
            </Pressable>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}
