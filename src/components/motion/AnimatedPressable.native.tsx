import { MotiPressable } from 'moti/interactions';
import type { PropsWithChildren } from 'react';

import { motion } from '@/src/theme';

export function AnimatedPressable({
  children,
  onPress,
  disabled,
}: PropsWithChildren<{ onPress?: () => void; disabled?: boolean }>) {
  return (
    <MotiPressable
      disabled={disabled}
      animate={({ pressed }) => ({ scale: pressed && !disabled ? motion.scale.press : 1 })}
      onPress={disabled ? undefined : onPress}>
      {children}
    </MotiPressable>
  );
}
