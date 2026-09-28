import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, View } from 'react-native';

import { AppHeader, AppSafeAreaView, Text } from '@/src/components';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

type ManualSection = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  summary: string;
  steps: string[];
};

const manualSections: ManualSection[] = [
  {
    title: 'Getting Started',
    icon: 'rocket-launch',
    summary: 'Use your registered mobile number to sign in and complete the member registration process.',
    steps: [
      'Open the app and sign in with your mobile number and OTP.',
      'Complete registration with your personal, address, family, and document details.',
      'Wait for admin approval if your community requires profile verification.',
      'After approval, the member dashboard gives access to all available modules.',
    ],
  },
  {
    title: 'Dashboard',
    icon: 'dashboard',
    summary: 'The dashboard is the main entry point for quick actions, updates, and community shortcuts.',
    steps: [
      'Use the action grid to open member directory, events, contributions, publications, and matrimony.',
      'Check notices, birthday reminders, and community updates from the dashboard sections.',
      'Use the menu or bottom tabs to move between major areas of the app.',
    ],
  },
  {
    title: 'Profile and Documents',
    icon: 'account-circle',
    summary: 'Keep your profile, family details, documents, language, and security settings updated.',
    steps: [
      'Open Profile to view your membership status and personal details.',
      'Use Change Profile Details to request edits when profile approval is required.',
      'Manage family members from the Family section.',
      'Upload or re-upload required documents from Document Management.',
      'Enable app security from Profile Security if available on your device.',
    ],
  },
  {
    title: 'Members and Community',
    icon: 'groups',
    summary: 'Find community members, trustees, and public member information from directory screens.',
    steps: [
      'Use Members or Community Directory to search by name, city, family, or available filters.',
      'Open a member card to view permitted details.',
      'Use Trustees to find trustee information and contact options when available.',
    ],
  },
  {
    title: 'Events',
    icon: 'event',
    summary: 'Browse events, register, pay if required, and access passes or event chats.',
    steps: [
      'Open Events to view active and upcoming events.',
      'Open an event to see details, location, fees, add-ons, and registration status.',
      'Register yourself and family attendees, then complete payment when required.',
      'Use My Events to view registrations, passes, QR codes, and event-specific chat if enabled.',
    ],
  },
  {
    title: 'Contributions and Transactions',
    icon: 'volunteer-activism',
    summary: 'Make contributions, view receipts, and track your paid activity.',
    steps: [
      'Open Contributions and enter amount, purpose, and contributor details.',
      'Contribute as yourself or on behalf of another person where supported.',
      'Complete online payment and wait for the success receipt confirmation.',
      'Open Transactions to view contribution receipts, event payments, and subscription activity.',
    ],
  },
  {
    title: 'Publications and Saint PDF',
    icon: 'newspaper',
    summary: 'Read community publications and Saint PDF documents directly in the app browser.',
    steps: [
      'Open Publications to view published issues.',
      'Tap View to open the publication online.',
      'User access is view-only; download actions are reserved for admin workflows.',
      'Use the Saint PDF shortcut from the dashboard to open the document directly.',
    ],
  },
  {
    title: 'Matrimony',
    icon: 'favorite',
    summary: 'Create a matrimony profile, discover approved profiles, and manage requests or messages.',
    steps: [
      'Open Matrimony and create your profile with required photo and personal details.',
      'Submit the profile for admin approval if approval is enabled.',
      'Use Discover to browse profiles after access requirements are met.',
      'Send, accept, or reject requests and use messages when both sides are connected.',
      'Purchase or renew subscriptions when the community has paid matrimony access enabled.',
    ],
  },
  {
    title: 'Notifications and Chats',
    icon: 'notifications',
    summary: 'Stay updated through notifications, announcements, birthday wishes, and chat rooms.',
    steps: [
      'Open Notifications to read community alerts and updates.',
      'Allow push notification permission from device settings for real-time alerts.',
      'Use Chats to join community or event chat rooms you have access to.',
      'Use birthday features to view reminders and send greetings when available.',
    ],
  },
  {
    title: 'Help and Best Practices',
    icon: 'help-outline',
    summary: 'Use accurate details and contact community admin when something looks incorrect.',
    steps: [
      'Keep your mobile number, address, documents, and profile photo updated.',
      'Check payment status from Transactions before retrying a payment.',
      'If a module is locked, review your approval, profile, or subscription status.',
      'Contact community admin for approval delays, wrong member data, failed payments, or access issues.',
    ],
  },
];

function ManualSectionCard({ section, index }: { section: ManualSection; index: number }) {
  return (
    <View
      style={{
        borderRadius: radius.xl,
        backgroundColor: colors.background.surface,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
        padding: spacing[4],
        gap: spacing[3],
        ...shadows.sm,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: radius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary.subtle,
          }}>
          <MaterialIcons name={section.icon} size={22} color={colors.primary.DEFAULT} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="caption" color={colors.text.muted} style={{ fontFamily: typography.fontFamily.semibold }}>
            {String(index + 1).padStart(2, '0')}
          </Text>
          <Text variant="h5" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
            {section.title}
          </Text>
        </View>
      </View>

      <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
        {section.summary}
      </Text>

      <View style={{ gap: spacing[2] }}>
        {section.steps.map((step) => (
          <View key={step} style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'flex-start' }}>
            <MaterialIcons name="check-circle" size={17} color={colors.status.success} style={{ marginTop: 2 }} />
            <Text variant="body" color={colors.text.primary} style={{ flex: 1, lineHeight: 21 }}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function UserManualContent() {
  const navigateBack = useBackNavigation();

  return (
    <AppSafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <AppHeader title="User Manual" variant="back" onLeftPress={navigateBack} />
      <ScrollView
        contentContainerStyle={{
          padding: spacing[4],
          paddingBottom: spacing[8],
          gap: spacing[4],
        }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            borderRadius: radius.xl,
            backgroundColor: colors.primary.subtle,
            borderWidth: 1,
            borderColor: colors.primary.borderLight,
            padding: spacing[4],
            gap: spacing[2],
          }}>
          <Text variant="h4" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
            How to use the app
          </Text>
          <Text variant="body" color={colors.text.secondary} style={{ lineHeight: 22 }}>
            A quick guide for registration, profile, events, contributions, publications, matrimony, notifications, and everyday member actions.
          </Text>
        </View>

        {manualSections.map((section, index) => (
          <ManualSectionCard key={section.title} section={section} index={index} />
        ))}
      </ScrollView>
    </AppSafeAreaView>
  );
}
