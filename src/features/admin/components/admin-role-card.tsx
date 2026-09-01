import { View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard } from '@/src/components';
import { colors, radius } from '@/src/theme';

export function AdminRoleCard({
  title,
  description,
  icon,
  kind = 'Custom',
  onEditPress,
  onDeletePress,
}: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  kind?: 'System' | 'Custom';
  onEditPress?: () => void;
  onDeletePress?: () => void;
}) {
  const isSystem = kind === 'System';
  const accentColor = isSystem ? colors.primary.DEFAULT : '#f59e0b';

  return (
    <EntityActionCard
      accentColor={accentColor}
      leading={
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.lg,
            backgroundColor: isSystem ? colors.primary.muted : '#fff7ed',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons
            name={icon}
            size={24}
            color={isSystem ? colors.primary.DEFAULT : '#ea580c'}
          />
        </View>
      }
      title={title}
      subtitle={description}
      actions={[
        ...(onEditPress
          ? [{
              key: 'edit',
              label: 'Edit',
              leftIcon: <MaterialIcons name="edit" size={16} color={colors.primary.DEFAULT} />,
              variant: 'outline' as const,
              flex: 1,
              onPress: onEditPress,
            }]
          : []),
        ...(onDeletePress
          ? [{
              key: 'delete',
              label: 'Delete',
              leftIcon: <MaterialIcons name="delete" size={16} color="#dc2626" />,
              variant: 'ghost' as const,
              flex: 1,
              onPress: onDeletePress,
            }]
          : []),
      ]}
    />
  );
}
