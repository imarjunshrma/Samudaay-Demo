import { TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { TextField } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, spacing, typography } from '@/src/theme';

export function AdminCreateAddOnCard({
  title,
  price,
  limit,
  titleError,
  priceError,
  limitError,
  onTitleChange,
  onPriceChange,
  onLimitChange,
  onDelete,
}: {
  title: string;
  price: string;
  limit: string;
  titleError?: string;
  priceError?: string;
  limitError?: string;
  onTitleChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onDelete: () => void;
}) {
  const t = useTranslations('admin.manage-events');
  return (
    <View style={{ gap: spacing[3], borderRadius: 20, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: colors.primary.subtle, padding: spacing[4] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
        <View style={{ flex: 1 }}>
          <TextField
            value={title}
            onChangeText={onTitleChange}
            placeholder={t('form.addOn.name')}
            variant="compact"
            error={titleError}
            inputStyle={{
              minHeight: 0,
              borderWidth: 0,
              backgroundColor: 'transparent',
              paddingLeft: 0,
              paddingRight: 0,
              paddingHorizontal: 0,
              paddingVertical: 0,
              fontFamily: typography.fontFamily.bold,
              fontSize: 16,
              lineHeight: 20,
              color: colors.text.primary,
            }}
          />
        </View>
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onDelete} style={{ width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="delete" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[3] }}>
        <View style={{ flex: 1 }}>
          <TextField label={t('form.addOn.price')} labelVariant="default" value={price} onChangeText={onPriceChange} variant="compact" keyboardType="decimal-pad" error={priceError} />
        </View>
        <View style={{ flex: 1 }}>
          <TextField label={t('form.addOn.limit')} labelVariant="default" value={limit} onChangeText={onLimitChange} variant="compact" keyboardType="number-pad" error={limitError} />
        </View>
      </View>
    </View>
  );
}
