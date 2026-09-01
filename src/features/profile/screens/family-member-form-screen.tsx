import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';

import { AppFormSkeleton, AppHeader, FormScreenLayout, Text } from '@/src/components';
import { Button } from '@/src/components/ui';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing } from '@/src/theme';
import { profileService } from '@/src/features/profile/services/profile-service';
import type { FamilyListMember } from '../data/family';
import { FamilyMemberFormContent } from '../components/family-member-form-content';

export interface FamilyMemberFormScreenProps {
  mode: 'add' | 'edit';
  memberId?: string;
}

export function FamilyMemberFormScreen({ mode, memberId }: FamilyMemberFormScreenProps) {
  const { safeBack } = useSafeNavigation();
  const t = useTranslations('profile.family-member-form');
  const [member, setMember] = useState<FamilyListMember | null | undefined>(mode === 'add' ? null : undefined);
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (mode === 'add') {
        setFormInstanceKey((current) => current + 1);
      }

      return undefined;
    }, [mode]),
  );

  useEffect(() => {
    let active = true;

    if (mode === 'add') {
      setMember(null);
      return () => {
        active = false;
      };
    }

    async function load() {
      if (!memberId) {
        if (active) {
          setMember(null);
        }
        return;
      }

      const found = await profileService.loadFamilyMember(memberId);
      if (active) {
        setMember(found);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [memberId, mode]);

  if (mode === 'edit' && member === undefined) {
    return (
      <FormScreenLayout
        header={<AppHeader variant="back-inline" title={t('title.edit')} titleVariant="h5" contentMaxWidth={448} onLeftPress={() => safeBack('/profile/family-management')} rightSlot={<View style={{ width: 40, height: 40 }} />} />}
        footer={(
          <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
            <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center' }}>
              <AppFormSkeleton fields={0} />
            </View>
          </View>
        )}>
        <View style={{ backgroundColor: colors.background.DEFAULT }}>
          <View style={{ maxWidth: 448, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[5], paddingBottom: spacing[5] }}>
            <AppFormSkeleton fields={8} showFooter={false} />
          </View>
        </View>
      </FormScreenLayout>
    );
  }

  if (mode === 'edit' && member === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background.DEFAULT, gap: spacing[3], padding: spacing[4] }}>
        <Text variant="body">{t('notFound')}</Text>
        <Button onPress={() => safeBack('/profile/family-management')}>{t('back')}</Button>
      </View>
    );
  }

  return <FamilyMemberFormContent key={`${mode}-${formInstanceKey}-${memberId ?? 'new'}`} mode={mode} member={member ?? undefined} />;
}

export default FamilyMemberFormScreen;
