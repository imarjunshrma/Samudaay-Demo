export const apiEndpoints = {
  auth: '/auth',
  profile: '/profile',
  donations: '/donations',
  notifications: '/notifications',
  publicCommunities: '/api/v1/community/auth/communities',
  translateText: '/api/v1/translate',
  communityAuthOtpRequest: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/auth/otp/request`,
  communityAuthOtpVerify: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/auth/otp/verify`,
  communityAuth: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/auth/firebase/login`,
  communityMe: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/auth/me`,
  communityProfile: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/auth/profile`,
  communityProfileUpdateRequests: (tenantId: string, status = 'PENDING') =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/profile-update-requests?status=${encodeURIComponent(status)}`,
  communityProfileUpdateRequestDecision: (tenantId: string, requestId: string, action: 'approve' | 'reject') =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/profile-update-requests/${encodeURIComponent(requestId)}/${action}`,
  communitySaintPdf: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/saint/pdf`,
  communityAppMembershipMe: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/app-membership/me`,
  communityAppMembershipReport: (tenantId: string, query?: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/app-membership/report${query ? `?${query}` : ''}`,
  communityAdminAuditLogs: (tenantId: string, query?: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/admin-audit-logs${query ? `?${query}` : ''}`,
  communityAppMembershipPaymentOrder: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/app-membership/payment-order`,
  communityAppMembershipPaymentVerify: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/app-membership/payment-verify`,
  communityRegistrationMe: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/registration/me`,
  communityRegistration: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/registration`,
  communityRegistrationById: (tenantId: string, registrationId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/registration/${encodeURIComponent(registrationId)}`,
  communityRegistrationSubmit: (tenantId: string, registrationId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/registration/${encodeURIComponent(registrationId)}/submit`,
  communityMemberDashboard: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/dashboard/member`,
  communityRegistrationDocuments: (tenantId: string, registrationId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/registration/${encodeURIComponent(registrationId)}/documents`,
  communityKycDocuments: (tenantId: string, registrationId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/registration/${encodeURIComponent(registrationId)}/documents`,
  communityApprovalQueue: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/registration/approval/queue`,
  communityApprovalDecision: (tenantId: string, registrationId: string, action: 'approve' | 'reject') =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/registration/approval/${encodeURIComponent(registrationId)}/${action}`,
  communityRegistrations: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/registration`,
  communityFamilyMembers: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/family`,
  communityAdminFamilyRegistry: (tenantId: string, options?: { search?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (options?.search?.trim()) {
      params.set('q', options.search.trim());
    }
    if (options?.page) {
      params.set('page', String(options.page));
    }
    if (options?.limit) {
      params.set('limit', String(options.limit));
    }
    const queryString = params.toString();
    return `/api/v1/community/${encodeURIComponent(tenantId)}/family/admin-registry${queryString ? `?${queryString}` : ''}`;
  },
  communityAdminFamilyRegistryRecord: (tenantId: string, userId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/family/admin-registry/${encodeURIComponent(userId)}`,
  communityFamilyMember: (tenantId: string, familyMemberId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/family/${encodeURIComponent(familyMemberId)}`,
  communityDirectoryMembers: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/directory/members`,
  communityDirectoryMembersImport: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/directory/members/import`,
  communityDirectoryRegistrationReport: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/directory/members/registration-report`,
  communityDirectoryFilterOptions: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/directory/filter-options`,
  communityDirectoryMember: (tenantId: string, memberId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/directory/members/${encodeURIComponent(memberId)}`,
  communityDirectoryMemberScan: (tenantId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/directory/members/scan`,
  communityDirectoryMemberRoles: (tenantId: string, memberId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/directory/members/${encodeURIComponent(memberId)}/roles`,
  communityDirectoryTrustees: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/directory/trustees`,
  communityBirthdays: (tenantId: string, query?: { windowDays?: number; month?: number; city?: string }) => {
    const params = new URLSearchParams();
    if (typeof query?.windowDays === 'number') params.set('windowDays', String(query.windowDays));
    if (typeof query?.month === 'number') params.set('month', String(query.month));
    if (query?.city) params.set('city', query.city);
    const queryString = params.toString();
    return `/api/v1/community/${encodeURIComponent(tenantId)}/birthdays/list${queryString ? `?${queryString}` : ''}`;
  },
  communityBirthdaySettings: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/birthdays/settings`,
  communityBirthdayTemplates: (tenantId: string, includeInactive = false, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (includeInactive) params.set('includeInactive', 'true');
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    const query = params.toString();
    return `/api/v1/community/${encodeURIComponent(tenantId)}/birthdays/templates${query ? `?${query}` : ''}`;
  },
  communityBirthdayTemplateImageUpload: (tenantId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/birthdays/templates/upload-image`,
  communityBirthdayTemplate: (tenantId: string, templateId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/birthdays/templates/${encodeURIComponent(templateId)}`,
  communityBirthdayGreetings: (
    tenantId: string,
    query?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      channel?: string;
      sort?: string;
    },
  ) => {
    const params = new URLSearchParams();
    if (query?.page) params.set('page', String(query.page));
    if (query?.limit) params.set('limit', String(query.limit));
    if (query?.search?.trim()) params.set('search', query.search.trim());
    if (query?.status?.trim()) params.set('status', query.status.trim());
    if (query?.channel?.trim()) params.set('channel', query.channel.trim());
    if (query?.sort?.trim()) params.set('sort', query.sort.trim());
    const queryString = params.toString();
    return `/api/v1/community/${encodeURIComponent(tenantId)}/birthdays/greetings${queryString ? `?${queryString}` : ''}`;
  },
  communityBirthdayGreeting: (tenantId: string, greetingId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/birthdays/greetings/${encodeURIComponent(greetingId)}`,
  communityChildren: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/children`,
  communityMarksheetReport: (tenantId: string, query?: { academicYear?: string; page?: number; limit?: number; search?: string; department?: string; uploadStatus?: string } | string) => {
    const params = new URLSearchParams();
    const normalizedQuery = typeof query === 'string' ? { academicYear: query } : query;
    if (normalizedQuery?.academicYear) params.set('academicYear', normalizedQuery.academicYear);
    if (normalizedQuery?.page) params.set('page', String(normalizedQuery.page));
    if (normalizedQuery?.limit) params.set('limit', String(normalizedQuery.limit));
    if (normalizedQuery?.search?.trim()) params.set('search', normalizedQuery.search.trim());
    if (normalizedQuery?.department?.trim()) params.set('department', normalizedQuery.department.trim());
    if (normalizedQuery?.uploadStatus?.trim()) params.set('uploadStatus', normalizedQuery.uploadStatus.trim());
    const queryString = params.toString();
    return `/api/v1/community/${encodeURIComponent(tenantId)}/children/marksheets/report${queryString ? `?${queryString}` : ''}`;
  },
  communityMarksheetReportPdf: (tenantId: string, academicYear?: string) => {
    const params = new URLSearchParams();
    if (academicYear) params.set('academicYear', academicYear);
    const queryString = params.toString();
    return `/api/v1/community/${encodeURIComponent(tenantId)}/children/marksheets/report/pdf${queryString ? `?${queryString}` : ''}`;
  },
  communityMarksheetRecordMarks: (tenantId: string, marksheetId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/children/marksheets/${encodeURIComponent(marksheetId)}/marks`,
  communityChildMarksheetRecords: (tenantId: string, familyMemberId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/children/${encodeURIComponent(familyMemberId)}/marksheets`,
  communityEvents: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/events`,
  communityEventLocationSearch: (tenantId: string, query: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/location-search?q=${encodeURIComponent(query)}`,
  communityEventLocationByPlaceId: (tenantId: string, placeId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/location-search/${encodeURIComponent(placeId)}`,
  communityMyEventRegistrations: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/events/me/registrations`,
  communityMyEventPasses: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/events/me/passes`,
  communityEventScan: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/events/scan`,
  communityEventAnalytics: (tenantId: string, eventId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/${encodeURIComponent(eventId)}/analytics`,
  communityEventRegistrations: (tenantId: string, eventId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/${encodeURIComponent(eventId)}/registrations`,
  communityEventReviews: (tenantId: string, eventId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/${encodeURIComponent(eventId)}/reviews`,
  communityEventGallery: (tenantId: string, eventId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/${encodeURIComponent(eventId)}/gallery`,
  communityEventRegister: (tenantId: string, eventId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/${encodeURIComponent(eventId)}/register`,
  communityEventAdhocRegistration: (tenantId: string, eventId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/${encodeURIComponent(eventId)}/adhoc-registration`,
  communityEventPaymentOrder: (tenantId: string, eventId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/${encodeURIComponent(eventId)}/payment-order`,
  communityEventPaymentVerify: (tenantId: string, eventId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/${encodeURIComponent(eventId)}/payment-verify`,
  communityEventRegistrationCancel: (tenantId: string, eventId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/events/${encodeURIComponent(eventId)}/register/cancel`,
  communityChats: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/chat`,
  communityChatById: (tenantId: string, chatId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/chat/${encodeURIComponent(chatId)}`,
  communityChatSettings: (tenantId: string, chatId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/chat/${encodeURIComponent(chatId)}/settings`,
  communityChatMembers: (tenantId: string, chatId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/chat/${encodeURIComponent(chatId)}/members`,
  communityChatMemberById: (tenantId: string, chatId: string, memberId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/chat/${encodeURIComponent(chatId)}/members/${encodeURIComponent(memberId)}`,
  communityChatMessages: (tenantId: string, chatId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/chat/${encodeURIComponent(chatId)}/messages`,
  communityChatMedia: (tenantId: string, chatId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/chat/${encodeURIComponent(chatId)}/media`,
  communityChatMessageById: (tenantId: string, chatId: string, messageId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/chat/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`,
  communityAppSettings: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/settings/app`,
  communityDonations: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/donations`,
  communityDonationSettings: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/donations/settings`,
  communityDonationById: (tenantId: string, donationId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/donations/${encodeURIComponent(donationId)}`,
  communityTransactions: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/transactions`,
  communityDonationPaymentOrder: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/donations/payment-order`,
  communityDonationPaymentVerify: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/donations/payment-verify`,
  communityDonationSlip: (tenantId: string, donationId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/donations/${encodeURIComponent(donationId)}/slip`,
  communityExpenses: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/expenses`,
  communityExpenseById: (tenantId: string, expenseId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/expenses/${encodeURIComponent(expenseId)}`,
  communityExpenseReceipt: (tenantId: string, expenseId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/expenses/${encodeURIComponent(expenseId)}/receipt`,
  communityNotifications: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/notifications`,
  communityNotificationRead: (tenantId: string, notificationId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/notifications/${encodeURIComponent(notificationId)}/read`,
  communityNotificationCampaigns: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/notification-campaigns`,
  communityNotificationCampaignImageUpload: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/notification-campaigns/upload-image`,
  communityNotificationsReadAll: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/notifications/read-all`,
  communityNotificationPushToken: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/notifications/push-token`,
  communityMatrimonyProfiles: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/profiles`,
  communityMatrimonyProfileById: (tenantId: string, profileId: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/profiles/${encodeURIComponent(profileId)}`,
  communityMatrimonyProfileReview: (tenantId: string, profileId: string, action: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/profiles/${encodeURIComponent(profileId)}/${encodeURIComponent(action)}`,
  communityMatrimonyAccess: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/access`,
  communityMatrimonyAnalytics: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/analytics`,
  communityMatrimonySettings: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/settings`,
  communityMatrimonyMe: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/me`,
  communityMatrimonyRequests: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/requests`,
  communityMatrimonyRequestReview: (tenantId: string, requestId: string, action: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/requests/${encodeURIComponent(requestId)}/${encodeURIComponent(action)}`,
  communityMatrimonyPaymentOrder: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/payment-order`,
  communityMatrimonyPaymentVerify: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/payment-verify`,
  communityMatrimonySubscriptions: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/matrimony/subscriptions`,
  communityPublications: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/publications`,
  communityTenantSummary: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/summary`,
  communityAnalytics: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/analytics`,
  communityAnalyticsTransactions: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/analytics/transactions`,
  communityRoles: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/roles`,
  communityRole: (tenantId: string, roleId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/roles/${encodeURIComponent(roleId)}`,
  communityAdvertisements: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/advertisements`,
  communityActiveAdvertisements: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/advertisements/active`,
  communityAdvertisement: (tenantId: string, id: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/advertisements/${encodeURIComponent(id)}`,
  communityAdvertisementImpression: (tenantId: string, id: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/advertisements/${encodeURIComponent(id)}/impression`,
  communityAdvertisementClick: (tenantId: string, id: string) =>
    `/api/v1/community/${encodeURIComponent(tenantId)}/advertisements/${encodeURIComponent(id)}/click`,
  communityAdvertisementImageUpload: (tenantId: string) => `/api/v1/community/${encodeURIComponent(tenantId)}/advertisements/upload-image`,
  adminUsers: '/api/v1/admin/users',
  adminAdmins: '/api/v1/admin/users/admins',
  adminPromotions: '/api/v1/admin/promotions',
  adminPromotion: (id: string) => `/api/v1/admin/promotions/${encodeURIComponent(id)}`,
  adminPlans: '/api/v1/admin/plans',
  adminBookings: '/api/v1/admin/bookings',
  adminContacts: '/api/v1/admin/contacts',
  adminFeedback: '/api/v1/admin/feedback',
  adminRedFlags: '/api/v1/admin/red-flags',
  adminNotificationCampaigns: '/api/v1/admin/notification-campaigns',
} as const;
