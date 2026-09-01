import { Image, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import { Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';

function getDocumentIcon(title: string) {
  const normalized = String(title || '').trim().toLowerCase();

  if (normalized.includes('aadhaar')) {
    return 'badge';
  }
  if (normalized.includes('dakhlo')) {
    return 'description';
  }
  if (normalized.includes('school')) {
    return 'school';
  }
  if (normalized.includes('photo')) {
    return 'account-circle';
  }

  return 'description';
}

function getDocumentTitle(title: string, t: (key: string) => string) {
  const normalized = String(title || '').trim().toLowerCase();

  if (normalized.includes('aadhaar')) {
    return t('documents.types.aadhaar');
  }
  if (normalized.includes('jati') || normalized.includes('dakhlo') || normalized.includes('caste')) {
    return t('documents.types.casteCertificate');
  }
  if (normalized.includes('school')) {
    return t('documents.types.schoolCertificate');
  }
  if (normalized.includes('photo') || normalized.includes('selfie')) {
    return t('documents.types.profilePhoto');
  }

  return title || t('documents.types.document');
}

export function KycApprovalDocumentsCard({
  documents,
}: {
  documents: readonly {
    id: string;
    title: string;
    imageUrl?: string;
    status: 'uploaded' | 'uploading' | 'failed';
  }[];
}) {
  const t = useTranslations('registration.kyc-approval');

  return (
    <PhotoProvider>
      <View style={{ gap: spacing[4] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: colors.border.light, paddingBottom: spacing[3], gap: spacing[3] }}>
          <Text
            variant="h4"
            style={{
              flex: 1,
              minWidth: 0,
              fontFamily: typography.fontFamily.bold,
              color: colors.text.primary,
            }}>
            {t('documents.title')}
          </Text>
          <Text
            variant="caption"
            style={{
              flexShrink: 1,
              maxWidth: 128,
              color: colors.text.muted,
              textAlign: 'right',
            }}>
            {t('documents.helper')}
          </Text>
        </View>
        <View style={{ gap: spacing[4] }}>
          {documents.map((document) => {
            const localizedTitle = getDocumentTitle(document.title, t);

            return (
            <View key={document.id} style={{ borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], backgroundColor: colors.background.surface }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1, minWidth: 0 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.muted }}>
                    <MaterialIcons name={getDocumentIcon(document.title)} size={18} color={colors.primary.DEFAULT} />
                  </View>
                  <Text variant="body" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, flex: 1, minWidth: 0 }}>
                    {localizedTitle}
                  </Text>
                </View>
                {document.imageUrl ? (
                  <PhotoView src={document.imageUrl} triggers={['onClick']}>
                    <Pressable accessibilityRole="button" accessibilityLabel={t('documents.actions.enlarge').replace('{title}', localizedTitle)} hitSlop={10} style={{ padding: 2 }}>
                      <MaterialIcons name="open-in-full" size={18} color={colors.text.muted} />
                    </Pressable>
                  </PhotoView>
                ) : (
                  <MaterialIcons name="open-in-full" size={18} color={colors.text.muted} />
                )}
              </View>
              <View style={{ aspectRatio: 1.6, backgroundColor: colors.background.surfaceAlt }}>
                {document.imageUrl ? (
                  <Image source={{ uri: document.imageUrl }} resizeMode="cover" style={{ width: '100%', height: '100%', opacity: 0.8 }} />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[5], gap: spacing[2] }}>
                    <MaterialIcons name="insert-drive-file" size={32} color={colors.text.muted} />
                    <Text variant="body" style={{ textAlign: 'center', color: colors.text.primary, fontFamily: typography.fontFamily.bold }}>
                      {t('documents.empty.title')}
                    </Text>
                    <Text variant="caption" style={{ textAlign: 'center', color: colors.text.muted, lineHeight: 18 }}>
                      {t('documents.empty.description')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );})}
        </View>
      </View>
    </PhotoProvider>
  );
}
