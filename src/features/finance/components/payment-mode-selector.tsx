import { Pressable, View } from 'react-native';
import { useField } from 'formik';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';

type PaymentMode = 'cash' | 'transfer' | 'cheque';

const paymentModes: {
  key: PaymentMode;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
}[] = [
  { key: 'cash', icon: 'payments' },
  { key: 'transfer', icon: 'account-balance' },
  { key: 'cheque', icon: 'receipt-long' },
];

export function PaymentModeSelector({
  value,
  onChange,
}: {
  value: PaymentMode;
  onChange: (value: PaymentMode) => void;
}) {
  const t = useTranslations('finance.donation-management');

  return (
    <View style={{ flexDirection: 'row', gap: spacing[3] }}>
      {paymentModes.map((mode) => {
        const active = value === mode.key;
        return (
          <Pressable
            key={mode.key}
            accessibilityRole="button"
            onPress={() => onChange(mode.key)}
            style={{
              flex: 1,
              alignItems: 'center',
              gap: spacing[2],
              borderRadius: 22,
              paddingVertical: spacing[4],
              borderWidth: 1,
              borderColor: active ? colors.primary.border : colors.primary.borderLight,
              backgroundColor: active ? colors.primary.muted : colors.background.surface,
            }}>
            <MaterialIcons name={mode.icon} size={22} color={active ? colors.primary.DEFAULT : '#64748b'} />
            <Text variant="caption" color={active ? colors.primary.DEFAULT : colors.text.secondary} style={{ fontFamily: typography.fontFamily.bold }}>
              {t(`manual.paymentMode.${mode.key}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function FormikPaymentModeSelector({
  name,
  ...props
}: {
  name: string;
  value?: PaymentMode;
  onChange?: (value: PaymentMode) => void;
}) {
  const [field, , helpers] = useField<PaymentMode>(name);

  return (
    <PaymentModeSelector
      value={(props.value || field.value || 'cash') as PaymentMode}
      onChange={(value) => {
        helpers.setValue(value);
        props.onChange?.(value);
      }}
    />
  );
}
