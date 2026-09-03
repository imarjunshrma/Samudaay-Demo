import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export function FamilySummaryCard({ totalMembers = '04', onAddMember }: { totalMembers?: string; onAddMember?: () => void }) {
  const t = useTranslations('profile.family-management');

  return (
    <Card variant="default" padding="md">
      <View
        style={{
          borderRadius: radius.xl,
          backgroundColor: 'rgba(24,168,117,0.05)',
          borderWidth: 1,
          borderColor: 'rgba(24,168,117,0.2)',
          padding: spacing[4],
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] }}>
          <View>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
              {t('summary.totalMembers')}
            </Text>
            <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold }}>
              {totalMembers}
            </Text>
          </View>
          <Button size="sm" leftIcon={<MaterialIcons name="add" size={16} color="#ffffff" />} onPress={onAddMember}>
            {t('empty.action')}
          </Button>
        </View>
      </View>
    </Card>
  );
}
