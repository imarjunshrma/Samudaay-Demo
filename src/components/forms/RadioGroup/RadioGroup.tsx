import { useField } from 'formik';
import { Pressable, View } from 'react-native';

import { Text } from '@/src/components/ui';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { SelectOption } from '@/src/types';

type RadioGroupProps = {
  name?: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
};

function RadioGroupBody({ label, options, value, onChange, orientation = 'vertical' }: RadioGroupProps & { onChange: (value: string) => void }) {

  return (
    <View style={{ gap: spacing[2] }}>
      {label ? (
        <Text
          variant="caption"
          color="#6b7280"
          style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </Text>
      ) : null}
      <View style={{ gap: spacing[2], flexDirection: orientation === 'horizontal' ? 'row' : 'column', flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap' }}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <Pressable key={option.value} onPress={() => onChange(option.value)} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: active ? colors.primary.DEFAULT : colors.border.DEFAULT,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {active ? <View style={{ width: 10, height: 10, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT }} /> : null}
            </View>
            <Text>{option.label}</Text>
          </Pressable>
        );
      })}
      </View>
    </View>
  );
}

function FormikRadioGroup(props: RadioGroupProps & { name: string }) {
  const [field, , helpers] = useField<string>(props.name);

  return <RadioGroupBody {...props} value={field.value} onChange={(nextValue) => helpers.setValue(nextValue)} />;
}

export function RadioGroup(props: RadioGroupProps) {
  if (props.name) {
    return <FormikRadioGroup {...(props as RadioGroupProps & { name: string })} />;
  }

  return <RadioGroupBody {...props} value={props.value} onChange={props.onChange ?? (() => undefined)} />;
}
