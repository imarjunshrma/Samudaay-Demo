import { Image, Pressable, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import {
  eventSecondaryAddOns,
  eventSecondaryGalleryImages,
  eventSecondaryHero,
  eventSecondaryMessages,
} from '../constants';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

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

function GalleryEventDetailsCore() {
  return (
    <>
      <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
        <View style={{ borderRadius: radius.xl, overflow: 'hidden', position: 'relative', ...shadows.md }}>
          <Image source={{ uri: eventSecondaryHero }} resizeMode="cover" style={{ width: '100%', aspectRatio: 16 / 9 }} />
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
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
        {[
          { icon: 'calendar-today' as const, title: 'October 15, 2024', subtitle: 'Sunday, 10:00 AM - 08:00 PM' },
          { icon: 'map' as const, title: 'Pragati Maidan, Hall 7', subtitle: 'Mathura Rd, New Delhi, Delhi 110001' },
        ].map((item) => (
          <View
            key={item.title}
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
              <MaterialIcons name={item.icon} size={22} color={colors.primary.DEFAULT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                {item.title}
              </Text>
              <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
                {item.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[8] }}>
        <Text variant="h4" style={{ marginBottom: spacing[3], fontFamily: typography.fontFamily.bold }}>
          About this Event
        </Text>
        <Text variant="body" color="#475569" style={{ lineHeight: 24 }}>
          Join us for the largest gathering of the Indian Cobbler Community. This national meetup aims to bring
          together artisans, suppliers, and tech innovators from across the country. We will discuss modern
          techniques, sustainable materials, and the future of traditional footwear craftsmanship in India. Don&apos;t miss
          this opportunity to network with fellow professionals and showcase your work.
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
          {eventSecondaryAddOns.map((item) => (
            <View
              key={item.key}
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
                <View style={{ width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: '#cbd5e1' }} />
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                    {item.title}
                  </Text>
                  <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <View style={{ width: 32, height: 32, borderRadius: radius.full, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' }}>
                  <Text variant="body" color="#94a3b8" style={{ fontFamily: typography.fontFamily.bold }}>
                    -
                  </Text>
                </View>
                <Text variant="body" style={{ width: 16, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
                  1
                </Text>
                <View style={{ width: 32, height: 32, borderRadius: radius.full, backgroundColor: 'rgba(242,120,13,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text variant="body" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                    +
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

function EventGalleryBottomBar() {
  return (
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
          <MaterialIcons name="photo-library" size={20} color="#ffffff" />
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            View Event Photos
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function EventBottomTabs({ active }: { active: 'gallery' | 'dashboard' | 'none' }) {
  const items =
    active === 'dashboard'
      ? [
          { icon: 'dashboard', label: 'Dashboard', active: true },
          { icon: 'calendar-today', label: 'Events', active: false },
          { icon: 'group', label: 'Community', active: false },
          { icon: 'person', label: 'Profile', active: false },
        ]
      : [
          { icon: 'calendar-today', label: 'Events', active: false },
          { icon: 'photo-library', label: 'Gallery', active: true },
          { icon: 'search', label: 'Search', active: false },
          { icon: 'person', label: 'Profile', active: false },
        ];

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: 'rgba(242,120,13,0.1)',
        backgroundColor: colors.background.DEFAULT,
        paddingHorizontal: spacing[4],
        paddingTop: spacing[2],
        paddingBottom: spacing[6],
      }}>
      <View style={{ flexDirection: 'row' }}>
        {items.map((item) => (
          <View key={item.label} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
            <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
            <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: active === 'dashboard' ? 10 : 12, fontFamily: item.active ? typography.fontFamily.bold : typography.fontFamily.medium, textTransform: active === 'dashboard' ? 'uppercase' : 'none' }}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function EventGalleryDetailContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <EventTopBar />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
          <GalleryEventDetailsCore />
        </ScrollView>
        <Pressable
          style={{
            position: 'absolute',
            right: spacing[4],
            bottom: 96,
            zIndex: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[2],
            borderRadius: radius.full,
            backgroundColor: colors.primary.DEFAULT,
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[3],
            ...shadows.lg,
          }}>
          <MaterialIcons name="forum" size={20} color="#ffffff" />
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            Join Live Chat
          </Text>
        </Pressable>
        <EventGalleryBottomBar />
      </View>
    </SafeAreaView>
  );
}

export function EventLiveChatContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[4], paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)' }}>
          <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </View>
          <Text variant="h5" style={{ flex: 1, textAlign: 'center', paddingHorizontal: spacing[2], fontFamily: typography.fontFamily.bold }}>
            National Meetup Delhi - Live
          </Text>
          <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="share" size={22} color={colors.text.primary} />
          </View>
        </View>

        <View style={{ position: 'relative', width: '100%', aspectRatio: 16 / 9, backgroundColor: '#0f172a' }}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-sE38YZKkGnLB0ndUFqGdVzJaQV9PpQ7hdz0-dZeth4lsY9lAmo0n2sY75owSimLgXrEFNRCY1oaNcG8u6QSp42j_wTEAQJYq1jQYLylGCdNZH15anEfDS2ZVaKkge3kWbdOlu17y8xyJpfHX_K3x89W0aX1VNyvvv9nYM_CWG5E4DhbUf-87woKJBfpJQogz6awieP7s1xbpf45V39LgL9feU70j9iIcQZEwchoRr5wnOzKG0Dap9dUjd2DN3SLTRAA1d0EPuSIy' }} resizeMode="cover" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0.8 }} />
          <View style={{ position: 'absolute', top: spacing[4], left: spacing[4], flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.md, backgroundColor: '#dc2626', paddingHorizontal: spacing[2], paddingVertical: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: radius.full, backgroundColor: '#ffffff' }} />
              <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                LIVE
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.md, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: spacing[2], paddingVertical: 4 }}>
              <MaterialIcons name="visibility" size={12} color="#ffffff" />
              <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.medium, fontSize: 10 }}>
                1.2k
              </Text>
            </View>
          </View>
          <View style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -32, marginTop: -32, width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', ...shadows.lg }}>
            <MaterialIcons name="play-arrow" size={40} color="#ffffff" />
          </View>
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing[4], backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing[2] }}>
              <View style={{ height: 4, flex: 1, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT }} />
              <View style={{ width: 12, height: 12, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, borderWidth: 2, borderColor: '#ffffff' }} />
              <View style={{ height: 4, width: 96, borderRadius: radius.full, backgroundColor: 'rgba(255,255,255,0.3)' }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                <MaterialIcons name="pause" size={20} color="#ffffff" />
                <MaterialIcons name="volume-up" size={20} color="#ffffff" />
                <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.medium }}>
                  12:45 / 45:00
                </Text>
              </View>
              <MaterialIcons name="fullscreen" size={20} color="#ffffff" />
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', backgroundColor: 'rgba(242,120,13,0.05)', paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <MaterialIcons name="forum" size={18} color={colors.primary.DEFAULT} />
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
              Live Chat
            </Text>
          </View>
          <MaterialIcons name="settings" size={18} color="#94a3b8" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4], gap: spacing[6], paddingBottom: spacing[4] }} style={{ flex: 1 }}>
          {eventSecondaryMessages.slice(0, 2).map((message) => (
            <View key={message.time} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
              <Image source={{ uri: message.avatar }} resizeMode="cover" style={{ width: 36, height: 36, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(242,120,13,0.1)' }} />
              <View style={{ flex: 1, maxWidth: '85%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: 6 }}>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                    {message.name}
                  </Text>
                  <Text variant="caption" color="#94a3b8" style={{ fontSize: 10 }}>
                    {message.time}
                  </Text>
                </View>
                <View style={{ borderRadius: radius.xl, borderTopLeftRadius: 0, borderWidth: 1, borderColor: 'rgba(242,120,13,0.05)', backgroundColor: '#ffffff', paddingHorizontal: spacing[3], paddingVertical: spacing[2], ...shadows.sm }}>
                  <Text variant="caption" color={colors.text.primary} style={{ fontSize: 14, lineHeight: 20 }}>
                    {message.text}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <View style={{ alignItems: 'center', paddingVertical: spacing[2] }}>
            <View style={{ borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(242,120,13,0.05)', backgroundColor: '#f1f5f9', paddingHorizontal: spacing[3], paddingVertical: 6 }}>
              <Text variant="caption" color="#94a3b8" style={{ fontFamily: typography.fontFamily.medium, fontSize: 11 }}>
                Amit Sharma joined the stream
              </Text>
            </View>
          </View>

          {eventSecondaryMessages.slice(2).map((message) => (
            <View key={message.time} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[3] }}>
              <Image source={{ uri: message.avatar }} resizeMode="cover" style={{ width: 36, height: 36, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(242,120,13,0.1)' }} />
              <View style={{ flex: 1, maxWidth: '85%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: 6 }}>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                    {message.name}
                  </Text>
                  <Text variant="caption" color="#94a3b8" style={{ fontSize: 10 }}>
                    {message.time}
                  </Text>
                </View>
                <View style={{ borderRadius: radius.xl, borderTopLeftRadius: 0, borderWidth: 1, borderColor: 'rgba(242,120,13,0.05)', backgroundColor: '#ffffff', paddingHorizontal: spacing[3], paddingVertical: spacing[2], ...shadows.sm }}>
                  <Text variant="caption" color={colors.text.primary} style={{ fontSize: 14, lineHeight: 20 }}>
                    {message.text}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(242,120,13,0.1)', backgroundColor: '#ffffff', padding: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <View style={{ flex: 1, position: 'relative' }}>
              <TextInput
                placeholder="Type your message..."
                placeholderTextColor="#94a3b8"
                style={{
                  borderRadius: radius.full,
                  backgroundColor: '#f8fafc',
                  borderWidth: 1,
                  borderColor: 'rgba(242,120,13,0.1)',
                  paddingLeft: spacing[4],
                  paddingRight: 44,
                  paddingVertical: 10,
                  color: colors.text.primary,
                }}
              />
              <View style={{ position: 'absolute', right: spacing[3], top: 11 }}>
                <MaterialIcons name="mood" size={20} color="#94a3b8" />
              </View>
            </View>
            <Pressable style={{ width: 44, height: 44, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', ...shadows.md }}>
              <MaterialIcons name="send" size={20} color="#ffffff" />
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], marginTop: spacing[3], paddingHorizontal: spacing[2] }}>
            {[
              { icon: 'card-giftcard', label: 'Support' },
              { icon: 'attachment', label: 'Attach' },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={20} color="#64748b" />
                <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 12 }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function EventPhotoGalleryContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1 }}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', backgroundColor: 'rgba(248,247,245,0.95)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
            <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text variant="h5" style={{ fontFamily: typography.fontFamily.bold }}>
                Annual Meetup 2023
              </Text>
              <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.medium }}>
                October 12-14, 2023
              </Text>
            </View>
            <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcons name="share" size={22} color={colors.text.primary} />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing[4] }}>
            <View style={{ flexDirection: 'row', gap: spacing[6], borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)' }}>
              {['All', 'Community', 'Workshops', 'Crafts'].map((tab, index) => (
                <View key={tab} style={{ alignItems: 'center', borderBottomWidth: 2, borderBottomColor: index === 0 ? colors.primary.DEFAULT : 'transparent', paddingVertical: spacing[3] }}>
                  <Text variant="caption" color={index === 0 ? colors.primary.DEFAULT : '#64748b'} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                    {tab}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4], paddingBottom: 120 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[3] }}>
            {eventSecondaryGalleryImages.map((image, index) => (
              <View
                key={`${image.uri}-${index}`}
                style={{
                  width: '48.2%',
                  aspectRatio: 1,
                  borderRadius: radius.xl,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(242,120,13,0.05)',
                  position: 'relative',
                }}>
                <Image source={{ uri: image.uri }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                {image.label ? (
                  <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing[3], backgroundColor: 'rgba(34,24,16,0.45)' }}>
                    <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.medium, fontSize: 12 }}>
                      {image.label}
                    </Text>
                  </View>
                ) : null}
                {image.workshop ? (
                  <View style={{ position: 'absolute', right: spacing[2], top: spacing[2], borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[2], paddingVertical: 4 }}>
                    <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                      Workshop
                    </Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </ScrollView>

        <Pressable
          style={{
            position: 'absolute',
            right: spacing[6],
            bottom: 96,
            width: 56,
            height: 56,
            borderRadius: radius.full,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.lg,
          }}>
          <MaterialIcons name="photo-camera" size={24} color="#ffffff" />
        </Pressable>

        <EventBottomTabs active="gallery" />
      </View>
    </SafeAreaView>
  );
}
