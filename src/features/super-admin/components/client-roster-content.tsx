import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';

import { SearchInput, Text } from '@/src/components';
import { AppBottomBar } from '@/src/components/layout/AppBottomBar';
import { AppHeader } from '@/src/components/layout/AppHeader';
import { useTranslations } from '@/src/i18n/use-translations';
import { spacing, typography } from '@/src/theme';

import {
  CommunityCard,
  CommunityRow,
  FeaturedCommunityCard,
  RosterHero,
} from './client-blocks';

export function ClientRosterContent() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('super-admin.client-roster');
  const [search, setSearch] = useState('');

  const featuredCommunities = useMemo(
    () => [
      { key: 'community-one', title: t('community.one.title'), users: '842', status: t('community.one.status'), icon: 'groups' as const, muted: false },
      { key: 'community-two', title: t('community.two.title'), users: '0', status: t('community.two.status'), icon: 'lock' as const, muted: true },
    ],
    [t],
  );
  const communityRows = useMemo(
    () => [
      { key: 'row-one', name: t('community.row.one'), users: '312', status: t('community.row.status'), icon: 'palette' as const },
      { key: 'row-two', name: t('community.row.two'), users: '194', status: t('community.row.status'), icon: 'auto-awesome' as const },
    ],
    [t],
  );
  const normalizedSearch = search.trim().toLowerCase();
  const visibleFeaturedCommunities = useMemo(
    () => featuredCommunities.filter((item) => !normalizedSearch || `${item.title} ${item.status} ${item.users}`.toLowerCase().includes(normalizedSearch)),
    [featuredCommunities, normalizedSearch],
  );
  const visibleCommunityRows = useMemo(
    () => communityRows.filter((item) => !normalizedSearch || `${item.name} ${item.status} ${item.users}`.toLowerCase().includes(normalizedSearch)),
    [communityRows, normalizedSearch],
  );
  const hasResults = visibleFeaturedCommunities.length > 0 || visibleCommunityRows.length > 0;

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
              {t('brand')}
            </Text>
          </View>
        }
        rightSlot={
          <View style={{ width: 40, height: 40, borderRadius: 999, overflow: 'hidden', backgroundColor: '#e7e1d9' }}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWvEoIhDQJv3HUjk3_eimjlmV2Z37P5Nbm2mi6gEY_772cIcZkPTxzGg0N3i1cpJGtk8TZjBiLzTQPIzlkpQMS1fxKr-FqV-hHTnlquU2NPjLBKYwWXMgXzoxQOLyvaKeFQklIyocdqUZjVwwSN2VteAxHHp4lWsfIHQiLYBE3583k1b6uhIu668qKSIiEYIVbGDF82mh59A8y8CcEvQQYadu9VSjP5jW1_U19o_U4JZoNZ4Ubf3bXGHTrm8VBIDdNunRMfzn9UZNE' }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        }
      />
      <AppBottomBar
        items={[
          { key: 'clients', icon: 'corporate-fare', label: t('nav.clients') },
          { key: 'configs', icon: 'settings-input-component', label: t('nav.configs') },
          { key: 'billing', icon: 'payments', label: t('nav.billing') },
          { key: 'audit', icon: 'receipt-long', label: t('nav.audit') },
        ]}
        activeKey="clients"
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
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.85}
        style={{
          position: 'absolute',
          right: spacing[6],
          bottom: 96,
          width: 64,
          height: 64,
          borderRadius: 999,
          backgroundColor: '#f2780d',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        }}>
        <MaterialIcons name="add" size={30} color="#ffffff" />
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 96, paddingBottom: 120 }}>
        <View style={{ width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingBottom: spacing[12] }}>
          <View style={{ marginBottom: spacing[12], gap: spacing[8] }}>
            <RosterHero />
            <SearchInput value={search} onChangeText={setSearch} placeholder={t('search.placeholder')} />
          </View>

          {hasResults ? (
            <>
              <View style={{ gap: spacing[4] }}>
                {!normalizedSearch ? <FeaturedCommunityCard /> : null}
                <View style={{ gap: spacing[4] }}>
                  {visibleFeaturedCommunities.map((item) => (
                    <CommunityCard key={item.key} title={item.title} users={item.users} status={item.status} icon={item.icon} muted={item.muted} />
                  ))}
                </View>
              </View>

              {visibleCommunityRows.length > 0 ? (
                <View style={{ marginTop: spacing[8], gap: spacing[4] }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(212,195,190,0.25)' }} />
                  </View>

                  <View style={{ gap: spacing[4] }}>
                    {visibleCommunityRows.map((item) => (
                      <CommunityRow key={item.key} name={item.name} users={item.users} status={item.status} icon={item.icon} />
                    ))}
                  </View>
                </View>
              ) : null}
            </>
          ) : (
            <View style={{ borderRadius: 24, backgroundColor: '#ffffff', padding: spacing[6], borderWidth: 1, borderColor: 'rgba(212,195,190,0.25)' }}>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: '#46291e' }}>
                No communities found
              </Text>
              <Text style={{ marginTop: spacing[2], color: '#7c685f' }}>
                Try a different community name or clear the search.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}
