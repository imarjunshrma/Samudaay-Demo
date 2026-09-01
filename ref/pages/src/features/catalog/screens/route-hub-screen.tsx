import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const routeGroups = [
  {
    title: 'Utilities',
    items: [['/design-system', 'Design System Showcase']],
  },
  {
    title: 'Core User',
    items: [
      ['/registration-kyc', 'Registration & KYC'],
      ['/kyc-approval', 'KYC Approval'],
      ['/dashboard/dashboard-id-card', 'Dashboard & ID Card'],
      ['/dashboard/member-dashboard', 'Dashboard With Advertisement'],
      ['/dashboard/member-dashboard-popup', 'Dashboard With Ad Popup'],
      ['/dashboard/unified-community-dashboard', 'Unified Community Dashboard'],
      ['/profile/my-profile', 'My Profile'],
      ['/profile/family-management', 'Family Management'],
      ['/directory/member-directory', 'Member Directory'],
      ['/directory/trustees', 'Trustees'],
      ['/finance/donation-management', 'Donation Management'],
      ['/finance/my-transactions', 'My Transactions'],
      ['/communication/notifications', 'Notifications'],
      ['/communication/community-hub', 'Community Hub'],
    ],
  },
  {
    title: 'Events',
    items: [
      ['/events/event-details-registration', 'Event Details & Registration'],
      ['/events/event-details-gallery', 'Event Details With Gallery'],
      ['/events/event-live-chat', 'Event Live & Chat'],
      ['/events/event-photo-gallery', 'Event Photo Gallery'],
      ['/events/event-performance-dashboard', 'Event Performance Dashboard'],
      ['/events/family-event-passes', 'Family Event Passes'],
      ['/events/my-events-list', 'My Events List'],
      ['/events/qr-scanner', 'QR Scanner'],
    ],
  },
  {
    title: 'Communication',
    items: [
      ['/communication/create-notification', 'Create Notification'],
      ['/communication/community-chats', 'Community Chats'],
      ['/communication/birthday-reminders', 'Birthday Reminders'],
      ['/communication/send-birthday-card', 'Send Birthday Card'],
    ],
  },
  {
    title: 'Finance',
    items: [
      ['/finance/billing', 'Billing & Invoicing'],
      ['/finance/transaction-management', 'Transaction Management'],
      ['/finance/transaction-analytics', 'Transaction Analytics'],
      ['/finance/event-analytics', 'Event Analytics'],
      ['/finance/people-analytics', 'People Analytics'],
      ['/finance/profit-loss-yearly', 'Yearly Profit & Loss'],
      ['/finance/profit-loss-event', 'Event Profit & Loss'],
      ['/finance/record-manual-donation', 'Record Manual Donation'],
    ],
  },
  {
    title: 'Matrimony',
    items: [
      ['/matrimony/discovery', 'Matrimony Discovery'],
      ['/matrimony/discovery-premium', 'Matrimony Discovery Premium'],
      ['/matrimony/create-profile', 'Create Matrimony Profile'],
      ['/matrimony/approve-profiles', 'Approve Matrimony Profiles'],
      ['/matrimony/analytics', 'Matrimony Analytics'],
    ],
  },
  {
    title: 'Publications And Forms',
    items: [
      ['/publications/generate', 'Generate Publication'],
      ['/publications/archive', 'Monthly Publications Archive'],
      ['/forms/upload-marksheet', 'Upload Marksheet'],
      ['/forms/children-education-directory', "Children's Education Directory"],
    ],
  },
  {
    title: 'Admin',
    items: [
      ['/admin/dashboard', 'Admin Dashboard'],
      ['/admin/analytics', 'Admin Dashboard Analytics'],
      ['/admin/manage-events', 'Manage Events'],
      ['/admin/create-event', 'Create New Event'],
      ['/admin/manage-directory', 'Manage Member Directory'],
      ['/admin/manage-trustees', 'Manage Community Trustees'],
      ['/admin/expenses', 'Expense Management'],
      ['/admin/create-expense', 'Create New Expense'],
      ['/admin/roles', 'Role Management & Permissions'],
      ['/advertisements/create', 'Create Advertisement'],
    ],
  },
  {
    title: 'Super Admin',
    items: [
      ['/super-admin/assign-user-role', 'Assign User Role'],
      ['/super-admin/create-admin', 'Create Admin'],
      ['/super-admin/create-new-client-organization', 'Create New Client Organization'],
      ['/super-admin/client-configuration', 'Client Configuration'],
      ['/super-admin/client-management', 'Client Management'],
    ],
  },
  {
    title: 'Navigation',
    items: [['/welcome', 'Splash / Welcome']],
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

        <View className="mt-8 gap-8">
          {routeGroups.map((group) => (
            <View key={group.title} className="gap-3">
              <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f2780d]">{group.title}</Text>
              {group.items.map(([href, label]) => (
                <Link key={href} href={href as never} asChild>
                  <TouchableOpacity className="rounded-2xl border border-slate-200 bg-white px-4 py-4" activeOpacity={0.85}>
                    <Text className="text-base font-semibold text-slate-900">{label}</Text>
                    <Text className="mt-1 text-xs text-slate-500">{href}</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
