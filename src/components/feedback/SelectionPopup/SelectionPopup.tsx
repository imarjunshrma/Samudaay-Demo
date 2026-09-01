import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '@/src/components/ui/Button';
import { Text } from '@/src/components/ui/Text';
import { colors, radius, spacing, typography } from '@/src/theme';

export type SelectionPopupOption = {
  key: string;
  label: string;
};

export interface SelectionPopupProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  options: readonly SelectionPopupOption[];
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

export function SelectionPopup({
  visible,
  title,
  subtitle,
  options,
  selectedKey,
  onSelect,
  onClose,
  onConfirm,
  confirmLabel = 'Confirm',
}: SelectionPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(17,24,39,0.48)', justifyContent: 'center', padding: spacing[4] }}>
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{
              borderRadius: radius.xl,
              backgroundColor: colors.background.DEFAULT,
              borderWidth: 1,
              borderColor: '#fecaca',
              overflow: 'hidden',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], borderBottomWidth: 1, borderBottomColor: '#f1f5f9', backgroundColor: 'rgba(254,242,242,0.55)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <Text variant="caption" color="#b91c1c" style={{ fontFamily: typography.fontFamily.bold }}>
                  {title}
                </Text>
              </View>
              <Pressable onPress={onClose} accessibilityRole="button">
                <MaterialIcons name="close" size={18} color="#94a3b8" />
              </Pressable>
            </View>
            <View style={{ padding: spacing[4] }}>
              {subtitle ? (
                <Text variant="body" style={{ fontFamily: typography.fontFamily.medium, marginBottom: spacing[3] }}>
                  {subtitle}
                </Text>
              ) : null}
              <View style={{ gap: spacing[2] }}>
                {options.map((option) => {
                  const active = option.key === selectedKey;
                  return (
                    <Pressable
                      key={option.key}
                      onPress={() => onSelect?.(option.key)}
                      accessibilityRole="button"
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: spacing[3],
                        borderRadius: radius.lg,
                        borderWidth: 1,
                        borderColor: active ? '#fecaca' : '#e2e8f0',
                        backgroundColor: active ? 'rgba(254,242,242,0.45)' : colors.background.DEFAULT,
                      }}>
                      <Text variant="caption" style={{ fontFamily: typography.fontFamily.medium }}>
                        {option.label}
                      </Text>
                      <MaterialIcons name={active ? 'radio-button-checked' : 'radio-button-unchecked'} size={18} color={colors.primary.DEFAULT} />
                    </Pressable>
                  );
                })}
              </View>
              <View style={{ marginTop: spacing[4] }}>
                <Button onPress={onConfirm} variant="danger" fullWidth rounded>
                  {confirmLabel}
                </Button>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
