import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader, Button, DateField, FormScreenLayout, SelectField, Text, TextField } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

export function AdvertisementFormScreen() {
  const navigateBack = useBackNavigation();
  const t = useTranslations('advertisements.form');
  const [contentType, setContentType] = useState<'text' | 'image' | 'video'>('text');
  const [planType, setPlanType] = useState<'free' | 'premium'>('premium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [price, setPrice] = useState('499');
  const [advertisementType, setAdvertisementType] = useState<'banner' | 'popup' | 'video' | 'sponsored_post'>('banner');

  return (
    <FormScreenLayout
      header={
        <AppHeader
          title={t('title')}
          variant="back-inline"
          onLeftPress={navigateBack}
          rightSlot={
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.full,
              }}>
              <MaterialIcons name="campaign" size={22} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          }
        />
      }
      footer={
        <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
            <Button
              fullWidth
              leftIcon={<MaterialIcons name="publish" size={18} color={colors.text.inverse} />}
              onPress={() => undefined}>
              Publish Advertisement
            </Button>
          </View>
        </View>
      }>
      <View style={{ backgroundColor: colors.background.DEFAULT }}>
        <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[6] }}>
            <View style={{ gap: spacing[2] }}>
              <Text variant="h2" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                {t('hero.title')}
              </Text>
              <Text variant="body" style={{ color: colors.text.secondary }}>
                {t('hero.subtitle')}
              </Text>
            </View>

            <View style={{ gap: spacing[4] }}>
              <TextField
                label={t('fields.title')}
                labelVariant="default"
                placeholder={t('placeholders.title')}
                value={title}
                onChangeText={setTitle}
                variant="registration"
              />

              <SelectField
                label={t('fields.type')}
                labelVariant="default"
                placeholder={t('placeholders.type')}
                value={advertisementType}
                onSelect={setAdvertisementType}
                options={[
                  { label: t('options.type.banner'), value: 'banner' },
                  { label: t('options.type.popup'), value: 'popup' },
                  { label: t('options.type.video'), value: 'video' },
                  { label: t('options.type.sponsoredPost'), value: 'sponsored_post' },
                ]}
                variant="registration"
              />

              <TextField
                label={t('fields.description')}
                labelVariant="default"
                placeholder={t('placeholders.description')}
                value={description}
                onChangeText={setDescription}
                variant="registration"
                multiline
                numberOfLines={4}
              />

              <View style={{ gap: spacing[2] }}>
                <Text variant="caption" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                  {t('fields.contentType')}
                </Text>
                <View style={{ gap: spacing[3], flexDirection: 'row', flexWrap: 'wrap' }}>
                  {[
                    { key: 'text', label: t('options.contentType.text'), icon: 'article' as const },
                    { key: 'image', label: t('options.contentType.image'), icon: 'image' as const },
                    { key: 'video', label: t('options.contentType.video'), icon: 'videocam' as const },
                  ].map((item) => {
                    const active = contentType === item.key;

                    return (
                      <TouchableOpacity
                        key={item.key}
                        accessibilityRole="button"
                        activeOpacity={0.85}
                        onPress={() => setContentType(item.key as typeof contentType)}
                        style={{
                          width: '31%',
                          minWidth: 96,
                          flexGrow: 1,
                          flexBasis: '31%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: spacing[2],
                          padding: spacing[3],
                          borderRadius: radius.xl,
                          borderWidth: 1,
                          borderColor: active ? colors.primary.DEFAULT : colors.primary.borderLight,
                          backgroundColor: active ? colors.primary.subtle : colors.background.surface,
                        }}>
                        <MaterialIcons name={item.icon} size={18} color={colors.primary.DEFAULT} />
                        <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.medium }}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={{ gap: spacing[2] }}>
                <Text variant="caption" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                    {t('fields.media')}
                </Text>
                <View style={{ position: 'relative' }}>
                  <TextField
                    label=""
                    placeholder={t('placeholders.media')}
                    value={mediaUrl}
                    onChangeText={setMediaUrl}
                    variant="registration"
                    inputStyle={{ paddingRight: spacing[10] }}
                  />
                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    style={{ position: 'absolute', right: spacing[3], top: 13, padding: spacing[1], borderRadius: radius.lg }}>
                    <MaterialIcons name="upload-file" size={20} color={colors.primary.DEFAULT} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                <View style={{ flex: 1 }}>
                  <DateField
                    label={t('fields.startDate')}
                    labelVariant="default"
                    placeholder={t('placeholders.date')}
                    value={startDate}
                    onChange={setStartDate}
                    variant="registration"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <DateField
                    label={t('fields.endDate')}
                    labelVariant="default"
                    placeholder={t('placeholders.date')}
                    value={endDate}
                    onChange={setEndDate}
                    variant="registration"
                  />
                </View>
              </View>

              <View style={{ gap: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: colors.primary.subtle, padding: spacing[4] }}>
                <View style={{ gap: spacing[3] }}>
                  <Text variant="caption" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {t('fields.planType')}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: spacing[4], flexWrap: 'wrap' }}>
                    {[
                      { key: 'free', label: t('options.planType.free') },
                      { key: 'premium', label: t('options.planType.premium') },
                    ].map((item) => {
                      const active = planType === item.key;

                      return (
                        <TouchableOpacity
                          key={item.key}
                          accessibilityRole="button"
                          activeOpacity={0.85}
                          onPress={() => setPlanType(item.key as typeof planType)}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 999,
                              borderWidth: 2,
                              borderColor: active ? colors.primary.DEFAULT : 'rgba(242,91,19,0.25)',
                              backgroundColor: colors.background.surface,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            {active ? (
                              <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: colors.primary.DEFAULT }} />
                            ) : null}
                          </View>
                          <Text variant="body" style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.medium }}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={{ gap: spacing[2] }}>
                  <Text variant="caption" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                    {t('fields.price')}
                  </Text>
                  <View style={{ position: 'relative' }}>
                    <Text
                      variant="body"
                      style={{
                        position: 'absolute',
                        left: spacing[4],
                        top: 14,
                        color: colors.primary.DEFAULT,
                        fontFamily: typography.fontFamily.bold,
                        zIndex: 1,
                      }}>
                      ₹
                    </Text>
                      <TextField
                      label=""
                      placeholder={t('placeholders.price')}
                      value={price}
                      onChangeText={setPrice}
                      variant="registration"
                      keyboardType="numeric"
                      inputStyle={{ paddingLeft: spacing[8], fontFamily: typography.fontFamily.bold }}
                    />
                  </View>
                  <Text variant="caption" style={{ color: colors.text.muted, fontSize: 12 }}>
                    {t('notes.premium')}
                  </Text>
                </View>
              </View>

              <Text variant="caption" style={{ textAlign: 'center', color: colors.text.muted }}>
                Advertisement will be reviewed before publication.
              </Text>
            </View>
          </View>
      </View>
    </FormScreenLayout>
  );
}

export default AdvertisementFormScreen;
