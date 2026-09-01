import { Image, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { EntityActionCard } from '@/src/components';

import { colors, radius, spacing } from '@/src/theme';

export function AdminDirectoryCard({
  name,
  location,
  phone,
  role,
  avatar,
  statusTone = 'inactive',
  onAssignPermissions,
  onEdit,
  onDelete,
}: {
  name: string;
  location: string;
  phone?: string | null;
  role: string;
  avatar?: string;
  statusTone?: 'active' | 'inactive';
  onAssignPermissions?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const statusColor = statusTone === 'active' ? '#22c55e' : '#94a3b8';
  const subtitle = phone ? `${role} • ${phone}` : role;

  return (
    <EntityActionCard
      leading={
        <View style={{ position: 'relative', width: 64, height: 64 }}>
          {avatar ? (
            <Image source={{ uri: avatar }} accessibilityLabel="Member profile photo" style={{ width: 64, height: 64, borderRadius: radius.full, borderWidth: 2, borderColor: colors.primary.border }} />
          ) : (
            <View style={{ width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary.border }}>
              <MaterialIcons name="person" size={28} color={colors.primary.DEFAULT} />
            </View>
          )}
          <View style={{ position: 'absolute', right: 0, bottom: 0, width: 16, height: 16, borderRadius: radius.full, backgroundColor: statusColor, borderWidth: 2, borderColor: colors.background.surface }} />
        </View>
      }
      title={name}
      subtitle={subtitle}
      headerRight={
        <View style={{ flexDirection: 'row', gap: spacing[1] }}>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onAssignPermissions} style={{ width: 28, height: 28, borderRadius: radius.full, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="lock-open" size={16} color={colors.primary.DEFAULT} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onEdit} style={{ width: 28, height: 28, borderRadius: radius.full, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="edit" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onDelete} style={{ width: 28, height: 28, borderRadius: radius.full, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="delete" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      }
      metaItems={[
        {
          key: 'location',
          icon: <MaterialIcons name="location-on" size={14} color={colors.text.muted} />,
          label: location,
          color: colors.text.muted,
        },
      ]}
    />
  );
}
