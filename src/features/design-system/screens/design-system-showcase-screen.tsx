import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Pressable, View } from 'react-native';

import {
  AppBottomBar,
  AppHeader,
  AppSidebar,
  AmountSelector,
  AnalyticsChartCard,
  AnalyticsStatCard,
  AnimatedPressable,
  ArchiveIssueCard,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  ContentFeedCard,
  DateField,
  Divider,
  EmptyState,
  ErrorState,
  FadeIn,
  FeatureCard,
  FileUpload,
  FilterChips,
  FormSection,
  DigitalIdCard,
  Icon,
  IconButton,
  ListItem,
  LoadingOverlay,
  MatchCard,
  MemberListItem,
  NotificationCard,
  NotificationItem,
  OTPInput,
  PhoneInput,
  ProfileCard,
  ProgressStepper,
  PremiumBannerCard,
  RadioGroup,
  ScreenSection,
  SearchInput,
  SectionCard,
  SegmentedControl,
  SelectField,
  SkeletonCard,
  SkeletonForm,
  SlideIn,
  SlideUp,
  SpotlightFeature,
  StatHighlightCard,
  StaggeredList,
  StoryAvatar,
  SubmitBar,
  SubmitButton,
  TemplateCard,
  Tabs,
  Text,
  TextField,
  TransactionItem,
  EventPassCard,
  UserBottomBar,
  UserHeader,
  UserScreen,
} from '@/src/components';
import { useNotifications } from '@/src/notifications';
import { colors, spacing } from '@/src/theme';
import { memberImage } from '@/src/features/dashboard/constants/member-dashboard';

const bottomBarItems = [
  { key: 'home', icon: 'home', label: 'Home', route: '/dashboard/dashboard-id-card' },
  { key: 'donations', icon: 'volunteer-activism', label: 'Donate', route: '/finance/donation-management' },
  { key: 'kyc', icon: 'badge', label: 'KYC', route: '/registration-kyc', badge: 2 },
  { key: 'profile', icon: 'person-outline', label: 'Profile', route: '/design-system' },
] as const;

const filterItems = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
];

const tabsItems = [
  { key: 'all', label: 'All Activities' },
  { key: 'donations', label: 'Donations' },
  { key: 'events', label: 'Events' },
  { key: 'subscriptions', label: 'Subscriptions' },
];

const communityBottomBarItems = [
  { key: 'home', icon: 'home', label: 'Home' },
  { key: 'directory', icon: 'groups', label: 'Directory' },
  { key: 'events', icon: 'event', label: 'Events' },
  { key: 'profile', icon: 'person-pin', label: 'Profile' },
] as const;

const financeBottomBarItems = [
  { key: 'home', icon: 'home', label: 'Home' },
  { key: 'history', icon: 'history', label: 'History' },
  { key: 'donate', icon: 'volunteer-activism', label: 'Donate', badge: 1 },
  { key: 'profile', icon: 'person-outline', label: 'Profile' },
] as const;

const demoImageUri =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2Z0XcAAAAASUVORK5CYII=';

const sidebarItems = [
  { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', active: true },
  { key: 'profile', icon: 'person', label: 'My Profile' },
  { key: 'family', icon: 'group', label: 'Family' },
  { key: 'events', icon: 'event', label: 'Events' },
  { key: 'donations', icon: 'volunteer-activism', label: 'Donations' },
  { key: 'news', icon: 'newspaper', label: 'News' },
  { key: 'matrimony', icon: 'favorite', label: 'Matrimony' },
  { key: 'transactions', icon: 'payments', label: 'My Transactions' },
  { key: 'chats', icon: 'chat', label: 'Chats' },
  { key: 'notifications', icon: 'notifications', label: 'Notifications' },
  { key: 'birthdays', icon: 'cake', label: 'Birthdays' },
];

const updatedSidebarItems = [
  { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', active: true },
  { key: 'profile', icon: 'person', label: 'My Profile' },
  { key: 'directory', icon: 'person-search', label: 'Member Directory' },
  { key: 'trustees', icon: 'supervisor-account', label: 'Trustees' },
  { key: 'donations', icon: 'volunteer-activism', label: 'Donations' },
  { key: 'news', icon: 'newspaper', label: 'News' },
  { key: 'matrimony', icon: 'favorite', label: 'Matrimony' },
  { key: 'transactions', icon: 'payments', label: 'My Transactions' },
  { key: 'chats', icon: 'chat', label: 'Chats' },
  { key: 'notifications', icon: 'notifications', label: 'Notifications' },
  { key: 'birthdays', icon: 'cake', label: 'Birthdays' },
];

const demoSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  phone: Yup.string().min(10, 'Enter a valid phone number').required('Phone is required'),
  search: Yup.string(),
  otp: Yup.string().min(4, 'Enter the OTP'),
  gender: Yup.string().required('Select a gender'),
  plan: Yup.string().required('Select a plan'),
  contactMode: Yup.string().required('Select a contact mode'),
  dateOfBirth: Yup.date().required('Select a date'),
  amount: Yup.number().typeError('Enter an amount').required('Amount is required'),
  agree: Yup.boolean().oneOf([true], 'Accept the terms to continue'),
  document: Yup.mixed().nullable(),
});

