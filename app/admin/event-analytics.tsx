import { useLocalSearchParams } from 'expo-router';

import { EventPerformanceDashboardContent } from '@/src/features/events/components';
import { EventAnalyticsContent } from '@/src/features/finance/components/finance-analytics-content';

export default function AdminEventAnalyticsRoute() {
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;

  if (eventId) {
    return <EventPerformanceDashboardContent mode="admin" />;
  }

  return <EventAnalyticsContent />;
}
