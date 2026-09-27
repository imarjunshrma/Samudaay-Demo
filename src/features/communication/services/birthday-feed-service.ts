import { apiClient } from '@/src/services/api/client';
import { apiEndpoints } from '@/src/services/api/endpoints';
import { getBackendSessionContext, isBackendApiConfigured } from '@/src/features/auth/services/backend-session';

type BirthdayFeedItem = {
  id: string;
  name: string;
  meta?: string;
  date?: string;
  image: string;
  age?: number;
  city?: string;
  today?: boolean;
};

const BIRTHDAY_TIMEZONE = 'Asia/Kolkata';

function getMonthDayKey(value?: string | null, timeZone = BIRTHDAY_TIMEZONE) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    month: '2-digit',
    day: '2-digit',
  }).format(parsed);
}

function isBirthdayToday(value?: string | null) {
  const monthDay = getMonthDayKey(value);
  if (!monthDay) return false;

  return monthDay === getMonthDayKey(new Date().toISOString());
}

function formatUpcomingLabel(iso?: string | null) {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
}

export const birthdayFeedService = {
  async loadBirthdays(): Promise<{ today: BirthdayFeedItem[]; upcoming: BirthdayFeedItem[] }> {
    if (isBackendApiConfigured()) {
      const backendSession = await getBackendSessionContext();
      if (backendSession) {
        try {
          const response = await apiClient<{ data: { id: string; name: string; city?: string | null; age?: number; dob?: string | null; birthday?: string | null; daysUntil?: number | null; today?: boolean; image?: string | null }[] }>(
            apiEndpoints.communityBirthdays(backendSession.tenantId, { windowDays: 7 }),
            { token: backendSession.token },
          );

          const items = response.data ?? [];
          const today = items
            .filter((item) => item.today || isBirthdayToday(item.birthday || item.dob))
            .map((item) => ({
              name: item.name,
              meta: item.age ? `Turning ${item.age} today` : 'Birthday today',
              image: item.image || '',
              id: item.id,
              city: item.city || undefined,
              today: true,
            }));

          const upcoming = items
            .filter((item) => {
              if (item.today || isBirthdayToday(item.birthday || item.dob)) {
                return false;
              }
              const daysUntil = Number(item.daysUntil);
              return Number.isFinite(daysUntil) && daysUntil > 0 && daysUntil <= 7;
            })
            .sort((left, right) => (left.daysUntil ?? 999) - (right.daysUntil ?? 999))
            .map((item) => ({
              name: item.name,
              date: formatUpcomingLabel(item.birthday || item.dob),
              image: item.image || '',
              id: item.id,
              city: item.city || undefined,
              today: false,
            }));

          return { today, upcoming };
        } catch (error) {
          throw error instanceof Error ? error : new Error('Unable to load birthday reminders.');
        }
      }
    }

    return { today: [], upcoming: [] };
  },
};