export function DesignSystemShowcaseScreen() {
  const router = useRouter();
  const { show } = useNotifications();
  const [activeBottomKey, setActiveBottomKey] = useState('profile');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [controlledSearch, setControlledSearch] = useState('');
  const [controlledGender, setControlledGender] = useState('male');
  const [controlledMode, setControlledMode] = useState('sms');
  const [controlledPlan, setControlledPlan] = useState('premium');
  const [controlledDate, setControlledDate] = useState<Date | undefined>(new Date('1994-06-14'));
  const [controlledTime, setControlledTime] = useState<Date | undefined>(new Date());
  const [controlledAmount, setControlledAmount] = useState<number | ''>(1100);
  const [controlledOtp, setControlledOtp] = useState('1234');
  const [activeTabsKey, setActiveTabsKey] = useState('all');

  return (
    <UserScreen
      header={{
        variant: 'back-title-action',
        title: 'Design System Showcase',
        onBackPress: () => router.back(),
        rightActions: [
          <IconButton
            key="toast"
            icon="notifications-none"
            bordered
            onPress={() => show('info', 'Toast preview', 'Notification system is wired and working.')}
          />,
        ],
      }}
      hero={<ProgressStepper currentStep={3} totalSteps={4} />}
      bottomBarItems={bottomBarItems as unknown as Parameters<typeof UserBottomBar>[0]['items']}
      activeBottomBarKey={activeBottomKey}
      onBottomBarPress={(item) => setActiveBottomKey(item.key)}>
      <ScreenSection>
        <Text variant="h3">Shared Components</Text>
        <Text variant="body" color={colors.text.secondary}>
          Live preview of the reusable user-facing design system, reference screens, and shared interaction states.
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing[3], flexWrap: 'wrap' }}>
          <Link href="/finance/donation-management" asChild>
            <Pressable>
              <Badge label="Donation Management" />
            </Pressable>
          </Link>
          <Link href="/dashboard/dashboard-id-card" asChild>
            <Pressable>
              <Badge label="Dashboard & ID Card" variant="warning" />
            </Pressable>
          </Link>
          <Link href="/registration-kyc" asChild>
            <Pressable>
              <Badge label="Registration & KYC" variant="success" />
            </Pressable>
          </Link>
        </View>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Header Variants">
          <View style={{ gap: spacing[4] }}>
            <Text variant="caption" color={colors.text.muted}>
              `AppHeader` review variants
            </Text>
            <AppHeader variant="back" title="Member Directory" />
            <AppHeader variant="centered" title="Family Management" />
            <AppHeader variant="menu-notification" title="Indian Cobbler Community" />
            <AppHeader
              variant="title-action"
              title="Notifications"
              actions={[
                { key: 'search', icon: 'search' },
                { key: 'more', icon: 'more-vert', variant: 'outlined' },
              ]}
            />
            <AppHeader variant="brand" title="ICC Digital ID" subtitle="Reference from dashboard family" />
            <AppHeader variant="back" title="Transparent Header" subtitle="with subtitle" transparent />
            <AppHeader variant="title-action" title="Custom Icons" leftIcon="menu" rightIcon="share" />
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Sidebar Variants">
          <View style={{ gap: spacing[4] }}>
            <Text variant="caption" color={colors.text.muted}>
              Extracted from `Main Navigation Menu` and `Main Navigation Menu Updated`.
            </Text>
            <View style={{ gap: spacing[4], alignItems: 'flex-start' }}>
              <AppSidebar
                variant="default"
                profileName="Rajesh Kumar"
                items={sidebarItems}
                profileImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAFIUGZScdKNNMxDULnezEx5rj8pEQ2j4rbAeEkx4t3PaCU9ZyOTNSkvXCvZkDQrKLBSf4pUkLslr1IqWQp9gyj2fdGAQhXOFAkCW31Gj5C9L4UvcbzAjmtagVn5-tgErJszr_SHSuZAtkEDv3yMokBWg-SNYVUZevz1VESP7PhF4ab4KtO6kzydCmm0SoC9JJOm4QKipR3H8kvz_uSNGPqzedy2Zy7Fai_nbI9yNO3q_fFaaYiDxFFdA7tjg9-8GkKYTTksfVvRwk9"
              />
              <AppSidebar
                variant="updated"
                profileName="Rajesh Kumar"
                items={updatedSidebarItems}
                profileImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAFIUGZScdKNNMxDULnezEx5rj8pEQ2j4rbAeEkx4t3PaCU9ZyOTNSkvXCvZkDQrKLBSf4pUkLslr1IqWQp9gyj2fdGAQhXOFAkCW31Gj5C9L4UvcbzAjmtagVn5-tgErJszr_SHSuZAtkEDv3yMokBWg-SNYVUZevz1VESP7PhF4ab4KtO6kzydCmm0SoC9JJOm4QKipR3H8kvz_uSNGPqzedy2Zy7Fai_nbI9yNO3q_fFaaYiDxFFdA7tjg9-8GkKYTTksfVvRwk9"
              />
            </View>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Non-Orange Families">
          <View style={{ gap: spacing[5] }}>
            <Text variant="caption" color={colors.text.muted}>
              Shared components extracted from the remaining non-orange page families. Original page snapshots are preserved in `ref/pages`.
            </Text>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">Analytics Cards</Text>
              <AnalyticsStatCard title="Active Users" value="18,420" variant="accent" />
              <AnalyticsStatCard title="Monthly Donations" value="₹12.6L" variant="success" />
              <AnalyticsStatCard title="Event Registrations" value="4,821" variant="purple" />
              <AnalyticsChartCard
                title="Traffic Trend"
                bars={[
                  { label: 'Mon', value: 60 },
                  { label: 'Tue', value: 92, tone: 'muted' },
                  { label: 'Wed', value: 74 },
                  { label: 'Thu', value: 118, tone: 'muted' },
                  { label: 'Fri', value: 86 },
                  { label: 'Sat', value: 132, tone: 'muted' },
                  { label: 'Sun', value: 120 },
                ]}
              />
            </View>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">Premium Matrimony</Text>
              <PremiumBannerCard
                title="Direct Family Connect"
                description="Unlock verified contacts and priority introductions."
                variant="dark"
              />
              <PremiumBannerCard
                title="Family Verified Profiles"
                description="Shortlisted matches curated for community values."
                variant="light"
              />
              <MatchCard
                variant="discovery"
                name="Ananya Verma"
                age="24"
                profileId="CM-2048"
                verified
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuB9iCxLgwWHNZN_5rM31mENUKiEbhCFskqk56xYxaS1k6tCzlcwlyN_PgvVr2h7y6fF8YvfAe8DB5La1ktE-s3aZb7sXQ8bUtHkcZelCV4qPdh2wY8WZCwEtT4CxKfQz7EnTjNkw4F0n8Fd4v9PTxblV1b6zBs9DAhyY_K79IrPR-m2KGd7f1h5ZsOXiWDZdQw0QBC8q4ArwP4W9qFVcRrX8l7ZEZXHcC6jA6vFVVxftV5pMs8rkG7ufEqAHNw5B0eQ0tt3j77zbU"
                chips={['MBA', 'Vadodara', 'Family Business', 'Online']}
                description="Warm, grounded, and family-oriented. Looking for a respectful partner with shared community values."
              />
              <MatchCard
                variant="compact"
                name="Riya Desai"
                age="26"
                description="Architect • Ahmedabad"
              />
            </View>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">Publication Archive</Text>
              <ArchiveIssueCard
                title="Samaj Sandesh 1"
                edition="January 2024 Edition"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCSl9YRUjVQJb5PjHq0KpNqjap3jB57Q4L-nd8_TsUtC6P9IJ9uiSqq6ajh-0n1wL2tYlYuYa5n5Wf1N2e4ajA2rYyl7Cyk2z6fxdqW0qg4tqPiEINw5ZzvR11Oa5z6cCeS9bGm4eDk9GVkfrK1Fow_1g"
              />
            </View>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Legacy Header Reference">
          <View style={{ gap: spacing[4] }}>
            <UserHeader variant="back-title" title="Back Title" onBackPress={() => undefined} />
            <UserHeader variant="centered-title" title="Centered Title" showBack onBackPress={() => undefined} />
            <UserHeader
              variant="logo-title-actions"
              title="Logo Title"
              logoComponent={<Avatar name="Orange Brand" size="sm" />}
              rightActions={[<IconButton key="search" icon="search" bordered />, <IconButton key="more" icon="more-vert" bordered />]}
            />
            <UserHeader variant="title-subtitle" title="Title With Subtitle" subtitle="Shared for user-facing pages" />
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Button Variants">
          <View style={{ gap: spacing[4] }}>
            <Text variant="caption" color={colors.text.muted}>
              `Button` review variants and states
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing[3], flexWrap: 'wrap' }}>
              <Button leftIcon={<Icon name="add" color={colors.text.inverse} />}>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button rounded>Rounded</Button>
              <Button rightIcon={<Icon name="arrow-forward" color={colors.text.inverse} />}>Right Icon</Button>
            </View>
            <View style={{ flexDirection: 'row', gap: spacing[3], flexWrap: 'wrap' }}>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <View style={{ width: '100%' }}>
                <Button fullWidth>Full Width</Button>
              </View>
            </View>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Icon Button Variants">
          <View style={{ gap: spacing[4] }}>
            <Text variant="caption" color={colors.text.muted}>
              `IconButton` review variants and sizes
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing[3], flexWrap: 'wrap' }}>
              <IconButton icon="arrow-back" variant="plain" />
              <IconButton icon="notifications" variant="soft" />
              <IconButton icon="search" variant="outlined" />
              <IconButton icon="add" variant="filled" />
              <IconButton icon="close" variant="outlined" disabled />
              <IconButton icon="menu" backgroundColor={colors.primary.DEFAULT} color={colors.text.inverse} />
            </View>
            <View style={{ flexDirection: 'row', gap: spacing[3], flexWrap: 'wrap' }}>
              <IconButton icon="menu" size="sm" variant="soft" />
              <IconButton icon="menu" size="md" variant="soft" />
              <IconButton icon="menu" size="lg" variant="soft" />
            </View>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Badge Variants">
          <View style={{ gap: spacing[4] }}>
            <View style={{ flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' }}>
              <Badge label="Default" />
              <Badge label="Success" variant="success" />
              <Badge label="Warning" variant="warning" />
              <Badge label="Error" variant="error" />
            </View>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Card Variants">
          <View style={{ gap: spacing[4] }}>
            <View style={{ gap: spacing[3] }}>
              <Card variant="default">
                <Text variant="h5">Default Card</Text>
                <Text variant="body" color={colors.text.secondary}>
                  Standard surface for section content and list items.
                </Text>
              </Card>
              <Card variant="elevated">
                <Text variant="h5">Elevated Card</Text>
              </Card>
              <Card variant="primary">
                <Text variant="h5" color={colors.text.inverse}>
                  Primary Card
                </Text>
              </Card>
              <Card variant="outlined">
                <Text variant="h5">Outlined Card</Text>
              </Card>
              <Card variant="muted">
                <Text variant="h5">Muted Card</Text>
              </Card>
              <Card padding="none">
                <View style={{ padding: spacing[4] }}>
                  <Text variant="h5">No Padding Card</Text>
                </View>
              </Card>
              <Card padding="sm">
                <Text variant="h5">Small Padding Card</Text>
              </Card>
              <Card padding="lg">
                <Text variant="h5">Large Padding Card</Text>
              </Card>
              <Card onPress={() => show('info', 'Card pressed', 'Pressable card variant preview.')}>
                <Text variant="h5">Pressable Card</Text>
              </Card>
            </View>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Orange Page Components">
          <View style={{ gap: spacing[5] }}>
            <Text variant="caption" color={colors.text.muted}>
              Built only from orange-family pages: dashboard/id-card, community hub, trustees, member directory, notifications.
            </Text>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">FeatureCard Variants</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[4] }}>
                <FeatureCard variant="dashboard" title="Matrimony" subtitle="Find matches" icon="favorite-border" />
                <FeatureCard variant="compact" title="Events" subtitle="Join now" icon="event" />
                <FeatureCard variant="shortcut" title="Member Directory" subtitle="Browse members" icon="groups" />
                <FeatureCard variant="promo" title="Community Updates" subtitle="Latest news" icon="campaign" />
              </View>
            </View>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">DigitalIdCard Variants</Text>
              <DigitalIdCard
                variant="full"
                memberName="Rajesh Kumar"
                memberId="IC-2024-8839"
                location="Mumbai, Maharashtra"
                validity="Dec 2030"
                photo={memberImage}
              />
              <DigitalIdCard
                variant="compact"
                memberName="Sunita Devi"
                memberId="IC-2024-7712"
                location="Agra, Uttar Pradesh"
                validity="Jan 2031"
                photo={memberImage}
              />
            </View>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">SpotlightFeature Variants</Text>
              <SpotlightFeature
                variant="publication"
                title="The Future of Sustainable Soling"
                subtitle="Issue #42 • October 2023"
                description="Featuring interviews with master craftsmen from Kanpur and Kolhapur."
                ctaLabel="Download PDF"
              />
              <SpotlightFeature
                variant="promo"
                title="Direct Family Connect"
                subtitle="Premium"
                description="Unlock verified contacts and priority introductions."
              />
              <SpotlightFeature
                variant="ad"
                title="Community Business Spotlight"
                subtitle="Sponsored"
                description="Promote your workshop or service to the community."
                ctaLabel="View Offer"
              />
            </View>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">ProfileCard Variants</Text>
              <ProfileCard
                variant="member"
                name="Amit Saxena"
                location="Indiranagar, Bengaluru"
                role="Premium Repair Service"
                online
              />
              <ProfileCard
                variant="trustee"
                name="Rajesh Kumar"
                role="President"
                location="Dharavi, Mumbai"
                actionLabel="Contact"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuChyppuEfoR_oulSP7SpTqR0KbYFrXSuZFvmUTWjwqQjPucOXNjFtaaTuTpAD5gAu_GxT8CJef38XhKbNsRtmtivrkqVHt--Up8gsMczcmqWWvUyBzOxCThpBToXGFGJauTPJpjaYcqgRfZDCWSpprhX5L38zHLhEt0Kj3KIabLh9EcBqUT7tZtevekd0RADGEAMtk2A5DCt-k0tLCwepAO9YHiZV-SA26h4u7L0XLkGxniuWkNCnbQzb3G7PuaHh4VDCPilrGAWevT"
              />
              <ProfileCard
                variant="family"
                name="Sunita Devi"
                role="Spouse • 38 Years"
                badge="Primary"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDHrtPEuMZlpn5_Y12Gvx3BRmFuUdjcKSKjKsViZMh-LNLBNnzPwssmK5yhdf9QprdvWnuG2l1asGEZ96qSfDVirGcRY9Uppa_Za07RcRTnJdal0fmI_aVwUupyIDxXj2kDR7d3ZQh_DIzJh4zOljp4sy6IU5L2aJoZ1-L3K8ptezmcsH5FQHsn9UJJ0BMX1M1EbB2ZWIHa_6_AUOI20A0S2gua9zd6vw6luqJoup3xBxI2EvWpwq_AFHVuxP80JwD2iv3ZqKhwU_ey"
              />
            </View>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">NotificationCard Variants</Text>
              <NotificationCard
                variant="default"
                title="Community meeting scheduled"
                description="Annual gathering starts at 6:30 PM in the community hall."
                time="2h ago"
                tag="Meeting"
              />
              <NotificationCard
                variant="unread"
                title="KYC approved"
                description="Your profile verification is complete."
                time="Just now"
                tag="KYC"
              />
              <NotificationCard
                variant="muted"
                title="Directory synced"
                description="Yesterday's notification treatment from the orange notification screen."
                time="Yesterday"
                tag="Directory"
              />
              <NotificationCard
                variant="media"
                title="Festival preparations begin"
                description="Volunteers gathered to set up the event grounds."
                time="Today"
                tag="Community"
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuBbBZ6bAL9pTFyxGIHQ_srbVSot6-GKwIANSU6vI44LzBOQubHnbv_H7izcQUxSqkS2yHylvTMrnwhu2XzIkhv_-aMg2XyJHAN2Dpq9dLcTVBr7H-V2BzC7iejtRlRqq2RExrv8w-Ciur2OKaEx_h-D5onO5e4tyrkE08Asab_NxDdXyJ800oOlxHkmlUdGyphyOnuX47j17Uj2o93LS5mkhb3Ny5YXxHdX8-YQFQxMMGaAXUnuAnZxrWRkkZxo-JHr_wHyMvq4gAWc"
              />
            </View>

            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">StatHighlightCard Variants</Text>
              <StatHighlightCard
                variant="summary"
                label="Total Contribution"
                value="₹45,000"
                helper="Last updated: Oct 24, 2023"
                icon="verified"
              />
              <StatHighlightCard
                variant="accent"
                label="Members"
                value="12,500+"
                helper="Community reach"
              />
              <StatHighlightCard
                variant="dark"
                label="Featured Guild"
                value="Dharavi"
                helper="Recognized for master leather work"
              />
            </View>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Lists">
          <View style={{ gap: spacing[4] }}>
            <Tabs items={tabsItems} activeKey={activeTabsKey} onChange={setActiveTabsKey} variant="underline" />
            <Tabs
              items={[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
              ]}
              activeKey="all"
              onChange={() => undefined}
              variant="pill"
            />
            <Tabs
              items={[
                { key: 'state', label: 'State' },
                { key: 'city', label: 'City' },
                { key: 'pincode', label: 'Pincode' },
              ]}
              activeKey="state"
              onChange={() => undefined}
              variant="scroll-chip"
            />
            <FilterChips items={filterItems} activeKey={activeFilter} onPress={setActiveFilter} />
            <ListItem title="Committee Meeting" subtitle="Community hall at 6:30 PM" meta="Today" />
            <MemberListItem name="Anita Sharma" subtitle="Verified member ID 1042" location="Mumbai, Maharashtra" online />
            <MemberListItem
              variant="trustee"
              name="Rajesh Kumar"
              subtitle="President • 25 years exp"
              location="Dharavi, Mumbai"
              avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuChyppuEfoR_oulSP7SpTqR0KbYFrXSuZFvmUTWjwqQjPucOXNjFtaaTuTpAD5gAu_GxT8CJef38XhKbNsRtmtivrkqVHt--Up8gsMczcmqWWvUyBzOxCThpBToXGFGJauTPJpjaYcqgRfZDCWSpprhX5L38zHLhEt0Kj3KIabLh9EcBqUT7tZtevekd0RADGEAMtk2A5DCt-k0tLCwepAO9YHiZV-SA26h4u7L0XLkGxniuWkNCnbQzb3G7PuaHh4VDCPilrGAWevT"
            />
            <MemberListItem
              variant="chat"
              name="Footwear Suppliers Group"
              subtitle="Bulk prices updated for leather sheets"
              location="09:24"
              avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAST3OehLKpOvus-yLkhjx5q7Fy-w2Cix7kNhFZxK-kpP4RM9Gk-06Z22RVaj4l_7pHT8BGBbbDhdEhlxS_Oj0XHN4qAjqYBurRMfrybLRX-XAGiKiZNq9ItPwFQlCZKb5ZlPrwQH_RJcqVN64lZFxkk327Hww7lyePbVixzY2qtnozQyOg1EsjJjStSqOqGc6vXQOWSaer_DRqGoY3H0B_tF4Y8u3M9XCCMYY4N4MVS3LAsZoKIOJGulONFrvQaBpe4fLB5pNFexsX"
              online
              actionLabel="3"
            />
            <NotificationItem title="KYC approved" subtitle="Your profile verification is complete." />
            <TransactionItem
              variant="summary"
              title="Total Contribution"
              subtitle="Last updated: Oct 24, 2023"
              amount="₹1,250.00"
              meta="Total Contribution"
            />
            <TransactionItem
              variant="history"
              title="Temple Donation"
              subtitle="Oct 24, 2023 • Temple Fund"
              amount="₹2,500"
              icon="volunteer-activism"
              bg="rgba(24,168,117,0.1)"
              tone={colors.primary.DEFAULT}
            />
            <ContentFeedCard
              variant="publication"
              title="The Future of Sustainable Soling"
              eyebrow="Issue #42 • October 2023"
              description="Featuring interviews with master craftsmen from Kanpur and Kolhapur."
              ctaLabel="Download PDF"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBbBZ6bAL9pTFyxGIHQ_srbVSot6-GKwIANSU6vI44LzBOQubHnbv_H7izcQUxSqkS2yHylvTMrnwhu2XzIkhv_-aMg2XyJHAN2Dpq9dLcTVBr7H-V2BzC7iejtRlRqq2RExrv8w-Ciur2OKaEx_h-D5onO5e4tyrkE08Asab_NxDdXyJ800oOlxHkmlUdGyphyOnuX47j17Uj2o93LS5mkhb3Ny5YXxHdX8-YQFQxMMGaAXUnuAnZxrWRkkZxo-JHr_wHyMvq4gAWc"
            />
            <ContentFeedCard
              variant="event"
              title="Annual Community Gathering"
              meta="Community Hall, Mumbai"
              ctaLabel="Register Now"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuDNS0sVC7BSnU542xnAFxv0_ihDrDSxmpes7lsfvwxvsS_nplXlHG4Vf5m22mPnycg-r1DjhK3XgeOcpcq5pSFZzBl-0L8wmoN_zDrRMc7pqHuEzDow9Ei2D4dnMi6eiA2y1iC6GCh7tDpwZ5s3iWjAiCEubMkm92Px2wXdub7VW6JnEAS7ccaA3ny4bUZcCyzZQXm5OOs99X5Pw6tVOiFQozfiGRwLPW9fpqCltKQ8peR8voPtpEgeS5kto7BIpNB_n-Oaky7nkFEB"
              dateBadge={{ month: 'NOV', day: '24' }}
              tags={[
                { label: 'Family', icon: 'group', color: colors.primary.DEFAULT, bg: colors.primary.subtle },
                { label: 'Paid', icon: 'payments', color: '#00504b', bg: '#e5f5f2' },
              ]}
            />
            <ContentFeedCard
              variant="news"
              title="Health Insurance Drive Started"
              description="Community welfare board has opened new registrations for eligible members."
              meta="5 days ago"
              eyebrow="Announcement"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBbBZ6bAL9pTFyxGIHQ_srbVSot6-GKwIANSU6vI44LzBOQubHnbv_H7izcQUxSqkS2yHylvTMrnwhu2XzIkhv_-aMg2XyJHAN2Dpq9dLcTVBr7H-V2BzC7iejtRlRqq2RExrv8w-Ciur2OKaEx_h-D5onO5e4tyrkE08Asab_NxDdXyJ800oOlxHkmlUdGyphyOnuX47j17Uj2o93LS5mkhb3Ny5YXxHdX8-YQFQxMMGaAXUnuAnZxrWRkkZxo-JHr_wHyMvq4gAWc"
            />
            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">StoryAvatar Variants</Text>
              <View style={{ flexDirection: 'row', gap: spacing[4], flexWrap: 'wrap' }}>
                <StoryAvatar
                  label="Workshop"
                  active
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuAST3OehLKpOvus-yLkhjx5q7Fy-w2Cix7kNhFZxK-kpP4RM9Gk-06Z22RVaj4l_7pHT8BGBbbDhdEhlxS_Oj0XHN4qAjqYBurRMfrybLRX-XAGiKiZNq9ItPwFQlCZKb5ZlPrwQH_RJcqVN64lZFxkk327Hww7lyePbVixzY2qtnozQyOg1EsjJjStSqOqGc6vXQOWSaer_DRqGoY3H0B_tF4Y8u3M9XCCMYY4N4MVS3LAsZoKIOJGulONFrvQaBpe4fLB5pNFexsX"
                />
                <StoryAvatar
                  label="Events"
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuBbBZ6bAL9pTFyxGIHQ_srbVSot6-GKwIANSU6vI44LzBOQubHnbv_H7izcQUxSqkS2yHylvTMrnwhu2XzIkhv_-aMg2XyJHAN2Dpq9dLcTVBr7H-V2BzC7iejtRlRqq2RExrv8w-Ciur2OKaEx_h-D5onO5e4tyrkE08Asab_NxDdXyJ800oOlxHkmlUdGyphyOnuX47j17Uj2o93LS5mkhb3Ny5YXxHdX8-YQFQxMMGaAXUnuAnZxrWRkkZxo-JHr_wHyMvq4gAWc"
                />
                <StoryAvatar
                  label="Trustees"
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuChyppuEfoR_oulSP7SpTqR0KbYFrXSuZFvmUTWjwqQjPucOXNjFtaaTuTpAD5gAu_GxT8CJef38XhKbNsRtmtivrkqVHt--Up8gsMczcmqWWvUyBzOxCThpBToXGFGJauTPJpjaYcqgRfZDCWSpprhX5L38zHLhEt0Kj3KIabLh9EcBqUT7tZtevekd0RADGEAMtk2A5DCt-k0tLCwepAO9YHiZV-SA26h4u7L0XLkGxniuWkNCnbQzb3G7PuaHh4VDCPilrGAWevT"
                />
              </View>
            </View>
            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">TemplateCard Variants</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[4] }}>
                <TemplateCard
                  title="Classic Wishes"
                  selected
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuDNS0sVC7BSnU542xnAFxv0_ihDrDSxmpes7lsfvwxvsS_nplXlHG4Vf5m22mPnycg-r1DjhK3XgeOcpcq5pSFZzBl-0L8wmoN_zDrRMc7pqHuEzDow9Ei2D4dnMi6eiA2y1iC6GCh7tDpwZ5s3iWjAiCEubMkm92Px2wXdub7VW6JnEAS7ccaA3ny4bUZcCyzZQXm5OOs99X5Pw6tVOiFQozfiGRwLPW9fpqCltKQ8peR8voPtpEgeS5kto7BIpNB_n-Oaky7nkFEB"
                />
                <TemplateCard
                  title="Festive Blessings"
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuBbBZ6bAL9pTFyxGIHQ_srbVSot6-GKwIANSU6vI44LzBOQubHnbv_H7izcQUxSqkS2yHylvTMrnwhu2XzIkhv_-aMg2XyJHAN2Dpq9dLcTVBr7H-V2BzC7iejtRlRqq2RExrv8w-Ciur2OKaEx_h-D5onO5e4tyrkE08Asab_NxDdXyJ800oOlxHkmlUdGyphyOnuX47j17Uj2o93LS5mkhb3Ny5YXxHdX8-YQFQxMMGaAXUnuAnZxrWRkkZxo-JHr_wHyMvq4gAWc"
                />
              </View>
            </View>
            <View style={{ gap: spacing[3] }}>
              <Text variant="h5">EventPassCard</Text>
              <EventPassCard
                name="Rajesh Kumar"
                eventTitle="Global Tech Summit 2024"
                qrImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDdDhECAUB7AhCKz1tCrwNmPLX7NleJ3NGLV4mRCji6JEkot8L0Qw5yWIM0Q27XwUwloot8kMEvBzE7rwzNTMW0rNGRrGW5FhrdL9JNuK4LNC2Gir5DCGQIqIXU5Co5XRs8aU5ntswx6WOO7lddlxwVjEFZLfrJw2x0oima_LaEQh5f1QFnhVSPVoVUI2iEbVAEP_-sH8bzp7078PgaK91EuBkWLUu2Ekjz7K-bceWDQd_4rFv6mTqry2mSIcLR8CMcdUBZSogeSse5"
                addOns={[
                  { icon: 'restaurant', title: 'Lunch Buffet' },
                  { icon: 'groups', title: 'Networking Dinner' },
                ]}
              />
            </View>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Feedback States">
          <View style={{ gap: spacing[4] }}>
            <EmptyState
              title="No donations yet"
              description="Use the shared empty state for fresh sections and blank dashboards."
              action={{ label: 'Trigger Toast', onPress: () => show('success', 'Action complete', 'Empty state action executed.') }}
            />
            <ErrorState
              title="Unable to load records"
              description="This is the standardized retry surface for user-facing data errors."
              onRetry={() => show('warning', 'Retry tapped', 'Reconnect your API handler here.')}
            />
            <SkeletonCard />
            <SkeletonForm fields={4} />
            <Button
              variant="outline"
              onPress={() => {
                setShowLoadingOverlay(true);
                setTimeout(() => setShowLoadingOverlay(false), 1200);
              }}>
              Toggle Loading Overlay
            </Button>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Motion Primitives">
          <View style={{ gap: spacing[4] }}>
            <FadeIn>
              <Card variant="muted">
                <Text variant="bodyLg">FadeIn</Text>
              </Card>
            </FadeIn>
            <SlideIn direction="right">
              <Card variant="muted">
                <Text variant="bodyLg">SlideIn</Text>
              </Card>
            </SlideIn>
            <SlideUp>
              <Card variant="muted">
                <Text variant="bodyLg">SlideUp</Text>
              </Card>
            </SlideUp>
            <AnimatedPressable onPress={() => show('info', 'Animated pressable', 'Press feedback is working.')}>
              <Card variant="outlined">
                <Text variant="bodyLg">AnimatedPressable</Text>
              </Card>
            </AnimatedPressable>
            <StaggeredList>
              {[
                <Card key="1" variant="muted"><Text>Stagger item 1</Text></Card>,
                <Card key="2" variant="muted"><Text>Stagger item 2</Text></Card>,
                <Card key="3" variant="muted"><Text>Stagger item 3</Text></Card>,
              ]}
            </StaggeredList>
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Form Components">
          <Formik
            initialValues={{
              fullName: '',
              phone: '',
              search: '',
              otp: '',
              gender: '',
              plan: 'basic',
              contactMode: 'call',
              dateOfBirth: undefined,
              amount: '',
              agree: false,
              document: null,
            }}
            validationSchema={demoSchema}
            onSubmit={async (values, actions) => {
              show('success', 'Form submitted', `Captured ${values.fullName || 'demo'} successfully.`);
              actions.setSubmitting(false);
            }}>
            <View style={{ gap: spacing[4] }}>
              <FormSection
                title="Identity"
                description="Primary text, phone, OTP, and compact input variants from the orange member pages."
                variant="soft">
                <TextField name="fullName" label="Full Name" placeholder="Enter full name" required />
                <TextField
                  label="Filled Variant"
                  placeholder="Soft orange field"
                  variant="filled"
                  value="Community Member"
                  onChangeText={() => undefined}
                />
                <TextField
                  label="Compact Variant"
                  placeholder="Compact field"
                  variant="compact"
                  value="Son"
                  onChangeText={() => undefined}
                />
                <PhoneInput name="phone" />
                <OTPInput name="otp" length={4} helperText="Resend OTP in 0:45" />
                <OTPInput label="Controlled OTP" length={4} value={controlledOtp} onChange={setControlledOtp} />
              </FormSection>

              <Divider />

              <FormSection title="Preferences" variant="highlight">
                <SearchInput name="search" placeholder="Search anything" />
                <SearchInput
                  label="Controlled Search"
                  value={controlledSearch}
                  onChangeText={setControlledSearch}
                  placeholder="Search members, notifications, trustees"
                />
                <RadioGroup
                  name="gender"
                  label="Gender"
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ]}
                />
                <RadioGroup
                  label="Horizontal Radio"
                  orientation="horizontal"
                  value={controlledGender}
                  onChange={setControlledGender}
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ]}
                />
                <SegmentedControl
                  name="contactMode"
                  options={[
                    { label: 'Call', value: 'call' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'Email', value: 'email' },
                  ]}
                />
                <SegmentedControl
                  value={controlledMode}
                  onChange={setControlledMode}
                  variant="pill"
                  options={[
                    { label: 'Call', value: 'call' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'Email', value: 'email' },
                  ]}
                />
                <DateField name="dateOfBirth" label="Date of Birth" maximumDate={new Date()} />
                <DateField label="Controlled Date" value={controlledDate} onChange={setControlledDate} />
                <DateField label="Time Picker" mode="time" value={controlledTime} onChange={setControlledTime} />
              </FormSection>

              <Divider />

              <FormSection title="Selection and Upload">
                <SelectField
                  name="plan"
                  label="Membership Plan"
                  options={[
                    { label: 'Basic', value: 'basic' },
                    { label: 'Premium', value: 'premium' },
                    { label: 'Family', value: 'family' },
                  ]}
                />
                <SelectField
                  label="Plan Pills"
                  value={controlledPlan}
                  onSelect={setControlledPlan}
                  variant="pill"
                  options={[
                    { label: 'Basic', value: 'basic' },
                    { label: 'Premium', value: 'premium' },
                    { label: 'Family', value: 'family' },
                  ]}
                />
                <FileUpload
                  name="document"
                  label="Upload verification document"
                  helperText="Aadhaar, school certificate, caste proof, etc."
                />
                <FileUpload
                  label="Card Upload Variant"
                  variant="card"
                  value={{ uri: 'demo://kyc', name: 'sample-kyc.pdf' }}
                  onChange={() => undefined}
                  helperText="Soft card layout"
                />
                <FileUpload
                  label="Compact Upload Variant"
                  variant="compact"
                  value={{ uri: demoImageUri, name: 'profile-photo.jpg' }}
                  onChange={() => undefined}
                  helperText="Compact upload row"
                />
              </FormSection>

              <Divider />

              <FormSection
                title="Amounts and Actions"
                footer={
                  <SubmitBar
                    primaryAction={{ label: 'Save Member' }}
                    secondaryAction={{ label: 'Cancel', variant: 'outline' }}
                  />
                }>
                <AmountSelector name="amount" label="Formik Amount" amounts={[501, 1100, 2100, 5100]} />
                <AmountSelector
                  label="Controlled Presets"
                  presets={[100, 500, 1000]}
                  value={controlledAmount}
                  onChange={setControlledAmount}
                  variant="grid"
                />
                <Checkbox
                  name="agree"
                  label="I agree to the terms and community guidelines"
                  description="Required for registration and community consent."
                />
                <Checkbox
                  label="Controlled Checkbox"
                  checked
                  description="Preview of label plus description layout."
                  onChange={() => undefined}
                />
              </FormSection>

              <FormSection title="Submit Variants" variant="soft">
                <SubmitButton label="Submit Demo Form" />
                <SubmitButton label="Outline Submit" variant="outline" />
                <SubmitBar
                  primaryAction={{ label: 'Record Donation' }}
                  secondaryAction={{ label: 'Back', variant: 'soft' }}
                  sticky
                />
              </FormSection>
            </View>
          </Formik>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Bottom Bar Variants">
          <View style={{ gap: spacing[3] }}>
            <Text variant="caption" color={colors.text.muted}>
              `AppBottomBar` review variants
            </Text>
            <AppBottomBar
              items={bottomBarItems}
              activeKey={activeBottomKey}
              onChange={setActiveBottomKey}
              variant="member"
            />
            <AppBottomBar
              items={communityBottomBarItems}
              activeKey="directory"
              onChange={() => undefined}
              variant="community"
            />
            <AppBottomBar
              items={financeBottomBarItems}
              activeKey="donate"
              onChange={() => undefined}
              variant="finance"
            />
            <AppBottomBar
              items={communityBottomBarItems}
              activeKey="events"
              onChange={() => undefined}
              variant="minimal"
              showLabels={false}
            />
          </View>
        </SectionCard>
      </ScreenSection>

      <ScreenSection>
        <SectionCard title="Legacy Bottom Bar Reference">
          <View style={{ gap: spacing[3] }}>
            <Text variant="body" color={colors.text.secondary}>
              Existing bottom bar reference for comparison.
            </Text>
            <UserBottomBar
              items={bottomBarItems as unknown as Parameters<typeof UserBottomBar>[0]['items']}
              activeKey={activeBottomKey}
              onItemPress={(item) => setActiveBottomKey(item.key)}
            />
          </View>
        </SectionCard>
      </ScreenSection>

      <LoadingOverlay visible={showLoadingOverlay} />
    </UserScreen>
  );
}
