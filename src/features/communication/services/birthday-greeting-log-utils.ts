import type { BirthdayGreetingLog } from '../constants';

export type BirthdayGreetingSortKey = 'latest' | 'oldest' | 'recipient' | 'template' | 'status';

function parseRelativeTime(sentAt: string) {
  const now = new Date();
  const match = sentAt.match(/^(Today|Tomorrow|Yesterday),\s*(.+)$/i);
  if (!match) {
    return null;
  }

  const [, dayToken, timeToken] = match;
  const date = new Date(now);
  if (dayToken.toLowerCase() === 'tomorrow') {
    date.setDate(date.getDate() + 1);
  } else if (dayToken.toLowerCase() === 'yesterday') {
    date.setDate(date.getDate() - 1);
  }

  const normalizedTime = timeToken.trim().toUpperCase();
  const timeMatch = normalizedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!timeMatch) {
    return date.getTime();
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const meridiem = timeMatch[3];

  if (meridiem === 'PM' && hours < 12) {
    hours += 12;
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}

export function getBirthdayGreetingTimestamp(sentAt: string) {
  const relativeTimestamp = parseRelativeTime(sentAt);
  if (relativeTimestamp !== null) {
    return relativeTimestamp;
  }

  const directTimestamp = Date.parse(sentAt);
  if (!Number.isNaN(directTimestamp)) {
    return directTimestamp;
  }

  const withCurrentYearTimestamp = Date.parse(`${sentAt}, ${new Date().getFullYear()}`);
  if (!Number.isNaN(withCurrentYearTimestamp)) {
    return withCurrentYearTimestamp;
  }

  return 0;
}

export function formatBirthdayGreetingDateTime(sentAt: string) {
  const timestamp = getBirthdayGreetingTimestamp(sentAt);
  if (!timestamp) {
    return sentAt;
  }

  return new Date(timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getBirthdayGreetingSearchText(log: BirthdayGreetingLog) {
  return [
    log.sender,
    log.recipient,
    log.template,
    log.channel,
    log.status,
    log.sentAt,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function sortBirthdayGreetingLogs(logs: readonly BirthdayGreetingLog[], sortKey: BirthdayGreetingSortKey) {
  return [...logs].sort((left, right) => {
    if (sortKey === 'latest') {
      return getBirthdayGreetingTimestamp(right.sentAt) - getBirthdayGreetingTimestamp(left.sentAt);
    }

    if (sortKey === 'oldest') {
      return getBirthdayGreetingTimestamp(left.sentAt) - getBirthdayGreetingTimestamp(right.sentAt);
    }

    if (sortKey === 'recipient') {
      return left.recipient.localeCompare(right.recipient);
    }

    if (sortKey === 'template') {
      return left.template.localeCompare(right.template);
    }

    return left.status.localeCompare(right.status) || left.recipient.localeCompare(right.recipient);
  });
}
