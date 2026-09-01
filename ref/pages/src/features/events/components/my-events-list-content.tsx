import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { myEventsBottomNav, myEventsListItems } from '../constants';
import { colors, radius, spacing, typography } from '@/src/theme';

function EventCard({
  title,
  date,
  location,
  image,
  active,
}: {
  title: string;
  date: string;
  location: string;
  image: string;
  active: boolean;
}) {
  return (
    <View
      style={{
        marginBottom: spacing[4],
        gap: spacing[4],
        borderRadius: radius.xl,
        backgroundColor: active ? colors.background.surface : 'rgba(255,255,255,0.6)',
        padding: spacing[4],
        borderWidth: 1,
        borderColor: 'rgba(242,120,13,0.08)',
        shadowColor: active ? '#000' : 'transparent',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: active ? 0.06 : 0,
        shadowRadius: 6,
        elevation: active ? 2 : 0,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[4] }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="bodyLg" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialIcons name="calendar-today" size={14} color="#475569" />
            <Text variant="caption" color="#475569" style={{ fontSize: 14 }}>
              {date}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialIcons name="location-on" size={14} color="#475569" />
            <Text variant="caption" color="#475569" style={{ fontSize: 14 }}>
              {location}
            </Text>
          </View>
        </View>
        <Image source={{ uri: image }} resizeMode="cover" style={{ width: 112, height: 80, borderRadius: radius.lg }} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[2], marginTop: spacing[2] }}>
        <Pressable
          accessibilityRole="button"
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            borderRadius: radius.lg,
            backgroundColor: active ? colors.primary.DEFAULT : 'rgba(242,120,13,0.2)',
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[2],
          }}>
          <MaterialIcons name="confirmation-number" size={18} color={active ? '#fff' : colors.primary.DEFAULT} />
          <Text variant="caption" color={active ? '#fff' : colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
            View Pass
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function MyEventsListContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background.DEFAULT,
            padding: spacing[4],
            borderBottomWidth: 1,
            borderBottomColor: colors.primary.borderLight,
          }}>
          <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </View>
          <Text variant="h4" color={colors.text.primary} style={{ marginLeft: spacing[2], fontFamily: typography.fontFamily.bold }}>
            My Events
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            top: 73,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: colors.background.DEFAULT,
          }}>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight, paddingHorizontal: spacing[4] }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: colors.primary.DEFAULT, paddingTop: spacing[4], paddingBottom: spacing[3] }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                Upcoming
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent', paddingTop: spacing[4], paddingBottom: spacing[3], opacity: 0.6 }}>
              <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                Past
              </Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 133, paddingHorizontal: spacing[4], paddingBottom: 110 }}>
          <View style={{ marginBottom: spacing[6] }}>
            <Text variant="h5" color={colors.text.primary} style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
              This Month
            </Text>
            {myEventsListItems.slice(0, 2).map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </View>
          <View>
            <Text variant="h5" color={colors.text.primary} style={{ marginBottom: spacing[4], opacity: 0.6, fontFamily: typography.fontFamily.bold }}>
              Next Month
            </Text>
            <EventCard {...myEventsListItems[2]} />
          </View>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: colors.primary.borderLight,
            backgroundColor: 'rgba(248,247,245,0.97)',
            paddingHorizontal: spacing[4],
            paddingTop: spacing[2],
            paddingBottom: spacing[6],
          }}>
          {myEventsBottomNav.map((item) => (
            <View key={item.label} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
              <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
              <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: 12, fontFamily: typography.fontFamily.medium }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
