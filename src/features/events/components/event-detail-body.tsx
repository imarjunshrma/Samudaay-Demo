import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { LocationMapPreview, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { EventAddOnCard, EventMetaCard } from './event-shared-blocks';

export function EventDetailBody({
  location,
  addOns,
  title,
  subtitle,
  dateTitle,
  dateSubtitle,
  locationTitle,
  locationSubtitle,
  aboutDescription,
  onToggle,
  onIncrement,
  onDecrement,
}: {
  location: {
    latitude: number;
    longitude: number;
    label: string;
    address?: string;
    locationUrl?: string | null;
    googlePlaceId?: string | null;
  };
  addOns: readonly { key: string; title: string; subtitle: string; selected: boolean; quantity: number }[];
  title?: string;
  subtitle?: string;
  dateTitle?: string;
  dateSubtitle?: string;
  locationTitle?: string;
  locationSubtitle?: string;
  aboutDescription?: string;
  onToggle: (key: string) => void;
  onIncrement: (key: string) => void;
  onDecrement: (key: string) => void;
}) {
  const t = useTranslations('events.event-detail');
  return (
    <>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
        <LocationMapPreview
          latitude={location.latitude}
          longitude={location.longitude}
          label={location.label}
          address={location.address}
          locationUrl={location.locationUrl}
          googlePlaceId={location.googlePlaceId}
        />
      </View>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
        <View style={{ alignSelf: 'flex-start', borderRadius: radius.full, backgroundColor: 'rgba(242,120,13,0.1)', paddingHorizontal: spacing[3], paddingVertical: spacing[2], marginBottom: spacing[2] }}>
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 11, textTransform: 'uppercase' }}>{t('badge')}</Text>
        </View>
        <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold }}>{title || t('title')}</Text>
        <Text variant="body" color={colors.primary.DEFAULT} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium }}>{subtitle || t('subtitle')}</Text>
      </View>
      <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[6], gap: spacing[4] }}>
        <EventMetaCard icon="calendar-today" title={dateTitle || t('dateTime.title')} subtitle={dateSubtitle || t('dateTime.subtitle')} />
        <EventMetaCard icon="map" title={locationTitle || t('location.title')} subtitle={locationSubtitle || t('location.subtitle')} />
      </View>
      <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[8] }}>
        <Text variant="h4" style={{ marginBottom: spacing[3], fontFamily: typography.fontFamily.bold }}>{t('about.title')}</Text>
        <Text variant="body" color="#475569" style={{ lineHeight: 24 }}>{aboutDescription || t('about.description')}</Text>
      </View>
      {addOns.length ? (
        <View style={{ marginHorizontal: spacing[4], marginBottom: spacing[8], borderRadius: 24, borderWidth: 1, borderColor: 'rgba(242,120,13,0.12)', backgroundColor: 'rgba(242,120,13,0.05)', padding: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
            <MaterialIcons name="add-circle" size={20} color={colors.primary.DEFAULT} />
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>{t('addons.title')}</Text>
          </View>
          <View style={{ gap: spacing[3] }}>
            {addOns.map((item) => (
              <EventAddOnCard key={item.key} title={item.title} subtitle={item.subtitle} quantity={item.quantity} selected={item.selected} onToggle={() => onToggle(item.key)} onIncrement={() => onIncrement(item.key)} onDecrement={() => onDecrement(item.key)} />
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}
