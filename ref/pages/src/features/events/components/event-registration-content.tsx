import { Image, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';
import { eventHero, eventRegistrationAddOns } from '../constants';

function EventTopBar() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(242,120,13,0.1)',
        backgroundColor: colors.background.DEFAULT,
      }}>
      <View style={{ width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' }}>
        <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
      </View>
      <Text variant="h5" style={{ flex: 1, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
        Event Details
      </Text>
      <View style={{ width: 48, alignItems: 'flex-end' }}>
        <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="share" size={22} color={colors.text.primary} />
        </View>
      </View>
    </View>
  );
}

function LogisticsCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  subtitle: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        padding: spacing[4],
        ...shadows.sm,
      }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: radius.lg,
          backgroundColor: 'rgba(242,120,13,0.1)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialIcons name={icon} size={22} color={colors.primary.DEFAULT} />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
          {title}
        </Text>
        <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

function AddOnRow({ title, subtitle, quantity }: { title: string; subtitle: string; quantity: number }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        backgroundColor: '#ffffff',
        padding: spacing[4],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1, paddingRight: spacing[3] }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            borderWidth: 1.5,
            borderColor: '#cbd5e1',
            backgroundColor: '#ffffff',
          }}
        />
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        <Pressable
          style={{
            width: 32,
            height: 32,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text variant="body" color="#94a3b8" style={{ fontFamily: typography.fontFamily.bold }}>
            -
          </Text>
        </Pressable>
        <Text variant="body" style={{ width: 16, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
          {quantity}
        </Text>
        <Pressable
          style={{
            width: 32,
            height: 32,
            borderRadius: radius.full,
            backgroundColor: 'rgba(242,120,13,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text variant="body" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function EventRegistrationContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
        <EventTopBar />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
            <View
              style={{
                borderRadius: radius.xl,
                overflow: 'hidden',
                position: 'relative',
                ...shadows.md,
              }}>
              <Image source={{ uri: eventHero }} resizeMode="cover" style={{ width: '100%', aspectRatio: 16 / 9 }} />
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  left: spacing[4],
                  bottom: spacing[4],
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  borderRadius: radius.full,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  paddingHorizontal: spacing[3],
                  paddingVertical: 6,
                }}>
                <MaterialIcons name="location-on" size={16} color={colors.primary.DEFAULT} />
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                  Pragati Maidan
                </Text>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[4] }}>
            <View
              style={{
                alignSelf: 'flex-start',
                borderRadius: radius.full,
                backgroundColor: 'rgba(242,120,13,0.1)',
                paddingHorizontal: spacing[3],
                paddingVertical: 6,
                marginBottom: spacing[2],
              }}>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                COMMUNITY EVENT
              </Text>
            </View>
            <Text variant="h1" style={{ fontSize: 32, lineHeight: 38, fontFamily: typography.fontFamily.bold }}>
              Anand Medo, Vadodara
            </Text>
            <Text variant="body" color={colors.primary.DEFAULT} style={{ marginTop: 4, fontFamily: typography.fontFamily.medium }}>
              Indian Cobbler Community
            </Text>
          </View>

          <View style={{ marginTop: spacing[6], gap: spacing[4], paddingHorizontal: spacing[4] }}>
            <LogisticsCard icon="calendar-today" title="October 15, 2024" subtitle="Sunday, 10:00 AM - 08:00 PM" />
            <LogisticsCard icon="map" title="Pragati Maidan, Hall 7" subtitle="Mathura Rd, New Delhi, Delhi 110001" />
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[8] }}>
            <Text variant="h4" style={{ marginBottom: spacing[3], fontFamily: typography.fontFamily.bold }}>
              About this Event
            </Text>
            <Text variant="body" color="#475569" style={{ lineHeight: 24 }}>
              Join us for the largest gathering of the Indian Cobbler Community. This national meetup aims to bring
              together artisans, suppliers, and tech innovators from across the country. We will discuss modern
              techniques, sustainable materials, and the future of traditional footwear craftsmanship in India. Don&apos;t
              miss this opportunity to network with fellow professionals and showcase your work.
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: spacing[4],
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(242,120,13,0.1)',
              backgroundColor: 'rgba(242,120,13,0.05)',
              padding: spacing[4],
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
              <MaterialIcons name="add-circle" size={22} color={colors.primary.DEFAULT} />
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                Select Add-ons
              </Text>
            </View>
            <View style={{ gap: spacing[3] }}>
              {eventRegistrationAddOns.map((item) => (
                <AddOnRow key={item.key} title={item.title} subtitle={item.subtitle} quantity={item.quantity} />
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: spacing[4],
            ...shadows.lg,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 1 }}>
                Total Amount
              </Text>
              <Text variant="h2" style={{ fontFamily: typography.fontFamily.bold }}>
                ₹700
              </Text>
            </View>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing[2],
                borderRadius: radius.xl,
                backgroundColor: colors.primary.DEFAULT,
                paddingHorizontal: spacing[8],
                paddingVertical: 14,
              }}>
              <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
                Pay &amp; Register
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
