import { View } from 'react-native';

import { colors, radius, spacing } from '@/src/theme';

export function ProgressStepper({
  currentStep,
  totalSteps,
  activeColor = colors.primary.DEFAULT,
  inactiveColor = colors.primary.border,
  barWidth = 48,
  barHeight = 8,
}: {
  currentStep: number;
  totalSteps: number;
  activeColor?: string;
  inactiveColor?: string;
  barWidth?: number;
  barHeight?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing[4], paddingVertical: spacing[5] }}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const active = index < currentStep;
        return (
          <View
            key={index}
            style={{
              width: barWidth,
              height: barHeight,
              borderRadius: radius.full,
              backgroundColor: active ? activeColor : inactiveColor,
            }}
          />
        );
      })}
    </View>
  );
}
