import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader, Button, IconButton, Text } from '@/src/components';
import { getDefaultRouteForSession } from '@/src/core/navigation/default-route';
import { useSession } from '@/src/core/providers/session-provider';
import { useAuthActions } from '@/src/features/auth/hooks/use-auth-actions';
import { colors, radius, spacing, typography } from '@/src/theme';

export default function PendingApprovalScreen() {
  const router = useRouter();
  const { session } = useSession();
  const { signOut, isSubmitting } = useAuthActions();
  const status = session?.user.communityMembershipStatus || 'PENDING';
  const kycStatus = session?.user.kycStatus || 'NOT_UPLOADED';
  const rejected = status === 'REJECTED';
  const active = status === 'ACTIVE';

  async function handleSignOut() {
    await signOut();
  }

  function formatStatusLabel(value: string) {
    return value
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <AppHeader
          title={active ? 'Registration Approved' : rejected ? 'Registration Needs Attention' : 'Waiting for Approval'}
          variant="centered"
          rightSlot={<IconButton icon="logout" onPress={() => void handleSignOut()} disabled={isSubmitting} variant="plain" accessibilityLabel="Sign out" />}
          leftSlot={<View style={{ width: 48, height: 48 }} />}
        />
        <View style={{ flex: 1, padding: spacing[5], justifyContent: 'center' }}>
          <View
            style={{
              backgroundColor: colors.background.surface,
              borderRadius: radius.xl,
              borderWidth: 1,
              borderColor: colors.primary.borderLight,
              padding: spacing[6],
              alignItems: 'center',
              gap: spacing[4],
            }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: radius.full,
                backgroundColor: rejected ? colors.status.errorLight : colors.primary.muted,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialIcons
                name={active ? 'check-circle-outline' : rejected ? 'error-outline' : 'hourglass-top'}
                size={34}
                color={active ? colors.status.success : rejected ? colors.status.error : colors.primary.DEFAULT}
              />
            </View>
            <Text variant="h3" style={{ textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
              {active ? 'Your registration is approved' : rejected ? 'Your registration was rejected' : 'Your registration is under review'}
            </Text>
            <View style={{ gap: spacing[2], alignItems: 'center' }}>
              <Text variant="caption" color={colors.text.secondary} style={{ fontFamily: typography.fontFamily.medium }}>
                KYC: {formatStatusLabel(kycStatus)}
              </Text>
            </View>
            <Text variant="body" color={colors.text.secondary} style={{ textAlign: 'center', lineHeight: 22 }}>
              {active
                ? 'Your account is active. Continue to the dashboard.'
                : rejected
                ? 'Please contact the community admin or update your registration details when requested.'
                : 'An admin or Registration Manager will review your profile and KYC documents. You can use the app after approval. You can connect to +91 9824395362 and +91 9898620773 for any queries.'}
            </Text>
            <View style={{ width: '100%', gap: spacing[3], marginTop: spacing[2] }}>
              {active ? (
                <Button fullWidth rounded onPress={() => session && router.replace(getDefaultRouteForSession(session) as never)}>
                  Go to Dashboard
                </Button>
              ) : null}
              <Button fullWidth rounded variant="ghost" loading={isSubmitting} onPress={() => void handleSignOut()}>
                Sign Out
              </Button>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
