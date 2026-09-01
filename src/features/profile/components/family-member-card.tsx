import { Image, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button, EntityActionCard } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius } from '@/src/theme';

type FamilyMemberCardProps = {
  name: string;
  relation: string;
  age?: string;
  detail: string;
  image: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onUploadMarksheet?: () => void;
};

export function FamilyMemberCard({ name, relation, age, detail, image, onEdit, onDelete, onUploadMarksheet }: FamilyMemberCardProps) {
  const t = useTranslations('profile.family-management');
  const childLikeRelations = new Set(['child', 'son', 'daughter', 'daughter_in_law', 'daughter in law', 'daughter-in-law', 'grand_son', 'grand son', 'grand-son', 'grand_daughter', 'grand daughter', 'grand-daughter']);
  const isChild = childLikeRelations.has(relation.trim().toLowerCase());

  return (
    <EntityActionCard
      leading={
        image
          ? <Image source={{ uri: image }} resizeMode="cover" style={{ width: 56, height: 56, borderRadius: radius.lg }} />
          : <View style={{ width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.primary.muted, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="person" size={24} color={colors.primary.DEFAULT} />
          </View>
      }
      title={name}
      subtitle={[relation, age].filter(Boolean).join(' • ')}
      detail={detail}
      headerRight={
        isChild && onUploadMarksheet ? (
          <Button
            size="sm"
            variant="soft"
            rounded
            leftIcon={<MaterialIcons name="school" size={16} color={colors.primary.DEFAULT} />}
            onPress={onUploadMarksheet}>
            {t('actions.uploadMarksheet')}
          </Button>
        ) : null
      }
      actions={[
        {
          key: 'edit',
          label: t('actions.edit'),
          leftIcon: <MaterialIcons name="edit" size={18} color={colors.text.primary} />,
          variant: 'outline',
          onPress: onEdit,
        },
        {
          key: 'delete',
          label: t('actions.delete'),
          leftIcon: <MaterialIcons name="delete" size={18} color="#ef4444" />,
          variant: 'soft',
          onPress: onDelete,
        },
      ]}
    />
  );
}
