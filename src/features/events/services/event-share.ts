import type { EventAnalyticsRecord, EventRecord } from './event-service';

type ShareableEvent = Pick<
  EventRecord,
  'title' | 'startAt' | 'venueName' | 'city' | 'address' | 'area' | 'state' | 'country' | 'pincode'
>;

function formatEventDate(value?: string | null) {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function formatEventTime(value?: string | null) {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(parsed);
}

function buildEventLocation(event?: ShareableEvent | null) {
  if (!event) {
    return [];
  }

  const location = [event.venueName, event.city].filter(Boolean).join(', ');
  const address = [event.address, event.area, event.city, event.state, event.country, event.pincode]
    .filter(Boolean)
    .join(', ');

  return [location, address].filter((value, index, all) => Boolean(value) && all.indexOf(value) === index);
}

export function buildEventSharePayload(event?: ShareableEvent | null, fallbackTitle = 'Event') {
  const title = event?.title || fallbackTitle;
  const date = formatEventDate(event?.startAt);
  const time = formatEventTime(event?.startAt);
  const schedule = [date, time].filter(Boolean).join(', ');
  const locations = buildEventLocation(event);
  const message = [title, schedule, ...locations].filter(Boolean).join('\n');

  return {
    title,
    message: message || title,
  };
}

function formatCurrency(amount: number) {
  return `Rs ${Number(amount || 0).toLocaleString('en-IN')}`;
}

export function buildEventPerformanceSharePayload(analytics?: EventAnalyticsRecord | null, fallbackTitle = 'Event performance') {
  const eventPayload = buildEventSharePayload(analytics?.event, fallbackTitle);
  const message = [
    eventPayload.message,
    `Revenue: ${formatCurrency(analytics?.totalIncome || 0)}`,
    `Net profit: ${formatCurrency(analytics?.netProfit || 0)}`,
    `Registrations: ${analytics?.registeredUsers || 0}`,
    `Attended: ${analytics?.attended || 0}`,
  ].join('\n');

  return {
    title: eventPayload.title,
    message,
  };
}
