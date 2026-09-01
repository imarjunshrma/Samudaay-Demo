import { MaterialIcons } from '@expo/vector-icons';

import { colors, iconSizes } from '@/src/theme';

export type IconName = string;

interface IconProps {
  name: IconName;
  size?: keyof typeof iconSizes | number;
  color?: string;
}

export function Icon({ name, size = 'md', color = colors.text.secondary }: IconProps) {
  const resolvedSize = typeof size === 'number' ? size : iconSizes[size];
  return <MaterialIcons name={name as React.ComponentProps<typeof MaterialIcons>['name']} size={resolvedSize} color={color} />;
}
