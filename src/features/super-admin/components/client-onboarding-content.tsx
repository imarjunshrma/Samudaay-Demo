import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { Button, Card, FormScreenLayout, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, spacing, typography } from '@/src/theme';

import { SurfaceInput } from './surface-input';

import { OnboardingStepTitle } from './onboarding-step-title';

import { OnboardingSidebar } from './onboarding-sidebar';

export function ClientOnboardingContent() {
  const t = useTranslations('super-admin.client-onboarding');
  return (
    <FormScreenLayout
      footer={
        <View style={{ flex: 1, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: 'rgba(212,195,190,0.3)', justifyContent: 'center' }}>
          <View style={{ maxWidth: 1280, alignSelf: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
              <MaterialIcons name="close" size={16} color="#6b7280" />
              <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                {t('actions.discard')}
              </Text>
            </TouchableOpacity>
            <Button rightIcon={<MaterialIcons name="rocket-launch" size={18} color="#ffffff" />}>
              {t('actions.launch')}
            </Button>
          </View>
        </View>
      }>
      <View style={{ maxWidth: 1280, alignSelf: 'center', width: '100%', paddingBottom: spacing[5] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[6], paddingVertical: spacing[4], borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
              <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
              </TouchableOpacity>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                {t('title')}
              </Text>
            </View>
            <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff7ed' }}>
              <MaterialIcons name="help-outline" size={20} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <OnboardingSidebar />
            <View style={{ flex: 1, paddingHorizontal: spacing[6], paddingVertical: spacing[8] }}>
              <View style={{ marginBottom: spacing[10], gap: spacing[4] }}>
                <OnboardingStepTitle step={t('steps.step1.step')} title={t('steps.step1.title')} subtitle={t('steps.step1.subtitle')} />
              </View>

              <View style={{ gap: spacing[8] }}>
                <View>
                  <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, marginBottom: spacing[4] }}>
                    {t('sections.organization.title')}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
                    <SurfaceInput label={t('fields.organizationName')} placeholder={t('placeholders.organizationName')} />
                    <SurfaceInput label={t('fields.internalDomain')} placeholder={t('placeholders.internalDomain')} suffix=".artisan.studio" />
                    <SurfaceInput label={t('fields.contactName')} placeholder={t('placeholders.contactName')} />
                    <SurfaceInput label={t('fields.adminEmail')} placeholder={t('placeholders.adminEmail')} />
                  </View>
                </View>

                <Card variant="muted" padding="lg">
                  <View style={{ gap: spacing[4] }}>
                    <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                      {t('sections.license.title')}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] }}>
                      <SurfaceInput label={t('fields.licenseType')} placeholder={t('placeholders.licenseType')} />
                      <SurfaceInput label={t('fields.maxUsers')} placeholder={t('placeholders.maxUsers')} />
                    </View>
                  </View>
                </Card>

                <View>
                  <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, marginBottom: spacing[4] }}>
                    {t('sections.features.title')}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(242,120,13,0.08)', backgroundColor: '#ffffff', padding: spacing[5] }}>
                    <View style={{ flex: 1, paddingRight: spacing[4] }}>
                      <Text variant="body" style={{ fontFamily: typography.fontFamily.bold, color: colors.primary.DEFAULT }}>
                        {t('fields.allowSubCommunities')}
                      </Text>
                      <Text variant="caption" color={colors.text.muted}>
                        {t('fields.allowSubCommunitiesHelp')}
                      </Text>
                    </View>
                    <View style={{ width: 56, height: 28, borderRadius: 999, backgroundColor: '#e5e2df', padding: 4 }}>
                      <View style={{ width: 20, height: 20, borderRadius: 999, backgroundColor: '#ffffff' }} />
                    </View>
                  </View>
                </View>

                <View>
                  <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, marginBottom: spacing[4] }}>
                    {t('sections.brand.title')}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[6] }}>
                    <View style={{ width: '48%', gap: spacing[4] }}>
                      <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {t('fields.logo')}
                      </Text>
                      <View style={{ aspectRatio: 16 / 9, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(212,195,190,0.4)', backgroundColor: '#ebe7e4', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name="upload-file" size={32} color="#46291e" />
                        <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, marginTop: spacing[2] }}>
                          {t('fields.logoUpload')}
                        </Text>
                        <Text variant="caption" color={colors.text.muted}>
                          {t('fields.logoHelp')}
                        </Text>
                      </View>
                    </View>
                    <View style={{ width: '48%', gap: spacing[4] }}>
                      <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {t('fields.palette')}
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
                        {[t('palette.artisanBrown'), t('palette.flameTan'), t('palette.ironPatina'), t('palette.workshopHoney')].map((item, index) => (
                          <TouchableOpacity key={item} accessibilityRole="button" activeOpacity={0.85} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderRadius: 16, borderWidth: 1, borderColor: index === 0 ? colors.primary.DEFAULT : 'transparent', backgroundColor: '#ffffff', padding: spacing[3] }}>
                            <View style={{ width: 32, height: 32, borderRadius: 999, backgroundColor: ['#46291e', '#964900', '#003733', '#ff8928'][index] }} />
                            <Text variant="caption" style={{ fontFamily: typography.fontFamily.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

            </View>
          </View>
        </View>
    </FormScreenLayout>
  );
}
