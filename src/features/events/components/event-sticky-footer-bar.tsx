import { MaterialIcons } from '@expo/vector-icons';

import { StickySummaryActionBar } from '@/src/components';

export function EventStickyFooterBar({
  label,
  value,
  buttonLabel,
  buttonIcon,
  onButtonPress,
}: {
  label: string;
  value: string;
  buttonLabel: string;
  buttonIcon?: React.ComponentProps<typeof MaterialIcons>['name'];
  onButtonPress?: () => void;
}) {
  return (
    <StickySummaryActionBar
      label={label}
      value={value}
      buttonLabel={buttonLabel}
      buttonIcon={buttonIcon ? <MaterialIcons name={buttonIcon} size={18} color="#ffffff" /> : undefined}
      onButtonPress={onButtonPress}
    />
  );
}
