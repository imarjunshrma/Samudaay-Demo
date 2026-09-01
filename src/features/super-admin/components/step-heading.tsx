import { View } from 'react-native';

import { Text } from '@/src/components';

import { colors, spacing, typography } from '@/src/theme';

function StepHeading({ step, title }: { step: string; title: string }) {
  return (
    <View style={{ gap: spacing[2], marginBottom: spacing[4] }}>
      <Text variant="caption" color={colors.primary.DEFAULT} style={{ textTransform: 'uppercase', letterSpacing: 1.1, fontFamily: typography.fontFamily.bold }}>
        {step}
      </Text>
      <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
        {title}
      </Text>
    </View>
  );
}

export { StepHeading };
