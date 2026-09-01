import { useField } from 'formik';
import { Pressable, View } from 'react-native';

import { Icon, Text } from '@/src/components/ui';
import { colors, radius, spacing, typography } from '@/src/theme';

type CheckboxProps = {
  name?: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

function CheckboxBody({ label, description, checked = false, onChange, disabled }: CheckboxProps & { onChange: (checked: boolean) => void }) {

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3], opacity: disabled ? 0.6 : 1 }}>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: radius.sm,
          borderWidth: 1,
          borderColor: checked ? colors.primary.DEFAULT : colors.border.DEFAULT,
          backgroundColor: checked ? colors.primary.DEFAULT : colors.background.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {checked ? <Icon name="check" size={14} color={colors.text.inverse} /> : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: typography.fontFamily.medium }}>{label}</Text>
        {description ? <Text variant="caption" color="#64748b">{description}</Text> : null}
      </View>
    </Pressable>
  );
}

function FormikCheckbox(props: CheckboxProps & { name: string }) {
  const [field, , helpers] = useField<boolean>(props.name);

  return (
    <CheckboxBody
      {...props}
      checked={Boolean(field.value)}
      onChange={(nextValue) => helpers.setValue(nextValue)}
    />
  );
}

export function Checkbox(props: CheckboxProps) {
  if (props.name) {
    return <FormikCheckbox {...(props as CheckboxProps & { name: string })} />;
  }

  return <CheckboxBody {...props} checked={Boolean(props.checked)} onChange={props.onChange ?? (() => undefined)} />;
}
