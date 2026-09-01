import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { Button, Text } from '@/src/components';
import { AppBottomBar } from '@/src/components/layout/AppBottomBar';
import { AppHeader } from '@/src/components/layout/AppHeader';
import { colors, spacing, typography } from '@/src/theme';

import {
  AuditTrailRow,
  LicenseAccessCard,
  PreviewCard,
  SubscriptionCard,
  VisualIdentityCard,
} from './client-blocks';

export function ClientConfigurationContent() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <AppHeader
        variant="brand"
        leftSlot={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
            <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={{ width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="grid-view" size={22} color="#46291e" />
            </TouchableOpacity>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, fontStyle: 'italic', color: '#46291e' }}>
              The Digital Atelier
            </Text>
          </View>
        }
        rightSlot={
          <View style={{ width: 40, height: 40, borderRadius: 999, overflow: 'hidden', backgroundColor: '#e7e1d9' }}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUVouIvUhXogPvl35Bg0hXvbYrK8onW5ZJ-ToDaZN072aSrj07fJoPFE-bpvPDC6vD9I_uhMCJ0ocWXefjoKMwY74r5XAWY9FVmksJpISqWEq1jsRsRsd9VKkMwFVLMV7gK40XUHMiEqVQdV-7kEuPQwWi4oMiNR_BDB7Z2p0tA9vV-AtJGwrb4oGOmip_NXx1WU8U0TZ61JsMj1q99fLa0dCl5A6ajqVgjvsOafYgWw9j5Qt1dsZi1cmlJvhbQCp1-JYScSHK7avW' }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 88, paddingBottom: 120 }}>
        <View style={{ width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingBottom: spacing[10] }}>
          <View style={{ gap: spacing[4], marginBottom: spacing[6] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], flexWrap: 'wrap' }}>
              <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                Clients
              </Text>
              <MaterialIcons name="chevron-right" size={16} color="#94a3b8" />
              <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.bold }}>
                Aurum Leatherworks
              </Text>
              <MaterialIcons name="chevron-right" size={16} color="#94a3b8" />
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                Configuration
              </Text>
            </View>
            <View style={{ gap: spacing[4] }}>
              <Text variant="h1" style={{ fontFamily: typography.fontFamily.bold, fontStyle: 'italic', color: colors.primary.DEFAULT }}>
                Aurum Leatherworks
              </Text>
              <Text variant="body" color={colors.text.muted}>
                Bespoke workshop profile and environmental parameters for high-fidelity digital production.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing[3] }}>
              <View style={{ flex: 1 }}>
                <Button variant="outline" fullWidth>
                  Discard
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button fullWidth>
                  Save Changes
                </Button>
              </View>
            </View>
          </View>

          <View style={{ gap: spacing[6] }}>
            <LicenseAccessCard />
            <VisualIdentityCard />
            <SubscriptionCard />
            <PreviewCard />
            <AuditTrailRow />
          </View>
        </View>
      </ScrollView>
      <AppBottomBar
        items={[
          { key: 'clients', icon: 'corporate-fare', label: 'Clients' },
          { key: 'configs', icon: 'settings-input-component', label: 'Configs' },
          { key: 'billing', icon: 'payments', label: 'Billing' },
          { key: 'audit', icon: 'receipt-long', label: 'Audit' },
        ]}
        activeKey="configs"
        onChange={(key) => {
          if (key === 'clients') {
            router.push('/super-admin/client-management');
          }
          if (key === 'configs') {
            router.push('/super-admin/client-configuration');
          }
          if (key === 'billing') {
            router.push('/finance/billing');
          }
          if (key === 'audit') {
            router.push('/admin/analytics');
          }
        }}
        forceVisible={!pathname.startsWith('/member')}
      />
    </AppSafeAreaView>
  );
}
