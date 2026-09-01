import { useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { donationBottomNav, donationHistoryItems } from '../constants';
import { colors, radius, shadows, spacing, typography } from '@/src/theme';

function Header() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.DEFAULT,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: colors.primary.borderLight,
      }}>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.9}
        style={{
          padding: spacing[2],
          borderRadius: radius.full,
        }}>
        <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
      </TouchableOpacity>
      <Text variant="h4" style={{ marginLeft: spacing[2], fontFamily: typography.fontFamily.bold }}>
        Donations
      </Text>
    </View>
  );
}

function OfflineDonationCard() {
  return (
    <View
      style={{
        backgroundColor: '#f1f5f9',
        borderRadius: radius.xl,
        padding: spacing[4],
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#cbd5e1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.full,
            backgroundColor: '#e2e8f0',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name="post-add" size={24} color="#475569" />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="label" style={{ fontFamily: typography.fontFamily.bold }}>
            Record Offline Donation
          </Text>
          <Text variant="caption" color="#64748b">
            Log manual cash or check contributions
          </Text>
        </View>
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.9}
        style={{
          backgroundColor: colors.background.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2],
          ...shadows.sm,
        }}>
        <Text variant="caption" color="#334155" style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
          Add Record
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function DonationListItem({ amount, meta }: { amount: string; meta: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
        backgroundColor: colors.background.surface,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.primary.borderLight,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.full,
            backgroundColor: colors.primary.muted,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons name="history-edu" size={20} color={colors.primary.DEFAULT} />
        </View>
        <View>
          <Text variant="label" style={{ fontFamily: typography.fontFamily.bold }}>
            {amount}
          </Text>
          <Text variant="caption" color="#64748b">
            {meta}
          </Text>
        </View>
      </View>
      <TouchableOpacity accessibilityRole="button" activeOpacity={0.9} style={{ padding: spacing[2], borderRadius: radius.full }}>
        <MaterialIcons name="picture-as-pdf" size={22} color={colors.primary.DEFAULT} />
      </TouchableOpacity>
    </View>
  );
}

function BottomBar() {
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: colors.primary.borderLight,
        backgroundColor: colors.background.DEFAULT,
        paddingHorizontal: spacing[4],
        paddingTop: spacing[2],
        paddingBottom: spacing[3],
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 672, width: '100%', alignSelf: 'center' }}>
        {donationBottomNav.map((item) => (
          <Pressable key={item.key} style={{ alignItems: 'center', gap: 4, minWidth: 64 }}>
            <MaterialIcons name={item.icon} size={24} color={item.active ? colors.primary.DEFAULT : '#9ca3af'} />
            <Text variant="navLabel" color={item.active ? colors.primary.DEFAULT : '#9ca3af'}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function DonationManagementScreen() {
  const [donorType, setDonorType] = useState<'self' | 'behalf'>('self');
  const [amount, setAmount] = useState('1000');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <Header />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={{ padding: spacing[4] }}>
            <View
              style={{
                borderRadius: radius.xl,
                overflow: 'hidden',
                backgroundColor: colors.background.surface,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                ...shadows.sm,
              }}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5lbvs7EK9L2PG_TNfMXqCJT9toXn0_h42qmXwtIhYkpyaYFgpkaVAHPNwNJ8lejIjsgLeK2YE74e6uLkywNnEy05qHOP6dEtg6ZcGWX1ApnEb2IlN0cof9y3ouJmtdCuinWUBEsuUjU8_Bcy9lfDhrXhhPMCUY_4WUPueGxVkrPkdjgQr_Wp1MQX2kkzL6761d8rjVl70lrvytLo9cLmcm5mp5JVAQGVC_W6okrofWD6QqRBW6EAF_HNrH4RIRtB3CoXlbwMxs0FL',
                }}
                resizeMode="cover"
                style={{ width: '100%', aspectRatio: 21 / 9 }}
              />
              <View style={{ padding: spacing[5], gap: 4 }}>
                <Text
                  variant="caption"
                  color={colors.primary.DEFAULT}
                  style={{ fontFamily: typography.fontFamily.semibold, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Your Impact
                </Text>
                <Text variant="h1" style={{ fontFamily: typography.fontFamily.bold }}>
                  ₹45,000
                </Text>
                <Text variant="body" color="#64748b">
                  Total Community Contributions
                </Text>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
            <OfflineDonationCard />
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[6], paddingBottom: spacing[6] }}>
            <Text variant="h3" style={{ marginBottom: spacing[4], fontFamily: typography.fontFamily.bold }}>
              Make a New Donation
            </Text>
            <View
              style={{
                backgroundColor: colors.background.surface,
                padding: spacing[5],
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: colors.primary.borderLight,
                gap: spacing[6],
                ...shadows.sm,
              }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#f1f5f9', padding: 4, borderRadius: radius.lg }}>
                <TouchableOpacity
                  accessibilityRole="button"
                  activeOpacity={0.9}
                  onPress={() => setDonorType('self')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: radius.md,
                    backgroundColor: donorType === 'self' ? colors.background.surface : 'transparent',
                    paddingVertical: spacing[2],
                    ...shadows.sm,
                  }}>
                  <Text variant="caption" color={donorType === 'self' ? colors.primary.DEFAULT : '#64748b'} style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                    Self
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  activeOpacity={0.9}
                  onPress={() => setDonorType('behalf')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: radius.md,
                    backgroundColor: donorType === 'behalf' ? colors.background.surface : 'transparent',
                    paddingVertical: spacing[2],
                    ...shadows.sm,
                  }}>
                  <Text variant="caption" color={donorType === 'behalf' ? colors.primary.DEFAULT : '#64748b'} style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                    On behalf of others
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ gap: spacing[4] }}>
                <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                      Donor Name
                    </Text>
                    <TextInput
                      placeholder="Enter name"
                      placeholderTextColor="#94a3b8"
                      style={{
                        width: '100%',
                        borderRadius: radius.lg,
                        borderWidth: 1,
                        borderColor: colors.primary.border,
                        backgroundColor: colors.background.DEFAULT,
                        paddingHorizontal: spacing[3],
                        paddingVertical: spacing[3],
                        color: colors.text.primary,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                      Relation
                    </Text>
                    <TextInput
                      placeholder="e.g. Spouse, Parent"
                      placeholderTextColor="#94a3b8"
                      style={{
                        width: '100%',
                        borderRadius: radius.lg,
                        borderWidth: 1,
                        borderColor: colors.primary.border,
                        backgroundColor: colors.background.DEFAULT,
                        paddingHorizontal: spacing[3],
                        paddingVertical: spacing[3],
                        color: colors.text.primary,
                      }}
                    />
                  </View>
                </View>

                <View style={{ gap: spacing[2] }}>
                  <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                    Select Amount
                  </Text>
                  <View style={{ flexDirection: 'row', gap: spacing[3] }}>
                    {[500, 1000, 2000].map((item) => {
                      const active = selectedAmount === item;
                      return (
                        <TouchableOpacity
                          key={item}
                          accessibilityRole="button"
                          activeOpacity={0.9}
                          onPress={() => {
                            setSelectedAmount(item);
                            setAmount(String(item));
                          }}
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: radius.lg,
                            borderWidth: 1,
                            borderColor: 'rgba(242, 120, 13, 0.3)',
                            backgroundColor: colors.primary.muted,
                            paddingVertical: spacing[2],
                          }}>
                          <Text variant="body" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold }}>
                            ₹{item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <View style={{ position: 'relative', marginTop: spacing[2], justifyContent: 'center' }}>
                    <Text style={{ position: 'absolute', left: 12, color: '#94a3b8' }}>₹</Text>
                    <TextInput
                      value={amount}
                      onChangeText={(value) => {
                        setAmount(value);
                        setSelectedAmount(null);
                      }}
                      keyboardType="number-pad"
                      placeholder="Enter custom amount"
                      placeholderTextColor="#94a3b8"
                      style={{
                        width: '100%',
                        borderRadius: radius.lg,
                        borderWidth: 1,
                        borderColor: colors.primary.border,
                        backgroundColor: colors.background.DEFAULT,
                        paddingLeft: 24,
                        paddingRight: spacing[3],
                        paddingVertical: spacing[3],
                        color: colors.text.primary,
                      }}
                    />
                  </View>
                </View>

                <View style={{ gap: 4 }}>
                  <Text variant="caption" color="#64748b" style={{ fontFamily: typography.fontFamily.medium, fontSize: 14 }}>
                    Message (Optional)
                  </Text>
                  <TextInput
                    multiline
                    numberOfLines={3}
                    placeholder="Leave a message for the community..."
                    placeholderTextColor="#94a3b8"
                    style={{
                      width: '100%',
                      minHeight: 96,
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: colors.primary.border,
                      backgroundColor: colors.background.DEFAULT,
                      paddingHorizontal: spacing[3],
                      paddingVertical: spacing[3],
                      color: colors.text.primary,
                      textAlignVertical: 'top',
                    }}
                  />
                </View>

                <TouchableOpacity
                  accessibilityRole="button"
                  activeOpacity={0.9}
                  style={{
                    width: '100%',
                    backgroundColor: colors.primary.DEFAULT,
                    borderRadius: radius.lg,
                    paddingVertical: spacing[3],
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: spacing[2],
                    marginTop: spacing[4],
                    ...shadows.md,
                  }}>
                  <MaterialIcons name="volunteer-activism" size={20} color={colors.text.inverse} />
                  <Text variant="body" color={colors.text.inverse} style={{ fontFamily: typography.fontFamily.bold }}>
                    Donate Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
            <OfflineDonationCard />
          </View>

          <View style={{ paddingHorizontal: spacing[4], paddingTop: spacing[6], paddingBottom: spacing[6], marginBottom: spacing[16] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
              <Text variant="h4" style={{ fontFamily: typography.fontFamily.bold }}>
                Recent Donations
              </Text>
              <TouchableOpacity accessibilityRole="button" activeOpacity={0.9}>
                <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: spacing[3] }}>
              {donationHistoryItems.map((item) => (
                <DonationListItem key={`${item.amount}-${item.meta}`} amount={item.amount} meta={item.meta} />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <BottomBar />
        </View>
      </View>
    </SafeAreaView>
  );
}
