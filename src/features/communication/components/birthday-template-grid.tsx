import { TouchableOpacity, View } from 'react-native';

import { TemplateCard, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import type { BirthdayTemplateManagementItem } from '../constants';
import { colors, spacing, typography } from '@/src/theme';

export function BirthdayTemplateGrid({
  mode = 'user',
  templates,
  selectedTemplateId,
  onCustomizePress,
  onSelectTemplate,
  onEditTemplatePress,
}: {
  mode?: 'user' | 'admin';
  templates: readonly BirthdayTemplateManagementItem[];
  selectedTemplateId?: string;
  onCustomizePress?: () => void;
  onSelectTemplate?: (templateId: string) => void;
  onEditTemplatePress?: (templateId: string) => void;
}) {
  const t = useTranslations('communication.send-birthday-card');

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingHorizontal: spacing[4],
          paddingTop: spacing[6],
          paddingBottom: spacing[2],
        }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          {t('templates.title')}
        </Text>
        {mode === 'admin' ? (
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onCustomizePress}>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
              {t('templates.customize')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: spacing[4],
          padding: spacing[4],
        }}>
        {templates.map((item) => (
          <TemplateCard
            key={item.id}
            title={item.title}
            image={item.image}
            selected={item.id === selectedTemplateId}
            editable={mode === 'admin'}
            onPress={() => onSelectTemplate?.(item.id)}
            onEditPress={() => onEditTemplatePress?.(item.id)}
          />
        ))}
      </View>
    </>
  );
}
