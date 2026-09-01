import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { AppHeader, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

const superAdminActions = [
  {
    key: 'create-client',
    title: 'Create New Client Organization',
    description: 'Onboard a new trust, set the primary admin, and launch a fresh tenant.',
    icon: 'domain-add',
    href: '/super-admin/create-new-client-organization',
  },
  {
    key: 'client-management',
    title: 'Client Management',
    description: 'Review active communities, trial accounts, and client health.',
    icon: 'groups',
    href: '/super-admin/client-management',
  },
  {
    key: 'client-configuration',
    title: 'Client Configuration',
    description: 'Adjust branding, modules, billing, and access settings for a client.',
    icon: 'settings-applications',
    href: '/super-admin/client-configuration',
  },
  {
    key: 'create-admin',
    title: 'Create Admin',
    description: 'Invite a new admin and route them into the proper workspace.',
    icon: 'person-add-alt-1',
    href: '/super-admin/create-admin',
  },
  {
    key: 'assign-role',
    title: 'Assign User Role',
    description: 'Grant scoped access for a member, community support, or trustee.',
    icon: 'admin-panel-settings',
    href: '/super-admin/assign-user-role',
  },
] as const;

const superAdminActionLabels = {
  'create-client': {
    title: 'action.createClient',
    description: 'action.createClient.description',
  },
  'client-management': {
    title: 'action.clientManagement',
    description: 'action.clientManagement.description',
  },
  'client-configuration': {
    title: 'action.clientConfiguration',
    description: 'action.clientConfiguration.description',
  },
  'create-admin': {
    title: 'action.createAdmin',
    description: 'action.createAdmin.description',
  },
  'assign-role': {
    title: 'action.assignRole',
    description: 'action.assignRole.description',
  },
} as const;

function SuperAdminActionCard({
  title,
  description,
  icon,
  onPress,
}: {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.88}
      onPress={onPress}
      style={{
        borderRadius: 28,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.border.muted,
        padding: spacing[5],
        ...shadows.sm,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.xl,
            backgroundColor: colors.primary.subtle,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name={icon} size={24} color={colors.primary.DEFAULT} />
        </View>

        <View style={{ flex: 1, gap: spacing[1] }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
            {title}
          </Text>
          <Text variant="caption" color={colors.text.muted}>
            {description}
          </Text>
        </View>

        <MaterialIcons name="chevron-right" size={22} color={colors.text.muted} />
      </View>
    </TouchableOpacity>
  );
}

export function SuperAdminHomeContent() {
  const router = useRouter();
  const t = useTranslations('super-admin.home');

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AppHeader
        variant="brand"
        title={t('title')}
        subtitle={t('subtitle')}
        leftSlot={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.full,
                backgroundColor: colors.primary.subtle,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons name="admin-panel-settings" size={22} color={colors.primary.DEFAULT} />
            </View>
            <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
              Control Center
            </Text>
          </View>
        }
        rightSlot={
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.full,
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.border.muted,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcons name="shield" size={20} color={colors.primary.DEFAULT} />
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[8], gap: spacing[5] }}>
        <View
          style={{
            borderRadius: 32,
            backgroundColor: colors.background.surface,
            borderWidth: 1,
            borderColor: colors.border.muted,
            padding: spacing[5],
            gap: spacing[4],
            ...shadows.sm,
          }}>
          <View style={{ gap: spacing[2] }}>
            <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1.4 }}>
              {t('section.flow')}
            </Text>
            <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
              {t('hero.title')}
            </Text>
            <Text variant="body" color={colors.text.muted}>
              {t('hero.description')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: spacing[3],
              flexWrap: 'wrap',
            }}>
            <View style={{ flex: 1, minWidth: 140, borderRadius: 24, backgroundColor: colors.primary.subtle, padding: spacing[4] }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.bold }}>
                {t('hero.entryPoint')}
              </Text>
              <Text variant="h5" style={{ marginTop: spacing[1], fontFamily: typography.fontFamily.bold }}>
                /super-admin
              </Text>
            </View>

            <View style={{ flex: 1, minWidth: 140, borderRadius: 24, backgroundColor: colors.background.DEFAULT, borderWidth: 1, borderColor: colors.border.muted, padding: spacing[4] }}>
              <Text variant="caption" color={colors.text.muted} style={{ textTransform: 'uppercase', letterSpacing: 1, fontFamily: typography.fontFamily.bold }}>
                {t('hero.routes')}
              </Text>
              <Text variant="h5" style={{ marginTop: spacing[1], fontFamily: typography.fontFamily.bold }}>
                {t('hero.actionsCount')}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ gap: spacing[3] }}>
          {superAdminActions.map((action) => (
            <SuperAdminActionCard
              key={action.key}
              title={t(superAdminActionLabels[action.key].title)}
              description={t(superAdminActionLabels[action.key].description)}
              icon={action.icon}
              onPress={() => router.push(action.href as never)}
            />
          ))}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}
