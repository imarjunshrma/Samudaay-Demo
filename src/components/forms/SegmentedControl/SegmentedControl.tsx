import { useField } from 'formik';
import { Pressable, View } from 'react-native';

import { Text } from '@/src/components/ui';
import { colors, radius, spacing } from '@/src/theme';
import type { SelectOption } from '@/src/types';

type SegmentedControlProps = {
  name?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'soft' | 'pill';
  containerRadius?: number;
  segmentRadius?: number;
};

function SegmentedControlBody({
  options,
  value,
  onChange,
  variant = 'soft',
  containerRadius = radius.lg,
  segmentRadius = radius.md,
}: SegmentedControlProps & { onChange: (value: string) => void }) {

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: variant === 'pill' ? colors.background.surface : '#f1f5f9',
        borderRadius: containerRadius,
        padding: spacing[1],
        borderWidth: variant === 'pill' ? 1 : 0,
        borderColor: variant === 'pill' ? colors.primary.borderLight : 'transparent',
      }}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={{
                flex: 1,
                alignItems: 'center',
                borderRadius: segmentRadius,
                backgroundColor: active ? colors.background.surface : 'transparent',
                paddingVertical: spacing[2],
              }}>
            <Text variant="body" color={active ? colors.primary.DEFAULT : colors.text.muted}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function FormikSegmentedControl(props: SegmentedControlProps & { name: string }) {
  const [field, , helpers] = useField<string>(props.name);

  return <SegmentedControlBody {...props} value={field.value} onChange={(nextValue) => helpers.setValue(nextValue)} />;
}

export function SegmentedControl(props: SegmentedControlProps) {
  if (props.name) {
    return <FormikSegmentedControl {...(props as SegmentedControlProps & { name: string })} />;
  }

  return <SegmentedControlBody {...props} value={props.value} onChange={props.onChange ?? (() => undefined)} />;
}
