import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

type NotificationItem = {
  title: string;
  time: string;
  desc: string;
  image?: string;
  icon?: string;
  unread?: boolean;
  muted?: boolean;
};

type BottomNavItem = {
  icon: string;
  label: string;
  active: boolean;
};

type ChatGroup = {
  title: string;
  time: string;
  preview: string;
  members: string;
  image: string;
  unread?: string;
  active?: boolean;
};

type BirthdayPerson = {
  name: string;
  meta?: string;
  date?: string;
  image: string;
};

type BirthdayTemplate = {
  title: string;
  image: string;
  selected?: boolean;
};

export type BirthdayAdminMetric = {
  key: string;
  label: string;
  value: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
};

export type BirthdayReminderControl = {
  key: string;
  title: string;
  description: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  enabled: boolean;
};

export type BirthdayTemplateManagementItem = {
  id: string;
  title: string;
  categoryKey: string;
  category: string;
  image: string;
  defaultMessage: string;
  active: boolean;
  sentCount: number;
};

export type BirthdayGreetingLog = {
  id?: string;
  senderId?: string;
  recipientId?: string;
  sender?: string;
  recipient: string;
  template: string;
  channel: string;
  sentAt: string;
  status: 'Delivered' | 'Scheduled';
};

export const notificationItems: readonly NotificationItem[] = [
  { title: 'New Order Received', time: '2m ago', desc: 'Order ID: #IN-9082. You have a new custom order for formal oxfords.', icon: 'shopping-bag', unread: true },
  { title: 'New Tip in Community', time: '1h ago', desc: 'Ramesh shared: "How to maintain leather shine in humid weather."', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb3cBUt2VtgjUTFsZsb8VlqeaKtGW_icBXwwT6yZkeEqrhpGIUb9c0cWr-s4TVdnEvyCjMq2SJUt-eqW7O_RY4c_5VnZCt1ZeC9E59RtGOhTurGlPTU78jWDS44mbPaEKXcwtgy94ABYr2xXwRXA30IdcKEkAS2hGPHAguhTm1TrXEVHTYb0PZowJ1Wi8wzckG9j4FhnUYEU-_YH5mdCLZMoPAEUIr39midoGV90E8vdeuN7xHcx4jNDdfE5Bv52rpW7BF9Herlnwz', unread: false },
  { title: 'Workshop Tomorrow', time: '1d ago', desc: 'Reminder: "Advanced Stitching Techniques" starts at 10 AM.', icon: 'event', muted: true },
  { title: 'Payout Successful', time: '1d ago', desc: '₹4,500 has been transferred to your linked bank account.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnocTBdJj4CGrfChHvpmnFPla-xhBaArrht50gwviLDki7gZdC69tsIe-7-T_NBigq7RL--suAJGCnODhxaITxdiy5rsfMlP1pxHnPXIE6zc7lJMWktsHHUQmjaWBSssHjswUK_61dLnAwO2faMmY2EXvVs7EDkIy9lbsx0849SxOLRtDooLUGxaZj1y0SNCTDKLRshTDUqtwRe6UCx1zZZL7TICeGD2_ZnnpHXBuyuiExfN_fnaobixRdcIBaVWiWqWv0gxSlyIqt', muted: true },
  { title: 'New 5-Star Review', time: '2d ago', desc: '"Excellent craftsmanship! The repairs were perfect and timely." - Amit S.', icon: 'star', muted: true },
] as const;

export const notificationsBottomNav: readonly BottomNavItem[] = [
  { icon: 'home', label: 'Home', active: false },
  { icon: 'shopping-bag', label: 'Orders', active: false },
  { icon: 'notifications', label: 'Notifications', active: true },
  { icon: 'person', label: 'Profile', active: false },
] as const;

export const createNotificationFields = [
  ['Title', 'Important update for members'],
  ['Audience', 'All members / Selected city / Volunteers'],
  ['Schedule', 'Send now / schedule time'],
] as const;

export const communityChatGroups: readonly ChatGroup[] = [
  {
    title: 'National Meetup Delhi',
    time: '10:30 AM',
    preview: 'Rajesh: Looking forward to seeing everyone!',
    members: '24 members active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8vXVmTp_vlxEpUzmjHz63u3uLjhxULwa2_MfszM2v-OrZIqg7gJmW9MmBH4n7tNusHYIdaT-2v3Y9E3csIFFBqBVksta_1yvFnO-YkeRIN7kEEztrflFyYaB1K1gmMGI2OfCd0jMwFqQJM6TFZuC5oIYMsUs1rZyohgsvQd6o9UEDCziVnzEBR6tKgi2EDMh3MRxQccKZIH-HUdgkw78wwngkCnRaogMctXacnLs95BNHm1Jf1VM4qnhu1KAcvnJYwl40oWZ1BtEV',
    unread: '3',
    active: true,
  },
  {
    title: 'Mumbai Local Group',
    time: 'Yesterday',
    preview: 'Amit: Does anyone know a good tanner in Dharavi?',
    members: '112 members',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5zDIFn2xmZuMbv5c_fKrrPYpBW7p0se0SIj3XeZ7EwQpeSHlvAJrctft7Pt7crxtWKN8E4PQ3mK8r87t1LN9EQPe_1bb_fmPk4I092EpQTC5Ow0qAPSjByCl0OdA7Jj9Z5BbDwEd1jtrGouCYqqAwJt5d4Irzu3CLh6F_Ibc7XKF1ly4wicRB2Imn4m7YyzXO0EJTq-TWtXS06FWs2n_LdsHf2HZGfgtaVr7VgqqFUdS5CKw4uvF4iLM-yxu554_vZe_lt947kIMl',
  },
  {
    title: 'Leather Crafts Workshop',
    time: 'Monday',
    preview: 'Suresh: Shared a video: Pattern Cutting 101',
    members: '85 members',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsfz1a_s13ad2uVDtv5slAUwFTqLLQ1bXPx5hRLU9otz1T7LtQFcCi0G65UkWncrNrgMshGB0ySRl9vILHTRZ1CeCIfOR6UlR6179K3rwN95B8uaPccKre3d4lzBfuZTOSHcdjOY1eaddOSNHwH7iO-4q7pkm5qYY_PgrlsncgbSeK9K6Ofw9_vKJTf5HS0t5XfGeVMlcO3Kfwf1vcI_55HtvydRFNz3fulun2q-ZccPD6H5HRACOMwyYtCZTF0csUDg4FSK2JaxO8',
  },
  {
    title: 'Southern Artisans Guild',
    time: '12 Oct',
    preview: 'Venkatesh: The new batch of soles has arrived.',
    members: '42 members',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4N8ZkoYUL5AS7yCa8iWdmQPKwlwjKOaKS4hQOp4oxPhSeJoWVqAMBD0MralMTZD7oS02TLOx2zRIuMh4MrpCp3TUcZX9v1TOlXXO5lDdPwLjTiU-uBB0iIsZOhdrhMeSIRRJ86g3XXejUYo9xTe2KPhzMoWiarA-Q4w1ClmkfhpWud7Rp3v4bPtPtGFgPgcKv4sVLMGIpGR9A0LxRrlOcHhdAP2SRPr5yLzHSutwQixgkfXpKriy2yCX3bHbUZEkHDcFWoDnFq7pW',
  },
] as const;

export const communityChatTabs = ['All', 'Groups', 'Events', 'Unread', 'Archived'] as const;

export const communityChatsBottomNav: readonly BottomNavItem[] = [
  { icon: 'home', label: 'Home', active: false },
  { icon: 'chat-bubble', label: 'Chats', active: true },
  { icon: 'storefront', label: 'Market', active: false },
  { icon: 'person', label: 'Profile', active: false },
] as const;

export const birthdayToday: readonly BirthdayPerson[] = [
  {
    name: 'Rajesh Kumar',
    meta: 'Turning 45 today',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZfdAmOTNalNfxkdL4xLeeyTbDHVT1HbevK9a0oYXpQxKiTXgjYJCVR3yQmXJL3gJe-JsE-T3jC9Mi4bnerjF9GxyXQzcSEkIBVsDsn9bTxoGsE3YAPYOporC8AE9HXRebQqNFk5rsz42i1HWbsGIUlkSQaDUix8Csy3h8OpJpUENGPpLIle84ju_-mxboSw_z0YmvhHGTDq8pbOPZkuBWxv8d0MtDyJpDEzsbzsN5G-BzS-WBtR5vGn7uJ0pxBF2ae8KuPXoxvKXz',
  },
  {
    name: 'Amit Prajapati',
    meta: 'Turning 32 today',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4XBH6w6wUn8B3Yiz4Z9SR7RyjPLtPXiwtz0KjZkCWMR8G9FUv4nSqd7tgBe9pvCNjbtVHvB4gHPgKL3atDUgPVV21_yOL6gHwCAptJ0JH-hll2y4KKc0OH-RgCmplvHCmI8qJaABofHfR3BsMpDXRoOysQIBxlb-rGxv8hZpTRRcXqyJIQydK9H0LDkzXhRSWmJhlgrCYXfpgmUvn1m6gNgErPr6ko-c9vEALJkC9RPt6dHFzF6PAd_MaXD6A55mGNmZdBq1bVSGs',
  },
] as const;

export const birthdayUpcoming: readonly BirthdayPerson[] = [
  {
    name: 'Sunil Varma',
    date: 'Tomorrow, Oct 24',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7BA9vuDFViNnkcAYOotOKIc6KwrQo4of6tVT7Z9S5htKEJxVWUDI5ofvpw0h4bkbIQfiyLvNhoupJsjYdv7efZrN7dIWTtCO-Jk0jBtxywTtcs-V3RzbQpbrNF_Fs63rK9dNWz86qglWutTjEndc895hAY_kIPwVipVhw8wqipfhYS5Ggu9qbJQsWsS0gAkBj1Sd-yPxpplR-5L-1bzDqpZF6wdPGV66iYstBFk-28tBQHDz_Dur1LxRYIR2GW2ftoqvrP0tN2ORE',
  },
  {
    name: 'Deepak Chauhan',
    date: 'Friday, Oct 26',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0ubuhq48Eu5pcUyMAbJ5LngGZovgzBb5T16oAoBwFBqJ7LRPW2u-Ch7qU2_DChkvXJ4m1hbPyCzqmB07kcVUs8Bw2oyUXc5MQokDWKg4ADzzdws3fYrveZpugpd5PebZSj5EmedqttVZBwhMuA9RKVUGDQYv6mL7xxKm6bpSN1sXJ1go1HBK_9LOhry3EulSrbrM8IiwIIzKgjd2XdJoGBr8yJeZfkWAJGfwj8laCsinYxEyIR_TfeRyE4qEL6wCOWuaEM5NBDlYi',
  },
  {
    name: 'Meena Solanki',
    date: 'Saturday, Oct 27',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3mlI1a5k6LvCkKjXntvwhg08Ax31KixejwSQM_Whao08WIQpauwPJ3D4OzkPYZgVBNMDJ1N7kgJqSfb_TR1cVpFLSwPBiOPySypGovAkCujQ8ILp_RXj2kW9RapkVYXW81FjjbUZcHwRmxTZ7Ppn2dVkHh5C_shDQVJtjziT6If9-rlcrmMsO6ZbjZhKaNe9Bp7Jbv7bNOZB7AbPpgDhVqmVfSVBzvMgs14SPhYWGIn6HIW5ErrPTNv1DQA4aFw6KKBv69zfZ4H2p',
  },
] as const;

export const birthdaysBottomNav: readonly BottomNavItem[] = [
  { icon: 'home', label: 'Home', active: false },
  { icon: 'group', label: 'Members', active: false },
  { icon: 'cake', label: 'Birthdays', active: true },
  { icon: 'person', label: 'Profile', active: false },
] as const;

export const birthdayCardTemplates: readonly BirthdayTemplate[] = [
  {
    title: 'Traditional Indian Patterns',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK0CjwTIipM3VFnMVwzzbtpukQ3XHyjf1OtBXYakmXr0xTcfG7yaOfX2xW26K7kCZrYNT_cBWbCHE8APa1Yq4j8jH4M_GbImVEOLmgKcgH5-NqgI4th_7hvhHRBk-dUAZFeq_7klHkfYtH0agYng86kjgVEtnmHewLIicUyZ86XLoy0IWSILPsEAtALFBCz02D8TwdfYnAUjz-qCbLNJD2zo7DM2Edc42B9WbQ2LZO1c-U2GPkWKeSWtmUYKwW4jyxmoJ6f2kCOYTR',
    selected: true,
  },
  {
    title: 'Leather Craft',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh_sBpB5nKS7i0Bv2tnP_YKPoqQyu87BfOlLR_-gid6GSWzM5cHf_DYEKwVnU8ZLewxVTmkc6UHVRs3WB3f2jinaNEygydZaN-ZrpSearfhPOR_sJQflMtO-RhfNycrkpowwfjLZEMtUF-boxtDATDWeWT8lRcorKtr14Eh1A-I1C3C3AEmOOUkRhpDiypoNhaO8NWnQEWsQYRWyulosZBVRRmbz0AVK4vUDThyIhY6iqz8afg76dPHKuijMkojnyJ5HUTt-WpilnW',
  },
  {
    title: 'Floral Designs',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA09yp3jUtw9E3Fm7QxltmWGkqBJd3NsSWX3EQKGSYAvJV_YpEhnKXwbXzv0dY9yfqVi3u_0MHQ1y_jNtM51mbiTP2iBYiJiLLrz-iLDJRdyJcvaJRRjmD7HBc5vihrRG2GiJ0rsFM5nDgRJ6A0qqnk1qlzoVodLeDXAFHoyOmHPpC6gHjl_ZKk_GWq03yRpE3rkdAEliiduRsRBjmerP8wBI1vRDOrzcWol99X8jd_LQuInwz_Wa3SF22-uTtbXWij6zTjD12EtJUs',
  },
  {
    title: 'Minimalist Abstract',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8j6VSP7kcWrvMrPRDrX3ZQYy5AytVx8cWn_nnuXhcfQCS7tt756OI9kd1pZOu0Vqs_UK4lIYTpGQckEP8N21DR8ZwEr7wOL2AkAGaJ-W0dsDZGwq4BcBnta1QeOI3KD813FWTSEMpWkebfenCtRcq2f9fw6gxW6EGkZm67cDcKZ8-BaxaUwb2hcM0lT_emHqjxjDCX6zfuPLwtnZDd9zZ77M138dypmhO-JUR9IGMXM_W_cH0aqMg66kzPt7E9M8WdaDLEhwnKKPq',
  },
] as const;

export const birthdayAdminMetrics: readonly BirthdayAdminMetric[] = [
  { key: 'today', label: 'Today', value: '12', icon: 'cake' },
  { key: 'week', label: 'This Week', value: '48', icon: 'calendar-month' },
  { key: 'sent', label: 'Cards Sent', value: '126', icon: 'send' },
  { key: 'templates', label: 'Templates', value: '08', icon: 'dashboard-customize' },
] as const;

export const birthdayReminderControls: readonly BirthdayReminderControl[] = [
  {
    key: 'dailyReminder',
    title: 'Daily birthday reminder',
    description: 'Notify members about today birthdays each morning.',
    icon: 'notifications-active',
    enabled: true,
  },
  {
    key: 'ageVisibility',
    title: 'Show age on birthday list',
    description: 'Age visibility is configurable as required by privacy rules.',
    icon: 'visibility',
    enabled: false,
  },
  {
    key: 'templateAvailability',
    title: 'Greeting templates enabled',
    description: 'Members can select active templates before sending cards.',
    icon: 'collections',
    enabled: true,
  },
] as const;

export const birthdayManagedTemplates: readonly BirthdayTemplateManagementItem[] = [
  {
    id: 'traditional',
    title: 'Traditional Blessing',
    categoryKey: 'traditional',
    category: 'Traditional',
    image: birthdayCardTemplates[0].image,
    defaultMessage: 'Wishing you health, happiness, and blessings on your birthday.',
    active: true,
    sentCount: 52,
  },
  {
    id: 'modern',
    title: 'Modern Community Wish',
    categoryKey: 'modern',
    category: 'Modern',
    image: birthdayCardTemplates[3].image,
    defaultMessage: 'Happy birthday from the community. Have a joyful year ahead.',
    active: true,
    sentCount: 38,
  },
  {
    id: 'kids',
    title: 'Kids Celebration',
    categoryKey: 'kids',
    category: 'Kids / Fun',
    image: birthdayCardTemplates[2].image,
    defaultMessage: 'Wishing you a fun-filled birthday and a bright year ahead.',
    active: true,
    sentCount: 14,
  },
] as const;

export const birthdayGreetingLogs: readonly BirthdayGreetingLog[] = [
  {
    recipient: 'Rajesh Kumar',
    template: 'Traditional Blessing',
    channel: 'In-app',
    sentAt: 'Today, 8:30 AM',
    status: 'Delivered',
  },
  {
    recipient: 'Amit Prajapati',
    template: 'Modern Community Wish',
    channel: 'In-app',
    sentAt: 'Today, 9:10 AM',
    status: 'Delivered',
  },
  {
    recipient: 'Sunil Varma',
    template: 'Traditional Blessing',
    channel: 'Scheduled',
    sentAt: 'Tomorrow, 8:00 AM',
    status: 'Scheduled',
  },
] as const;
