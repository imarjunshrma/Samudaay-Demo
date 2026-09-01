import { View } from 'react-native';

import { ArchiveIssueCard, Text } from '@/src/components';
import { spacing, typography } from '@/src/theme';
import type { PublicationRecord } from '../services/publication-feed-service';

export type PublicationArchiveYearFilter = 'all' | `${number}`;
export type PublicationArchiveMonthFilter = 'all' | `${number}`;

function getManageActionLabel(item: PublicationRecord) {
  if (!item.canManage) {
    return null;
  }
  if (item.status === 'DRAFT' && item.publicationType === 'SYSTEM_GENERATED') {
    return 'Generate';
  }
  if (item.status === 'DRAFT' && item.publicationType === 'MANUAL_UPLOAD' && item.fileUrl) {
    return 'Publish';
  }
  if (item.status === 'GENERATED') {
    return 'Publish';
  }
  if (item.status === 'PUBLISHED') {
    return 'Archive';
  }
  return null;
}

export function PublicationArchiveGroups({
  items,
  onOpen,
  onDownload,
  onManage,
}: {
  items: PublicationRecord[];
  onOpen: (item: PublicationRecord) => void;
  onDownload: (item: PublicationRecord) => void;
  onManage: (item: PublicationRecord) => void;
}) {
  const groupedItems = items.reduce<Record<string, PublicationRecord[]>>((accumulator, item) => {
    const key = item.year ? String(item.year) : 'Other';
    accumulator[key] = accumulator[key] ?? [];
    accumulator[key].push(item);
    return accumulator;
  }, {});

  const years = Object.keys(groupedItems).sort((left, right) => {
    if (left === 'Other') return 1;
    if (right === 'Other') return -1;
    return Number(right) - Number(left);
  });

  return (
    <View style={{ gap: spacing[5] }}>
      {years.map((year) => (
        <View key={year} style={{ gap: spacing[4] }}>
          <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
            {year === 'Other' ? 'Archive' : `Archive ${year}`}
          </Text>
          {groupedItems[year].map((item) => (
            <ArchiveIssueCard
              key={item.id}
              title={item.title}
              edition={item.edition}
              image={item.coverImageUrl}
              statusLabel={item.canManage ? item.status : null}
              onPrimaryPress={() => onOpen(item)}
              onSecondaryPress={() => onDownload(item)}
              showSecondaryAction={item.canManage}
              manageActionLabel={getManageActionLabel(item)}
              onManagePress={() => onManage(item)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
