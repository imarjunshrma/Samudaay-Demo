import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Button } from '@/src/components';
import { colors, spacing } from '@/src/theme';

export function KycApprovalActions({
  onReject,
  onApprove,
  loadingApprove,
  loadingReject,
  disableApprove,
  disableReject,
  approveLabel = 'Approve Member',
  rejectLabel = 'Reject with Reason',
}: {
  onReject?: () => void;
  onApprove?: () => void;
  loadingApprove?: boolean;
  loadingReject?: boolean;
  disableApprove?: boolean;
  disableReject?: boolean;
  approveLabel?: string;
  rejectLabel?: string;
}) {
  const isActioning = Boolean(loadingApprove || loadingReject);
  return (
    <View style={{ gap: spacing[3] }}>
      <View>
        <Button
          variant="outline"
          fullWidth
          loading={loadingReject}
          disabled={isActioning || disableReject}
          leftIcon={<MaterialIcons name="close" size={16} color={colors.primary.DEFAULT} />}
          onPress={onReject}>
          {rejectLabel}
        </Button>
      </View>
      <View>
        <Button
          variant="primary"
          fullWidth
          loading={loadingApprove}
          disabled={isActioning || disableApprove}
          leftIcon={<MaterialIcons name="verified" size={16} color="#ffffff" />}
          onPress={onApprove}>
          {approveLabel}
        </Button>
      </View>
    </View>
  );
}
