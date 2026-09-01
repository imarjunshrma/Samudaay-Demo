import { Image, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard, SearchInput, Text } from '@/src/components';

import { adminBottomBarItems } from '@/src/core/navigation/admin-shell';

import { colors, radius, shadows, spacing, typography } from '@/src/theme';

export function AdminTrusteeRow({
  name,
  role,
  meta,
  avatar,
  onEdit,
  onDelete,
}: {
  name: string;
  role: string;
  meta: string;
  avatar?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <EntityActionCard
      leading={
        <View style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderColor: colors.primary.border, overflow: 'hidden', backgroundColor: colors.background.muted }}>
          {avatar ? <Image source={{ uri: avatar }} resizeMode="cover" style={{ width: '100%', height: '100%' }} /> : null}
        </View>
      }
      title={name}
      subtitle={meta}
      detail={role}
      actions={[
        {
          key: 'edit',
          label: 'Edit',
          onPress: onEdit,
          leftIcon: <MaterialIcons name="edit" size={18} color={colors.text.muted} />,
          variant: 'outline',
        },
        {
          key: 'delete',
          label: 'Delete',
          onPress: onDelete,
          leftIcon: <MaterialIcons name="delete" size={18} color="#ef4444" />,
          variant: 'soft',
        },
      ]}
    />
  );
}
