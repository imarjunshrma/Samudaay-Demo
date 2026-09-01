import type { ComponentType } from 'react';
import AdminDashboardScreen from './admin-dashboard';
import AdminDashboardAnalyticsScreen from './admin-dashboard-analytics';
import ApproveMatrimonyProfilesScreen from './approve-matrimony-profiles';
import AssignUserRoleScreen from './assign-user-role';
import BillingAndInvoicingScreen from './billing-and-invoicing';
import BirthdayRemindersScreen from './birthday-reminders';
import ChildrenSEducationDirectoryScreen from './children-s-education-directory';
import ClientConfigurationScreen from './client-configuration';
import ClientManagementScreen from './client-management';
import CommunityChatsScreen from './community-chats';
import CommunityHubScreen from './community-hub';
import CreateAdminScreen from './create-admin';
import CreateAdvertisementAdminScreen from './create-advertisement-admin';
import CreateMatrimonyProfileScreen from './create-matrimony-profile';
import CreateNewClientOrganizationScreen from './create-new-client-organization';
import CreateNewEventAdminScreen from './create-new-event-admin';
import CreateNewExpenseAdminScreen from './create-new-expense-admin';
import CreateNotificationAdminScreen from './create-notification-admin';
import DashboardAndIdCardScreen from './dashboard-and-id-card';
import DashboardWithAdPopupScreen from './dashboard-with-ad-popup';
import DashboardWithAdvertisementScreen from './dashboard-with-advertisement';
import DonationManagementScreen from './donation-management';
import EventAnalyticsScreen from './event-analytics';
import EventDetailsAndRegistrationScreen from './event-details-and-registration';
import EventDetailsWithGalleryAccessScreen from './event-details-with-gallery-access';
import EventLiveAndChatScreen from './event-live-and-chat';
import EventPerformanceDashboardScreen from './event-performance-dashboard';
import EventPhotoGalleryScreen from './event-photo-gallery';
import EventProfitAndLossStatementScreen from './event-profit-and-loss-statement';
import ExpenseManagementAdminScreen from './expense-management-admin';
import FamilyEventPassesHorizontalScreen from './family-event-passes-horizontal';
import FamilyManagementScreen from './family-management';
import GeneratePublicationAdminScreen from './generate-publication-admin';
import KycApprovalScreen from './kyc-approval';
import MainNavigationMenuUpdatedScreen from './main-navigation-menu-updated';
import MainNavigationMenuScreen from './main-navigation-menu';
import ManageCommunityTrusteesAdminScreen from './manage-community-trustees-admin';
import ManageEventsAdminScreen from './manage-events-admin';
import ManageMemberDirectoryAdminScreen from './manage-member-directory-admin';
import MatrimonyAnalyticsScreen from './matrimony-analytics';
import MatrimonyDiscoveryScreen from './matrimony-discovery';
import MatrimonyDiscovery2Screen from './matrimony-discovery2';
import MemberDirectoryScreen from './member-directory';
import MonthlyPublicationsArchiveScreen from './monthly-publications-archive';
import MyEventsListScreen from './my-events-list';
import MyProfileScreen from './my-profile';
import MyTransactionsMemberScreen from './my-transactions-member';
import NotificationsScreen from './notifications';
import PeopleAnalyticsScreen from './people-analytics';
import QrScannerAttendanceAndAddOnsScreen from './qr-scanner-attendance-and-add-ons';
import RecordManualDonationScreen from './record-manual-donation';
import RegistrationAndKycScreen from './registration-and-kyc';
import RoleManagementAndPermissionsScreen from './role-management-and-permissions';
import SendBirthdayCardScreen from './send-birthday-card';
import SplashScreen1Screen from './splash-screen-1';
import TransactionAnalyticsScreen from './transaction-analytics';
import TransactionManagementAdminScreen from './transaction-management-admin';
import TrusteesScreen from './trustees';
import UnifiedCommunityDashboardScreen from './unified-community-dashboard';
import UploadMarksheetScreen from './upload-marksheet';
import YearlyProfitAndLossStatementScreen from './yearly-profit-and-loss-statement';

export interface GeneratedHtmlScreenEntry {
  slug: string;
  title: string;
  component: ComponentType;
}

