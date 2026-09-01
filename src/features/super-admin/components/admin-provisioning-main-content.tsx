import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, FormScreenLayout, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, spacing, typography } from '@/src/theme';

import { RoleOption } from './role-option';

import { PermissionRow } from './permission-row';

import { MemberCard } from './member-card';

export function AdminProvisioningContent() {
  const t = useTranslations('super-admin.admin-provisioning');
  return (
    <FormScreenLayout
      footer={
        <View style={{ flex: 1, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: 'rgba(212,195,190,0.3)', justifyContent: 'center' }}>
          <View style={{ maxWidth: 672, alignSelf: 'center', width: '100%', flexDirection: 'row', gap: spacing[3] }}>
            <Button variant="outline" fullWidth>
              {t('actions.cancel')}
            </Button>
            <Button fullWidth>{t('actions.create')}</Button>
          </View>
        </View>
      }>
      <View style={{ maxWidth: 672, alignSelf: 'center', width: '100%', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[8] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ width: 48, height: 48, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
              {t('title')}
            </Text>
            <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="info-outline" size={22} color={colors.primary.DEFAULT} />
            </View>
          </View>

          <MemberCard />

          <View style={{ gap: spacing[6] }}>
            <View style={{ gap: spacing[4] }}>
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                {t('sections.role.title')}
              </Text>
              <View style={{ gap: spacing[3] }}>
                <RoleOption icon="verified-user" title={t('roles.trustee.title')} description={t('roles.trustee.description')} selected />
                <RoleOption icon="person" title={t('roles.member.title')} description={t('roles.member.description')} />
                <RoleOption icon="help-center" title={t('roles.support.title')} description={t('roles.support.description')} />
              </View>
            </View>

            <View style={{ gap: spacing[4] }}>
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                {t('sections.permissions.title')}
              </Text>
              <View style={{ gap: spacing[3] }}>
                <PermissionRow title={t('permissions.memberManagement.title')} description={t('permissions.memberManagement.description')} />
                <PermissionRow title={t('permissions.contentModeration.title')} description={t('permissions.contentModeration.description')} />
                <PermissionRow title={t('permissions.financialReporting.title')} description={t('permissions.financialReporting.description')} />
              </View>
            </View>

            <Text variant="caption" color={colors.text.muted} style={{ textAlign: 'center' }}>
              {t('note')}
            </Text>
          </View>
        </View>
    </FormScreenLayout>
  );
}
