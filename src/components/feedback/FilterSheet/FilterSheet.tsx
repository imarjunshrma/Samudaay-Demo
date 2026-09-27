import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';

import { useBottomSafeSpacing } from '@/src/components/layout/SafeAreaInsets';
import { Text } from '@/src/components/ui/Text';
import { FilterChips } from '@/src/components/lists/FilterChips/FilterChips';
import { colors, radius, spacing, typography } from '@/src/theme';

export type FilterSheetOption = {
  key: string;
  label: string;
};

export type FilterSheetSection = {
  title: string;
  activeKey: string;
  activeKeys?: string[];
  items: FilterSheetOption[];
  onSelect: (key: string) => void;
  selectionMode?: 'single' | 'multiple';
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
  renderContent?: () => React.ReactNode;
};

export interface FilterSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  sections: FilterSheetSection[];
  onClose: () => void;
  onApply: () => void;
  onReset?: () => void;
  applyLabel?: string;
  resetLabel?: string;
}

export function FilterSheet({
  visible,
  title,
  subtitle,
  sections,
  onClose,
  onApply,
  onReset,
  applyLabel = 'Apply Filters',
  resetLabel = 'Reset',
}: FilterSheetProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const footerBottomPadding = useBottomSafeSpacing(spacing[3]);

  const activeSection = useMemo(() => sections[activeSectionIndex] ?? sections[0], [activeSectionIndex, sections]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable
          onPress={onClose}
          style={{
            flex: 1,
            backgroundColor: 'rgba(17,24,39,0.45)',
            justifyContent: 'flex-end',
            paddingHorizontal: 0,
            paddingTop: spacing[3],
            paddingBottom: 0,
          }}>
          <View style={{ position: 'relative', width: '100%', alignSelf: 'stretch', height: '82%' }}>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
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
                paddingHorizontal: spacing[0],
                paddingTop: spacing[0],
                paddingBottom: spacing[0],
                flex: 1,
                width: '100%',
                flexShrink: 1,
                overflow: 'hidden',
              }}>
          <View style={{ alignItems: 'center', paddingTop: spacing[2], paddingBottom: spacing[2] }}>
            <View style={{ width: 44, height: 5, borderRadius: 999, backgroundColor: colors.border.light }} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[4], paddingBottom: spacing[3], borderBottomWidth: 1, borderBottomColor: colors.border.light }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                {title}
              </Text>
              {subtitle ? (
                <Text variant="caption" color={colors.text.muted} style={{ marginTop: 2 }}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
            {onReset ? (
              <Pressable onPress={onReset} accessibilityRole="button" accessibilityLabel="Clear all" hitSlop={12}>
                <Text style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
                  Clear all
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close filters" hitSlop={12}>
                <MaterialIcons name="close" size={22} color={colors.text.muted} />
              </Pressable>
            )}
          </View>

          <View style={{ flexDirection: 'row', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <View style={{ width: 102, flexShrink: 0, borderRightWidth: 1, borderRightColor: colors.border.light, backgroundColor: colors.background.DEFAULT, paddingVertical: spacing[2] }}>
              <View pointerEvents="none" style={{ position: 'absolute', top: spacing[2], bottom: spacing[2], right: 1, width: 3, borderRadius: 999, backgroundColor: colors.primary.DEFAULT, opacity: 0.5, zIndex: 1 }} />
              <ScrollView showsVerticalScrollIndicator persistentScrollbar style={{ flex: 1 }}>
                {sections.map((section, index) => {
                  const active = index === activeSectionIndex;
                  const activeCount = section.selectionMode === 'multiple'
                    ? (section.activeKeys ?? []).filter((key) => key !== 'all').length
                    : (section.activeKey && section.activeKey !== 'all' ? 1 : 0);
                  return (
                    <Pressable
                      key={section.title}
                      accessibilityRole="button"
                      onPress={() => setActiveSectionIndex(index)}
                      style={{
                        minHeight: 72,
                        paddingHorizontal: spacing[2],
                        paddingVertical: spacing[2],
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: active ? colors.primary.muted : 'transparent',
                        borderRightWidth: active ? 3 : 0,
                        borderRightColor: active ? colors.primary.DEFAULT : 'transparent',
                      }}>
                      <MaterialIcons
                        name={section.icon ?? (index === 0 ? 'sort' : index === 1 ? 'schedule' : 'place')}
                        size={18}
                        color={active ? colors.primary.DEFAULT : colors.text.muted}
                      />
                      <Text
                        variant="caption"
                        style={{
                          marginTop: 6,
                          textAlign: 'center',
                          fontFamily: active ? typography.fontFamily.bold : typography.fontFamily.medium,
                          color: active ? colors.text.primary : colors.text.muted,
                        }}>
                        {section.title}
                      </Text>
                      {activeCount > 0 ? (
                        <View style={{ marginTop: 4, minWidth: 18, height: 18, borderRadius: 999, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                          <Text variant="caption" color="#fff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                            {activeCount}
                          </Text>
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, minHeight: 0 }} contentContainerStyle={{ gap: spacing[3], padding: spacing[4], flexGrow: 1 }}>
              <View style={{ gap: spacing[2], padding: spacing[3], borderRadius: radius.xl, backgroundColor: colors.background.DEFAULT, borderWidth: 1, borderColor: colors.primary.borderLight }}>
                {activeSection ? (
                  <>
                    <FilterChips
                      items={activeSection.items}
                      activeKey={activeSection.activeKey}
                      activeKeys={activeSection.selectionMode === 'multiple' ? activeSection.activeKeys : undefined}
                      onPress={activeSection.onSelect}
                    />
                    {activeSection.renderContent ? activeSection.renderContent() : null}
                  </>
                ) : null}
              </View>
            </ScrollView>
          </View>

          <View style={{ flexDirection: 'row', paddingTop: spacing[3], paddingBottom: footerBottomPadding, marginTop: spacing[2], borderTopWidth: 1, borderTopColor: colors.border.light }}>
            {onReset ? (
              <Pressable
                accessibilityRole="button"
                onPress={onReset}
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
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}>
                <Text style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
                  {resetLabel}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={onClose}
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
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}>
                <Text style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
                  Close
                </Text>
              </Pressable>
            )}
            <View style={{ flex: 1 }}>
              <Pressable
                accessibilityRole="button"
                onPress={onApply}
                style={{
                  minHeight: 52,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.primary.DEFAULT,
                  borderTopRightRadius: radius.xl,
                  borderBottomRightRadius: radius.xl,
                }}>
                <Text style={{ fontFamily: typography.fontFamily.bold, color: colors.text.inverse }}>
                  {applyLabel}
                </Text>
              </Pressable>
            </View>
          </View>
            </Pressable>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
