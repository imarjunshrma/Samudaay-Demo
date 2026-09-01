import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { myTransactionsBottomNav, myTransactionsItems } from '../constants';
import { colors, radius, spacing, typography } from '@/src/theme';

export function MyTransactionsContent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, maxWidth: 448, width: '100%', alignSelf: 'center', backgroundColor: colors.background.DEFAULT }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(248,247,245,0.92)',
            padding: spacing[4],
            paddingBottom: spacing[2],
          }}>
          <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
          </View>
          <Text variant="h5" color={colors.text.primary} style={{ flex: 1, textAlign: 'center', paddingRight: 40, fontFamily: typography.fontFamily.bold }}>
            My Transactions
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            zIndex: 10,
            paddingHorizontal: spacing[4],
            backgroundColor: colors.background.DEFAULT,
          }}>
          <View style={{ flexDirection: 'row', gap: spacing[4], borderBottomWidth: 1, borderBottomColor: colors.primary.borderLight }}>
            {['All Activities', 'Donations', 'Events', 'Subscriptions'].map((item, index) => (
              <View
                key={item}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomWidth: 2,
                  borderBottomColor: index === 0 ? colors.primary.DEFAULT : 'transparent',
                  paddingHorizontal: spacing[2],
                  paddingTop: spacing[4],
                  paddingBottom: spacing[3],
                }}>
                <Text variant="caption" color={index === 0 ? colors.primary.DEFAULT : '#64748b'} style={{ fontFamily: typography.fontFamily.bold, fontSize: 14 }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 128, paddingBottom: 104 }}>
          <View style={{ padding: spacing[4] }}>
            <View style={{ gap: spacing[2], borderRadius: radius.xl, padding: spacing[6], backgroundColor: 'rgba(242,120,13,0.1)', borderWidth: 1, borderColor: 'rgba(242,120,13,0.2)' }}>
              <Text variant="caption" color="#475569" style={{ fontFamily: typography.fontFamily.medium, textTransform: 'uppercase', letterSpacing: 1 }}>
                Total Contribution
              </Text>
              <Text variant="h1" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                $1,250.00
              </Text>
              <View style={{ marginTop: spacing[2], flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                <MaterialIcons name="verified" size={16} color="#6b7280" />
                <Text variant="caption" color="#6b7280">
                  Last updated: Oct 24, 2023
                </Text>
              </View>
            </View>
          </View>

          <View style={{ gap: 4, paddingHorizontal: spacing[4], paddingBottom: 96 }}>
            <Text variant="caption" color="#6b7280" style={{ paddingBottom: spacing[3], fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Recent Transactions
            </Text>
            {myTransactionsItems.map((item) => (
              <View
                key={`${item.title}-${item.amount}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: spacing[4],
                  marginBottom: spacing[2],
                  backgroundColor: colors.background.surface,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  borderColor: 'rgba(242,120,13,0.08)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 2,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
                  <View style={{ width: 48, height: 48, borderRadius: radius.full, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name={item.icon} size={24} color={item.tone} />
                  </View>
                  <View>
                    <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                      {item.title}
                    </Text>
                    <Text variant="caption" color="#6b7280" style={{ fontFamily: typography.fontFamily.medium }}>
                      {item.meta}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', gap: spacing[2] }}>
                  <Text variant="body" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
                    {item.amount}
                  </Text>
                  <Pressable accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialIcons name="picture-as-pdf" size={16} color={colors.primary.DEFAULT} />
                    <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                      Receipt
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            borderTopWidth: 1,
            borderTopColor: colors.primary.borderLight,
            backgroundColor: colors.background.DEFAULT,
            paddingHorizontal: spacing[4],
            paddingTop: spacing[2],
            paddingBottom: spacing[4],
          }}>
          {myTransactionsBottomNav.map((item) => (
            <View key={item.label} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>['name']} size={24} color={item.active ? colors.primary.DEFAULT : '#6b7280'} />
              <Text variant="caption" color={item.active ? colors.primary.DEFAULT : '#6b7280'} style={{ fontSize: 10, fontFamily: item.active ? typography.fontFamily.bold : typography.fontFamily.medium }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
