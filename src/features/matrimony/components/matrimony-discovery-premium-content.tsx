import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMemo, useState } from 'react';

import { AppBottomBar, AppHeader, Text } from '@/src/components';

import { FilterSheet } from '@/src/components/feedback';

import { FilterChips } from '@/src/components/lists/FilterChips/FilterChips';

import { useMemberMenuAction } from '@/src/core/navigation/use-member-menu-action';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { useTranslations } from '@/src/i18n/use-translations';

import { getMemberBottomBarRoute, memberBottomBarItems } from '@/src/core/navigation/member-shell';
import { colors, radius, spacing, typography } from '@/src/theme';

import {
  PREMIUM_AGE_OPTIONS,
  PREMIUM_CITY_OPTIONS,
  PREMIUM_DISCOVERY_PROFILES,
  PREMIUM_EDUCATION_OPTIONS,
} from './matrimony-premium-data';
import { PremiumDiscoveryCard } from './premium-discovery-card';
import { MatrimonyModuleTabs } from './matrimony-module-tabs';

export function MatrimonyDiscoveryPremiumContent() {
  const { safeNavigateRoot } = useSafeNavigation();
  const insets = useSafeAreaInsets();
  const openMemberMenu = useMemberMenuAction();
  const t = useTranslations('matrimony.discovery-premium');
  const [filterVisible, setFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    age: 'all',
    education: 'all',
    city: 'all',
  });
  const [draftFilters, setDraftFilters] = useState(appliedFilters);
  const filteredProfiles = useMemo(
    () =>
      PREMIUM_DISCOVERY_PROFILES.filter((profile) => {
        const ageMatches = appliedFilters.age === 'all' || profile.ageGroup === appliedFilters.age;
        const educationMatches =
          appliedFilters.education === 'all' || profile.educationGroup === appliedFilters.education;
        const cityMatches = appliedFilters.city === 'all' || profile.cityGroup === appliedFilters.city;

        return ageMatches && educationMatches && cityMatches;
      }),
    [appliedFilters],
  );

  const activeFilterCount = [appliedFilters.age, appliedFilters.education, appliedFilters.city].filter((value) => value !== 'all').length;

  const filterSections = [
    {
      title: t('filters.age'),
      items: PREMIUM_AGE_OPTIONS.map((option) => ({ key: option.key, label: option.label })),
      activeKey: draftFilters.age,
      onSelect: (key: string) => setDraftFilters((current) => ({ ...current, age: key })),
    },
    {
      title: t('filters.education'),
      items: PREMIUM_EDUCATION_OPTIONS.map((option) => ({ key: option.key, label: option.label })),
      activeKey: draftFilters.education,
      onSelect: (key: string) => setDraftFilters((current) => ({ ...current, education: key })),
    },
    {
      title: t('filters.city'),
      items: PREMIUM_CITY_OPTIONS.map((option) => ({ key: option.key, label: option.label })),
      activeKey: draftFilters.city,
      onSelect: (key: string) => setDraftFilters((current) => ({ ...current, city: key })),
    },
  ];

  const openFilters = () => {
    setDraftFilters(appliedFilters);
    setFilterVisible(true);
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setFilterVisible(false);
  };

  const resetFilters = () => {
    const nextFilters = { age: 'all', education: 'all', city: 'all' };
    setDraftFilters(nextFilters);
    setAppliedFilters(nextFilters);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
      <AppHeader
        variant="brand"
        leftSlot={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
            <TouchableOpacity onPress={openMemberMenu} activeOpacity={0.85} style={{ padding: spacing[2] }}>
              <MaterialIcons name="menu" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
            {t('title')}
            </Text>
          </View>
        }
        rightSlot={
          <View style={{ width: 40, height: 40, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: colors.primary.muted }}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvwS71q-rDILNLST1cFRWUcj4XuSGyN2iqEGW7_BQvycPQYaJiiV07RR_UewMK9KmwjheyLJvF4Kxcjiy4q1bb45K0zMa_yDHsiTka5PtMxh3Hp1N2-bzd8efxRdr7RuyXMyiF--CngVjIM-q86QtlmwIndLvOidkC7--xSyqen0c0gNHAR2Uibe8IsvwuXI-mNn8Dfq5pMrQGnx5wII5Ee6I62WGGJOfkDkYx6QVH4Jj0qDU5eYBdoefCS4A4qmHM33DVcgzqZ0-p' }}
              resizeMode="cover"
              style={{ flex: 1 }}
            />
          </View>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingBottom: 136 }}>
        <MatrimonyModuleTabs activeKey="discovery" />

        <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[3] }}>
          <Text variant="h1" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary, fontSize: 48, lineHeight: 52 }}>
            {t('hero.title')}
          </Text>
          <Text variant="body" color={colors.text.secondary} style={{ marginTop: spacing[2], lineHeight: 22 }}>
            {t('hero.subtitle')}
          </Text>
        </View>
        <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[3] }}>
          <FilterChips
            scrollable
            activeKey="new"
            onPress={() => undefined}
            items={[
              { key: 'new', label: t('chips.new') },
              { key: 'compatible', label: t('chips.compatible') },
              { key: 'nearby', label: t('chips.nearby') },
            ]}
          />
        </View>
        <View style={{ paddingHorizontal: spacing[4], gap: spacing[4] }}>
          {filteredProfiles.map((profile) => (
            <PremiumDiscoveryCard
              key={profile.name}
              name={profile.name}
              subtitle={profile.subtitle}
              image={profile.image}
              ageHeight={profile.ageHeight}
              education={profile.education}
              profession={profile.profession}
            />
          ))}
          {filteredProfiles.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: spacing[8], gap: spacing[2] }}>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold, color: colors.text.primary }}>
                {t('empty.title')}
              </Text>
              <Text variant="caption" color={colors.text.muted}>
                {t('empty.description')}
              </Text>
              <TouchableOpacity activeOpacity={0.85} onPress={resetFilters} style={{ marginTop: spacing[2], borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border.DEFAULT, paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                  {t('actions.reset')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={openFilters}
        style={{ position: 'absolute', right: spacing[4], bottom: 112 + insets.bottom, width: 56, height: 56, borderRadius: 999, backgroundColor: colors.primary.light, alignItems: 'center', justifyContent: 'center', zIndex: 40, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } }}>
        <MaterialIcons name="tune" size={20} color="#ffffff" />
        {activeFilterCount > 0 ? (
          <View style={{ position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 999, backgroundColor: colors.status.error, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
            <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
              {activeFilterCount}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
      <FilterSheet
        visible={filterVisible}
        title={t('filter.title')}
        subtitle={t('filter.subtitle')}
        sections={filterSections}
        onClose={() => setFilterVisible(false)}
        onApply={applyFilters}
        onReset={resetFilters}
        applyLabel={t('filter.apply')}
      />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <AppBottomBar
          activeKey="matrimony"
          items={memberBottomBarItems}
          onChange={(key) => safeNavigateRoot(getMemberBottomBarRoute(key))}
        />
      </View>
      </View>
    </SafeAreaView>
  );
}
