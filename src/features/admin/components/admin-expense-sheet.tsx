import { useState } from 'react';

import { TouchableOpacity, View } from 'react-native';
import { Button, SelectField, Text, TextField } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

import { colors, radius, spacing, typography } from '@/src/theme';

export function AdminExpenseSheet() {
  const t = useTranslations('admin.manage-expenses');
  const paymentModes = [
    { key: 'upi', label: t('form.paymentMode.upi') },
    { key: 'cash', label: t('form.paymentMode.cash') },
    { key: 'bank', label: t('form.paymentMode.bank') },
  ] as const;
  const [selectedCategory, setSelectedCategory] = useState<'event' | 'travel' | 'food' | 'misc' | 'marketing' | 'catering' | 'venue'>('event');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'upi' | 'cash' | 'bank'>('upi');
  const [amount, setAmount] = useState('0.00');
  return (
    <View style={{ backgroundColor: colors.background.DEFAULT, width: '100%', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: spacing[4], gap: spacing[4] }}>
      <View style={{ width: 48, height: 4, borderRadius: 999, backgroundColor: colors.border.DEFAULT, alignSelf: 'center' }} />
      <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 20 }}>
        {t('title.create')}
      </Text>
      <View style={{ gap: spacing[4] }}>
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.semibold, fontSize: 13 }}>
            {t('form.category')}
          </Text>
          <SelectField
            variant="registration"
            labelVariant="default"
            value={selectedCategory}
            onSelect={setSelectedCategory}
            options={[
              { label: t('form.category.event'), value: 'event' },
              { label: t('form.category.travel'), value: 'travel' },
              { label: t('form.category.food'), value: 'food' },
              { label: t('form.category.misc'), value: 'misc' },
              { label: t('form.category.marketing'), value: 'marketing' },
              { label: t('form.category.catering'), value: 'catering' },
              { label: t('form.category.venue'), value: 'venue' },
            ]}
            placeholder={t('form.category.placeholder')}
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.semibold, fontSize: 13 }}>
            {t('form.amount')}
          </Text>
          <TextField
            variant="registration"
            labelVariant="default"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder={t('form.amount.placeholder')}
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.semibold, fontSize: 13 }}>
            {t('form.paymentMode')}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            {paymentModes.map((mode) => {
              const active = mode.key === selectedPaymentMode;
              return (
                <TouchableOpacity
                  key={mode.key}
                  accessibilityRole="button"
                  activeOpacity={0.85}
                  onPress={() => setSelectedPaymentMode(mode.key)}
                  style={{
                    flex: 1,
                    paddingVertical: spacing[3],
                    borderRadius: radius.lg,
                    borderWidth: 1,
                    borderColor: active ? colors.primary.DEFAULT : colors.primary.borderLight,
                    backgroundColor: active ? colors.primary.muted : colors.background.surface,
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: active ? colors.primary.DEFAULT : colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                    {mode.label}
                </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
      <Button fullWidth>
        {t('actions.save')}
      </Button>
    </View>
  );
}