export const generatedHtmlScreens: GeneratedHtmlScreenEntry[] = [
  {
    slug: 'admin-dashboard',
    title: "Admin Dashboard",
    component: AdminDashboardScreen,
  },
  {
    slug: 'admin-dashboard-analytics',
    title: "Admin Dashboard Analytics",
    component: AdminDashboardAnalyticsScreen,
  },
  {
    slug: 'approve-matrimony-profiles',
    title: "Approve Matrimony Profiles",
    component: ApproveMatrimonyProfilesScreen,
  },
  {
    slug: 'assign-user-role',
    title: "Assign User Role",
    component: AssignUserRoleScreen,
  },
  {
    slug: 'billing-and-invoicing',
    title: "Billing & Invoicing",
    component: BillingAndInvoicingScreen,
  },
  {
    slug: 'birthday-reminders',
    title: "Birthday Reminders",
    component: BirthdayRemindersScreen,
  },
  {
    slug: 'children-s-education-directory',
    title: "Children's Education Directory",
    component: ChildrenSEducationDirectoryScreen,
  },
  {
    slug: 'client-configuration',
    title: "Client Configuration",
    component: ClientConfigurationScreen,
  },
  {
    slug: 'client-management',
    title: "Client Management",
    component: ClientManagementScreen,
  },
  {
    slug: 'community-chats',
    title: "Community Chats",
    component: CommunityChatsScreen,
  },
  {
    slug: 'community-hub',
    title: "Community Hub",
    component: CommunityHubScreen,
  },
  {
    slug: 'create-admin',
    title: "Create Admin",
    component: CreateAdminScreen,
  },
  {
    slug: 'create-advertisement-admin',
    title: "Create Advertisement (Admin)",
    component: CreateAdvertisementAdminScreen,
  },
  {
    slug: 'create-matrimony-profile',
    title: "Create Matrimony Profile",
    component: CreateMatrimonyProfileScreen,
  },
  {
    slug: 'create-new-client-organization',
    title: "Create New Client Organization",
    component: CreateNewClientOrganizationScreen,
  },
  {
    slug: 'create-new-event-admin',
    title: "Create New Event (Admin)",
    component: CreateNewEventAdminScreen,
  },
  {
    slug: 'create-new-expense-admin',
    title: "Create New Expense (Admin)",
    component: CreateNewExpenseAdminScreen,
  },
  {
    slug: 'create-notification-admin',
    title: "Create Notification (Admin)",
    component: CreateNotificationAdminScreen,
  },
  {
    slug: 'dashboard-and-id-card',
    title: "Dashboard & ID Card",
    component: DashboardAndIdCardScreen,
  },
  {
    slug: 'dashboard-with-ad-popup',
    title: "Dashboard with Ad Popup",
    component: DashboardWithAdPopupScreen,
  },
  {
    slug: 'dashboard-with-advertisement',
    title: "Dashboard with Advertisement",
    component: DashboardWithAdvertisementScreen,
  },
  {
    slug: 'donation-management',
    title: "Donation Management",
    component: DonationManagementScreen,
  },
  {
    slug: 'event-analytics',
    title: "Event Analytics",
    component: EventAnalyticsScreen,
  },
  {
    slug: 'event-details-and-registration',
    title: "Event Details & Registration",
    component: EventDetailsAndRegistrationScreen,
  },
  {
    slug: 'event-details-with-gallery-access',
    title: "Event Details with Gallery Access",
    component: EventDetailsWithGalleryAccessScreen,
  },
  {
    slug: 'event-live-and-chat',
    title: "Event Live & Chat",
    component: EventLiveAndChatScreen,
  },
  {
    slug: 'event-performance-dashboard',
    title: "Event Performance Dashboard",
    component: EventPerformanceDashboardScreen,
  },
  {
    slug: 'event-photo-gallery',
    title: "Event Photo Gallery",
    component: EventPhotoGalleryScreen,
  },
  {
    slug: 'event-profit-and-loss-statement',
    title: "Event Profit & Loss Statement",
    component: EventProfitAndLossStatementScreen,
  },
  {
    slug: 'expense-management-admin',
    title: "Expense Management (Admin)",
    component: ExpenseManagementAdminScreen,
  },
  {
    slug: 'family-event-passes-horizontal',
    title: "Family Event Passes (Horizontal)",
    component: FamilyEventPassesHorizontalScreen,
  },
  {
    slug: 'family-management',
    title: "Family Management",
    component: FamilyManagementScreen,
  },
  {
    slug: 'generate-publication-admin',
    title: "Generate Publication (Admin)",
    component: GeneratePublicationAdminScreen,
  },
  {
    slug: 'kyc-approval',
    title: "kyc-approval",
    component: KycApprovalScreen,
  },
  {
    slug: 'main-navigation-menu-updated',
    title: "Main Navigation Menu Updated",
    component: MainNavigationMenuUpdatedScreen,
  },
  {
    slug: 'main-navigation-menu',
    title: "Main Navigation Menu",
    component: MainNavigationMenuScreen,
  },
  {
    slug: 'manage-community-trustees-admin',
    title: "Manage Community Trustees (Admin)",
    component: ManageCommunityTrusteesAdminScreen,
  },
  {
    slug: 'manage-events-admin',
    title: "Manage Events (Admin)",
    component: ManageEventsAdminScreen,
  },
  {
    slug: 'manage-member-directory-admin',
    title: "Manage Member Directory (Admin)",
    component: ManageMemberDirectoryAdminScreen,
  },
  {
    slug: 'matrimony-analytics',
    title: "Matrimony Analytics",
    component: MatrimonyAnalyticsScreen,
  },
  {
    slug: 'matrimony-discovery',
    title: "Matrimony Discovery",
    component: MatrimonyDiscoveryScreen,
  },
  {
    slug: 'matrimony-discovery2',
    title: "Matrimony Discovery2",
    component: MatrimonyDiscovery2Screen,
  },
  {
    slug: 'member-directory',
    title: "Member Directory",
    component: MemberDirectoryScreen,
  },
  {
    slug: 'monthly-publications-archive',
    title: "Monthly Publications Archive",
    component: MonthlyPublicationsArchiveScreen,
  },
  {
    slug: 'my-events-list',
    title: "My Events List",
    component: MyEventsListScreen,
  },
  {
    slug: 'my-profile',
    title: "My Profile",
    component: MyProfileScreen,
  },
  {
    slug: 'my-transactions-member',
    title: "My Transactions (Member)",
    component: MyTransactionsMemberScreen,
  },
  {
    slug: 'notifications',
    title: "Notifications",
    component: NotificationsScreen,
  },
  {
    slug: 'people-analytics',
    title: "People Analytics",
    component: PeopleAnalyticsScreen,
  },
  {
    slug: 'qr-scanner-attendance-and-add-ons',
    title: "QR Scanner (Attendance & Add-ons)",
    component: QrScannerAttendanceAndAddOnsScreen,
  },
  {
    slug: 'record-manual-donation',
    title: "Record Manual Donation",
    component: RecordManualDonationScreen,
  },
  {
    slug: 'registration-and-kyc',
    title: "Registration & KYC",
    component: RegistrationAndKycScreen,
  },
  {
    slug: 'role-management-and-permissions',
    title: "Role Management & Permissions",
    component: RoleManagementAndPermissionsScreen,
  },
  {
    slug: 'send-birthday-card',
    title: "Send Birthday Card",
    component: SendBirthdayCardScreen,
  },
  {
    slug: 'splash-screen-1',
    title: "splash-screen-1",
    component: SplashScreen1Screen,
  },
  {
    slug: 'transaction-analytics',
    title: "Transaction Analytics",
    component: TransactionAnalyticsScreen,
  },
  {
    slug: 'transaction-management-admin',
    title: "Transaction Management (Admin)",
    component: TransactionManagementAdminScreen,
  },
  {
    slug: 'trustees',
    title: "Trustees",
    component: TrusteesScreen,
  },
  {
    slug: 'unified-community-dashboard',
    title: "Unified Community Dashboard",
    component: UnifiedCommunityDashboardScreen,
  },
  {
    slug: 'upload-marksheet',
    title: "Upload Marksheet",
    component: UploadMarksheetScreen,
  },
  {
    slug: 'yearly-profit-and-loss-statement',
    title: "Yearly Profit & Loss Statement",
    component: YearlyProfitAndLossStatementScreen,
  },
];

export const generatedHtmlScreenMap = Object.fromEntries(
  generatedHtmlScreens.map((entry) => [entry.slug, entry.component]),
) as Record<string, ComponentType>;
