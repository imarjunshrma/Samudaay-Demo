import { Pressable, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { RoleCatalogResponse } from '../services/role-management-service';

type ModulePermissionsMap = Record<string, RoleCatalogResponse['permissions']>;

type AdminModulePermissionSwitchesProps = {
  permissions: ModulePermissionsMap;
  selectedPermissions: Record<string, boolean>;
  onTogglePermission: (permissionKey: string, nextValue: boolean) => void;
};

function permissionIcon(module: string) {
  switch (module) {
    case 'events':
      return 'campaign';
    case 'donations':
      return 'payments';
    case 'birthdays':
      return 'cake';
    case 'family':
      return 'family-restroom';
    case 'matrimony':
      return 'favorite';
    case 'registration':
      return 'verified';
    case 'expenses':
      return 'receipt-long';
    case 'communication':
      return 'forum';
    case 'roles':
      return 'admin-panel-settings';
    case 'users':
      return 'group';
    default:
      return 'tune';
  }
}

function formatModuleTitle(module: string) {
  return module
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function AdminModulePermissionSwitches({
  permissions,
  selectedPermissions,
  onTogglePermission,
}: AdminModulePermissionSwitchesProps) {
  return (
    <View style={{ gap: spacing[3] }}>
      {Object.entries(permissions).map(([module, items]) => (
        <View key={module} style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4], gap: spacing[3] }}>
          <Text style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            {formatModuleTitle(module)}
          </Text>

          <View style={{ gap: spacing[3] }}>
            {items.map((permission) => {
              const active = Boolean(selectedPermissions[permission.key]);
              return (
                <Pressable
                  key={permission.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => onTogglePermission(permission.key, !active)}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3], paddingVertical: spacing[1] }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1, minWidth: 0 }}>
                    <View style={{ width: 36, height: 36, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcons name={permissionIcon(module)} size={18} color={colors.primary.DEFAULT} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ color: colors.text.primary, fontSize: 14, fontFamily: typography.fontFamily.bold }}>
                        {permission.name}
                      </Text>
                      <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 2, flexShrink: 1 }}>
                        {permission.key}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: 36, height: 20, borderRadius: 999, backgroundColor: active ? colors.primary.DEFAULT : colors.border.DEFAULT, padding: 2, justifyContent: 'center', flexShrink: 0 }}>
                    <View style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: colors.background.surface, alignSelf: active ? 'flex-end' : 'flex-start' }} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}
