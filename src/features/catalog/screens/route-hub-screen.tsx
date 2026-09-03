import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const moduleGroups = [
  {
    title: 'Splash',
    href: '/splash',
    label: 'Launch Splash',
    subtitle: 'App loading / launch screen',
  },
  {
    title: 'Onboarding',
    href: '/welcome',
    label: 'Full Onboarding Flow',
    subtitle: 'Registration, KYC, and approval journey',
  },
  {
    title: 'User Flow',
    href: '/member',
    label: 'Full User Flow',
    subtitle: 'Home, community, members, matrimony, profile',
  },
  {
    title: 'Admin Flow',
    href: '/admin/dashboard',
    label: 'Full Admin Flow',
    subtitle: 'Home, clients, invoices, profile, and inner admin screens',
  },
] as const;

export function RouteHubScreen() {
  return (
    <View className="flex-1 bg-[#f8f7f5]">
      <ScrollView className="flex-1" contentContainerClassName="px-4 pb-10 pt-16" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-slate-900">Community App Routes</Text>
        <Text className="mt-2 text-sm leading-6 text-slate-600">
          Active Expo Router entry points backed by feature screens. Legacy previews and migration routes have been archived.
        </Text>
        <Text className="mt-2 text-sm leading-6 text-[#18a875]">
          Start with the four flow entries below.
        </Text>

        <View className="mt-8 gap-8">
          {moduleGroups.map((group) => (
            <View key={group.title} className="gap-3">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-[#18a875]">{group.title}</Text>
              <Link href={group.href as never} asChild>
                <TouchableOpacity
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                  activeOpacity={0.85}
                >
                  <Text className="text-base font-semibold text-slate-900">{group.label}</Text>
                  <Text className="mt-1 text-xs text-slate-500">{group.subtitle}</Text>
                  <Text className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[#18a875]">
                    {group.href}
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          ))}

          <View className="gap-3">
            <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-[#18a875]">Utilities</Text>
            <Link href="/design-system" asChild>
              <TouchableOpacity className="rounded-2xl border border-slate-200 bg-white px-4 py-4" activeOpacity={0.85}>
                <Text className="text-base font-semibold text-slate-900">Design System Showcase</Text>
                <Text className="mt-1 text-xs text-slate-500">/design-system</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
