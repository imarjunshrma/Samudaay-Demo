import type { PropsWithChildren } from 'react';
import { Pressable } from 'react-native';

import { motion } from '@/src/theme';

export function AnimatedPressable({
  children,
  onPress,
  disabled,
}: PropsWithChildren<{ onPress?: () => void; disabled?: boolean }>) {
  return (
    <Pressable
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed && !disabled ? motion.scale.press : 1 }],
      })}>
      {children}
    </Pressable>
  );
}
