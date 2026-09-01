import { memo, useCallback, useMemo, useState } from 'react';
import { useField } from 'formik';
import { Keyboard, Pressable, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { Icon, Text } from '@/src/components/ui';
import { colors, radius, spacing, typography } from '@/src/theme';
import type { SelectOption } from '@/src/types';

type SelectFieldProps<TValue extends string = string> = {
  name?: string;
  label?: string;
  value?: TValue;
  onSelect?: (value: TValue) => void;
  options: SelectOption<TValue>[];
  variant?: 'default' | 'pill' | 'dropdown' | 'registration';
  error?: string;
  hint?: string;
  labelVariant?: 'uppercase' | 'default';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  dropdownMode?: 'default' | 'modal' | 'auto';
  dropdownPosition?: 'auto' | 'top' | 'bottom';
};

type SelectFieldBodyProps<TValue extends string = string> = SelectFieldProps<TValue> & {
  value?: TValue;
  onSelect: (value: TValue) => void;
};

type DropdownItemProps = {
  label: string;
  active: boolean;
};

const DROPDOWN_MAX_HEIGHT = 280;
const DROPDOWN_ITEM_HEIGHT = 48;

const DropdownItem = memo(function DropdownItem({ label, active }: DropdownItemProps) {
  return (
    <View
      style={{
        height: DROPDOWN_ITEM_HEIGHT,
        justifyContent: 'center',
        paddingHorizontal: spacing[3],
        backgroundColor: active ? colors.primary.subtle : colors.background.surface,
      }}>
      <Text variant="body" color={active ? colors.primary.DEFAULT : colors.text.primary}>
        {label}
      </Text>
    </View>
  );
});

function SelectFieldBody<TValue extends string>({
  label,
  options,
  value,
  onSelect,
  variant = 'default',
  error,
  hint,
  labelVariant = 'uppercase',
  placeholder,
  disabled = false,
  required = false,
  dropdownMode = 'default',
  dropdownPosition = 'auto',
}: SelectFieldBodyProps<TValue>) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const isDropdown = variant === 'dropdown' || variant === 'registration';
  const dropdownData = useMemo(
    () =>
      options.map((option) => ({
        label: option.label,
        value: option.value,
        disabled: option.disabled,
      })),
    [options],
  );
  const dropdownKey = useMemo(
    () => `${String(value ?? '')}:${dropdownData.map((item) => `${String(item.value)}=${item.label}`).join('|')}`,
    [dropdownData, value],
  );
  const handleFocus = useCallback(() => {
    Keyboard.dismiss();
    setOpen(true);
  }, []);
  const handleBlur = useCallback(() => setOpen(false), []);
  const handleChange = useCallback((item: { value: TValue }) => {
    onSelect(item.value);
    setOpen(false);
  }, [onSelect]);
  const renderDropdownItem = useCallback(
    (item: { label: string; value: TValue }) => <DropdownItem label={item.label} active={item.value === value} />,
    [value],
  );
  const dropdownFlatListProps = useMemo(
    () => ({
      getItemLayout: (_data: ArrayLike<{ value: TValue }> | null | undefined, index: number) => ({
        length: DROPDOWN_ITEM_HEIGHT,
        offset: DROPDOWN_ITEM_HEIGHT * index,
        index,
      }),
      removeClippedSubviews: false,
    }),
    [],
  );

  if (isDropdown) {
    return (
      <View style={{ gap: spacing[2] }}>
        {label ? (
          <Text
            variant="caption"
            color={error ? colors.status.error : colors.text.primary}
            style={{
              fontFamily: typography.fontFamily.semibold,
              fontSize: 14,
              letterSpacing: labelVariant === 'uppercase' ? 0.8 : 0,
              textTransform: labelVariant === 'uppercase' ? 'uppercase' : 'none',
            }}>
            {`${label}${required ? ' *' : ''}`}
          </Text>
        ) : null}
        <Dropdown
          key={dropdownKey}
          data={dropdownData}
          value={value}
          labelField="label"
          valueField="value"
          placeholder={placeholder ?? hint ?? 'Select an option'}
          disable={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          style={{
            minHeight: variant === 'registration' ? 48 : 52,
            borderRadius: variant === 'registration' ? radius.lg : radius.xl,
            borderWidth: 1,
            borderColor: error ? colors.status.error : open ? colors.primary.border : colors.primary.borderLight,
            backgroundColor: colors.background.surface,
            paddingHorizontal: spacing[3],
            opacity: disabled ? 0.65 : 1,
          }}
          placeholderStyle={{
            color: '#94a3b8',
            fontSize: 15,
          }}
          selectedTextStyle={{
            color: selected ? colors.text.primary : '#94a3b8',
            fontSize: 15,
          }}
          containerStyle={{
            borderRadius: variant === 'registration' ? radius.lg : radius.xl,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            backgroundColor: colors.background.surface,
            overflow: 'hidden',
          }}
          itemContainerStyle={{
            height: DROPDOWN_ITEM_HEIGHT,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary.borderLight,
          }}
          itemTextStyle={{
            color: colors.text.primary,
            fontSize: 15,
          }}
          activeColor={colors.primary.subtle}
          maxHeight={DROPDOWN_MAX_HEIGHT}
          autoScroll={false}
          dropdownPosition={dropdownPosition}
          flatListProps={dropdownFlatListProps}
          search={false}
          mode={dropdownMode}
          renderRightIcon={() => (
            <Icon name={open ? 'expand-less' : 'expand-more'} size="sm" color={colors.primary.DEFAULT} />
          )}
          renderItem={renderDropdownItem}
        />
        {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={{ gap: spacing[2] }}>
        {label ? (
          <Text
            variant="caption"
            color={error ? colors.status.error : labelVariant === 'uppercase' ? '#6b7280' : colors.text.primary}
            style={{
            fontFamily: labelVariant === 'uppercase' ? typography.fontFamily.bold : typography.fontFamily.semibold,
            textTransform: labelVariant === 'uppercase' ? 'uppercase' : 'none',
            letterSpacing: labelVariant === 'uppercase' ? 0.8 : 0,
            fontSize: labelVariant === 'uppercase' ? 12 : 14,
            }}>
          {`${label}${required ? ' *' : ''}`}
        </Text>
      ) : null}
      <View style={{ gap: spacing[2], flexDirection: variant === 'pill' ? 'row' : 'column', flexWrap: variant === 'pill' ? 'wrap' : 'nowrap' }}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              disabled={disabled || Boolean(option.disabled)}
              style={{
                borderRadius: variant === 'pill' ? radius.full : radius.lg,
                borderWidth: 1,
                borderColor: active ? colors.primary.DEFAULT : colors.primary.borderLight,
                backgroundColor: active ? colors.primary.subtle : colors.background.surface,
                paddingHorizontal: variant === 'pill' ? spacing[4] : spacing[3],
                paddingVertical: spacing[3],
                opacity: disabled || option.disabled ? 0.55 : 1,
              }}>
              <Text variant="body" color={active ? colors.primary.DEFAULT : colors.text.primary}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text variant="caption" color={colors.status.error}>{error}</Text> : null}
      {!selected && !error ? <Text variant="caption" color={colors.text.muted}>{hint ?? 'Select an option'}</Text> : null}
    </View>
  );
}

function FormikSelectField<TValue extends string>(props: SelectFieldProps<TValue> & { name: string }) {
  const [field, meta, helpers] = useField<TValue>(props.name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <SelectFieldBody
      {...props}
      value={field.value}
      onSelect={(nextValue) => helpers.setValue(nextValue)}
      error={hasError ? meta.error : props.error}
    />
  );
}

export function SelectField<TValue extends string>(props: SelectFieldProps<TValue>) {
  if (props.name) {
    return <FormikSelectField {...(props as SelectFieldProps<TValue> & { name: string })} />;
  }

  return (
    <SelectFieldBody
      {...props}
      value={props.value}
      onSelect={props.onSelect ?? (() => undefined)}
    />
  );
}
