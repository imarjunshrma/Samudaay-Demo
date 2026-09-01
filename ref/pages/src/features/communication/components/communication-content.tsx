import { Image, Pressable, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import {
  birthdayCardTemplates,
  birthdayToday,
  birthdayUpcoming,
  birthdaysBottomNav,
  communityChatGroups,
  communityChatTabs,
  communityChatsBottomNav,
  createNotificationFields,
  notificationItems,
  notificationsBottomNav,
} from '../constants';
import { colors, radius, spacing, typography } from '@/src/theme';

export function NotificationsContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <View style={{ position: 'sticky' as never, top: 0, zIndex: 10, backgroundColor: 'rgba(248,247,245,0.92)', borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
              <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full }}>
                <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
              </View>
              <Text variant="h4" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>Notifications</Text>
            </View>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>Mark all as read</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: spacing[8], paddingHorizontal: spacing[4] }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: colors.primary.DEFAULT, paddingTop: spacing[2], paddingBottom: spacing[3] }}>
              <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>All</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent', paddingTop: spacing[2], paddingBottom: spacing[3] }}>
              <Text variant="caption" color="#6b7280" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>Unread</Text>
            </View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
          <Text variant="caption" color="#6b7280" style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[2], paddingTop: spacing[6], fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1.5 }}>Today</Text>
          {notificationItems.slice(0, 2).map((item) => (
            <View key={item.title} style={{ flexDirection: 'row', gap: spacing[4], backgroundColor: colors.background.surface, marginHorizontal: spacing[4], marginVertical: 4, padding: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(242,120,13,0.05)' }}>
              <View style={{ position: 'relative' }}>
                {item.image ? (
                  <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: 48, height: 48, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary.borderLight }} />
                ) : (
                  <View style={{ width: 48, height: 48, borderRadius: radius.full, backgroundColor: 'rgba(242,120,13,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={colors.primary.DEFAULT} />
                  </View>
                )}
                {item.unread ? <View style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary.DEFAULT, borderWidth: 2, borderColor: '#fff' }} /> : null}
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>{item.title}</Text>
                  <Text variant="caption" color="#94a3b8" style={{ fontSize: 10, fontFamily: typography.fontFamily.medium, textTransform: 'uppercase' }}>{item.time}</Text>
                </View>
                <Text variant="caption" color="#64748b" style={{ lineHeight: 18 }}>{item.desc}</Text>
              </View>
            </View>
          ))}
          <Text variant="caption" color="#6b7280" style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[2], paddingTop: spacing[6], fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1.5 }}>Yesterday</Text>
          {notificationItems.slice(2).map((item) => (
            <View key={item.title} style={{ flexDirection: 'row', gap: spacing[4], backgroundColor: 'rgba(241,245,249,0.5)', marginHorizontal: spacing[4], marginVertical: 4, padding: spacing[4], borderRadius: radius.xl, opacity: 0.8 }}>
              {item.image ? (
                <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: 48, height: 48, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primary.borderLight }} />
              ) : (
                <View style={{ width: 48, height: 48, borderRadius: radius.full, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color="#64748b" />
                </View>
              )}
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text variant="caption" color="#475569" style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>{item.title}</Text>
                  <Text variant="caption" color="#94a3b8" style={{ fontSize: 10, fontFamily: typography.fontFamily.medium, textTransform: 'uppercase' }}>{item.time}</Text>
                </View>
                <Text variant="caption" color="#6b7280" style={{ lineHeight: 18 }}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, backgroundColor: colors.background.DEFAULT, paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[6] }}>
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            {notificationsBottomNav.map((item) => (
              <View key={item.label} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
                <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: 10, fontFamily: item.active ? typography.fontFamily.bold : typography.fontFamily.medium }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function CreateNotificationContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing[5], paddingBottom: 48, gap: spacing[5] }}>
        <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
          Create Notification
        </Text>
        <View style={{ gap: spacing[4], borderRadius: 28, backgroundColor: '#ffffff', padding: spacing[5] }}>
          {createNotificationFields.map(([label, placeholder]) => (
            <View key={label} style={{ gap: spacing[2] }}>
              <Text variant="caption" color={colors.text.secondary} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {label}
              </Text>
              <TextInput
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                style={{
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: colors.border.DEFAULT,
                  backgroundColor: '#ffffff',
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[4],
                  fontFamily: typography.fontFamily.medium,
                }}
              />
            </View>
          ))}
          <View style={{ gap: spacing[2] }}>
            <Text variant="caption" color={colors.text.secondary} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Message
            </Text>
            <TextInput
              multiline
              placeholder="Write your notification message"
              placeholderTextColor="#94a3b8"
              style={{
                minHeight: 128,
                textAlignVertical: 'top',
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: colors.border.DEFAULT,
                backgroundColor: '#ffffff',
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[4],
                fontFamily: typography.fontFamily.medium,
              }}
            />
          </View>
        </View>
        <View style={{ borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4], alignItems: 'center' }}>
          <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
            Send Notification
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function CommunityChatsContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing[4], paddingBottom: spacing[2] }}>
          <View style={{ width: 48, height: 48, alignItems: 'flex-start', justifyContent: 'center' }}>
            <MaterialIcons name="menu" size={24} color={colors.text.primary} />
          </View>
          <Text variant="h5" style={{ flex: 1, fontFamily: typography.fontFamily.bold }}>
            Community Chats
          </Text>
          <View style={{ width: 48, alignItems: 'flex-end' }}>
            <MaterialIcons name="group-add" size={24} color={colors.primary.DEFAULT} />
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
          <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, backgroundColor: 'rgba(242,120,13,0.1)' }}>
            <View style={{ paddingLeft: spacing[4], paddingRight: spacing[2] }}>
              <MaterialIcons name="search" size={22} color="rgba(242,120,13,0.6)" />
            </View>
            <Text variant="body" color="rgba(242,120,13,0.6)">
              Search groups...
            </Text>
          </View>
        </View>

        <View style={{ paddingBottom: spacing[3] }}>
          <View style={{ flexDirection: 'row', gap: spacing[8], borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', paddingHorizontal: spacing[4] }}>
            {communityChatTabs.map((tab, index) => (
              <View key={tab} style={{ borderBottomWidth: 3, borderBottomColor: index === 0 ? colors.primary.DEFAULT : 'transparent', paddingTop: spacing[4], paddingBottom: 13, alignItems: 'center' }}>
                <Text variant="caption" color={index === 0 ? colors.text.primary : 'rgba(242,120,13,0.6)'} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                  {tab}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
          {communityChatGroups.map((group) => (
            <View key={group.title} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing[4], paddingHorizontal: spacing[4], paddingVertical: spacing[3] }}>
              <View style={{ flexDirection: 'row', gap: spacing[4], flex: 1 }}>
                <Image source={{ uri: group.image }} resizeMode="cover" style={{ width: 60, height: 60, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(242,120,13,0.2)' }} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text variant="body" color={colors.text.primary} style={{ fontFamily: group.active ? typography.fontFamily.bold : typography.fontFamily.medium }}>
                      {group.title}
                    </Text>
                    <Text variant="caption" color={group.active ? colors.primary.DEFAULT : '#64748b'} style={{ fontSize: 12, fontFamily: group.active ? typography.fontFamily.medium : typography.fontFamily.regular }}>
                      {group.time}
                    </Text>
                  </View>
                  <Text variant="caption" color={group.active ? 'rgba(242,120,13,0.8)' : '#64748b'} style={{ marginTop: 2, fontFamily: group.active ? typography.fontFamily.semibold : typography.fontFamily.regular, fontSize: 14 }}>
                    {group.preview}
                  </Text>
                  <Text variant="caption" color="#64748b" style={{ marginTop: 4, fontSize: 12 }}>
                    {group.members}
                  </Text>
                </View>
              </View>
              {group.unread ? (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 24, height: 24, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
                    <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
                      {group.unread}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>

        <View style={{ position: 'absolute', right: spacing[6], bottom: 96, width: 56, height: 56, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="chat" size={24} color="#ffffff" />
        </View>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: 'rgba(242,120,13,0.1)', backgroundColor: colors.background.DEFAULT, paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[6] }}>
          <View style={{ flexDirection: 'row' }}>
            {communityChatsBottomNav.map((item) => (
              <View key={item.label} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : 'rgba(242,120,13,0.6)'} />
                <Text variant="caption" color={item.active ? colors.primary.DEFAULT : 'rgba(242,120,13,0.6)'} style={{ fontSize: 12, fontFamily: typography.fontFamily.medium }}>
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

export function BirthdayRemindersContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', backgroundColor: colors.background.DEFAULT, padding: spacing[4], paddingBottom: spacing[2] }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
          <Text variant="h5" style={{ flex: 1, textAlign: 'center', fontFamily: typography.fontFamily.bold }}>
            Birthday Reminders
          </Text>
          <MaterialIcons name="notifications" size={22} color={colors.primary.DEFAULT} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 88 }}>
          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[6], backgroundColor: 'rgba(242,120,13,0.08)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
              <MaterialIcons name="celebration" size={24} color={colors.primary.DEFAULT} />
              <Text variant="h3" style={{ fontFamily: typography.fontFamily.bold }}>
                Today&apos;s Birthdays
              </Text>
            </View>
            <Text variant="caption" color="#64748b" style={{ fontSize: 14 }}>
              Don&apos;t forget to wish your fellow community members!
            </Text>
          </View>

          <View style={{ gap: spacing[3], marginTop: spacing[4], paddingHorizontal: spacing[4] }}>
            {birthdayToday.map((item) => (
              <View key={item.name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(242,120,13,0.05)', backgroundColor: '#ffffff', padding: spacing[4] }}>
                <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: 56, height: 56, borderRadius: radius.full, borderWidth: 2, borderColor: 'rgba(242,120,13,0.2)' }} />
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                    {item.name}
                  </Text>
                  <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                    {item.meta}
                  </Text>
                </View>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.lg, backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
                  <MaterialIcons name="send" size={14} color="#ffffff" />
                  <Text variant="caption" color="#ffffff" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                    Wish
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[8], paddingBottom: spacing[3] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[4] }}>
              <MaterialIcons name="calendar-month" size={22} color="#64748b" />
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                Upcoming this week
              </Text>
            </View>
            <View>
              {birthdayUpcoming.map((item) => (
                <View key={item.name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4], borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.05)', paddingHorizontal: spacing[2], paddingVertical: spacing[3] }}>
                  <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: 48, height: 48, borderRadius: radius.full, opacity: 0.8 }} />
                  <View style={{ flex: 1 }}>
                    <Text variant="caption" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                      {item.name}
                    </Text>
                    <Text variant="caption" color="#64748b" style={{ fontSize: 12 }}>
                      {item.date}
                    </Text>
                  </View>
                  <Pressable style={{ borderRadius: radius.lg, backgroundColor: 'rgba(242,120,13,0.1)', paddingHorizontal: spacing[3], paddingVertical: spacing[2] }}>
                    <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
                      Set Alert
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: 'rgba(242,120,13,0.1)', backgroundColor: colors.background.DEFAULT, paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: spacing[3] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {birthdaysBottomNav.map((item) => (
              <View key={item.label} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#94a3b8'} />
                <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#94a3b8'} style={{ fontSize: 10, fontFamily: item.active ? typography.fontFamily.bold : typography.fontFamily.medium }}>
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

export function SendBirthdayCardContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(242,120,13,0.1)', padding: spacing[4], paddingBottom: spacing[2] }}>
          <View style={{ width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </View>
          <Text variant="h5" style={{ marginLeft: spacing[2], fontFamily: typography.fontFamily.bold }}>
            Send Birthday Card
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: spacing[4], paddingTop: spacing[6], paddingBottom: spacing[2] }}>
            <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
              Select a Template
            </Text>
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
              View All
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[4], padding: spacing[4] }}>
            {birthdayCardTemplates.map((item) => (
              <View key={item.title} style={{ width: '47%', aspectRatio: 3 / 4, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 2, borderColor: item.selected ? colors.primary.DEFAULT : 'transparent', position: 'relative' }}>
                <Image source={{ uri: item.image }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: 'rgba(0,0,0,0.25)' }} />
                {item.selected ? (
                  <View style={{ position: 'absolute', right: spacing[2], top: spacing[2], width: 24, height: 24, borderRadius: radius.full, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="check" size={14} color="#ffffff" />
                  </View>
                ) : null}
                <Text variant="caption" color="#ffffff" style={{ position: 'absolute', left: spacing[4], right: spacing[4], bottom: spacing[4], fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[6] }}>
            <Text variant="h4" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
              Your Message
            </Text>
            <View>
              <View style={{ minHeight: 128, borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(242,120,13,0.2)', backgroundColor: '#ffffff', padding: spacing[4] }}>
                <Text variant="body" color="#94a3b8">
                  Write a heartfelt birthday message...
                </Text>
              </View>
              <Text variant="caption" color="#94a3b8" style={{ position: 'absolute', right: spacing[3], bottom: spacing[3], fontSize: 12 }}>
                0/250
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[8] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(242,120,13,0.1)', backgroundColor: 'rgba(242,120,13,0.05)', padding: spacing[4] }}>
              <View style={{ width: 48, height: 48, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(242,120,13,0.3)', backgroundColor: 'rgba(242,120,13,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="person" size={24} color={colors.primary.DEFAULT} />
              </View>
              <View>
                <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Sending to
                </Text>
                <Text variant="body" style={{ fontFamily: typography.fontFamily.bold }}>
                  Arjun Sharma
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(242,120,13,0.1)', backgroundColor: colors.background.DEFAULT, padding: spacing[4] }}>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2], borderRadius: radius.xl, backgroundColor: colors.primary.DEFAULT, paddingVertical: spacing[4] }}>
            <Text variant="body" color="#ffffff" style={{ fontFamily: typography.fontFamily.bold }}>
              Send Birthday Card
            </Text>
            <MaterialIcons name="send" size={18} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
