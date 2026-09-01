import { Image, Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, spacing, typography } from '@/src/theme';
import type { KycQueueItem } from '@/src/features/registration/types/registration';

export interface AdminKycActionMenuProps {
  visible: boolean;
  item?: KycQueueItem | null;
  onClose: () => void;
  onReview: (item: KycQueueItem) => void;
  onApprove: (item: KycQueueItem) => void;
  onReject: (item: KycQueueItem) => void;
}

function ActionRow({
  icon,
  label,
  description,
  tone,
  trailingIcon,
  trailingIconColor,
  disabled = false,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  description: string;
  tone: string;
  trailingIcon?: React.ComponentProps<typeof MaterialIcons>['name'];
  trailingIconColor?: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: 84,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ece8df',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
        opacity: disabled ? 0.55 : 1,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], flex: 1, minWidth: 0 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#f2e5d5',
            shadowColor: '#000',
            shadowOpacity: 0.03,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 1 },
            elevation: 1,
          }}>
          <MaterialIcons name={icon} size={19} color={tone} />
        </View>
        <Text
          numberOfLines={2}
          style={{
            color: colors.text.primary,
            fontFamily: typography.fontFamily.medium,
            fontSize: 15,
            flex: 1,
            minWidth: 0,
          }}>
          <Text
            style={{
              color: colors.text.primary,
              fontFamily: typography.fontFamily.bold,
              fontSize: 15,
            }}>
            {label}
          </Text>
          {'\n'}
          <Text
            style={{
              color: colors.text.muted,
              fontFamily: typography.fontFamily.regular,
              fontSize: 12,
              lineHeight: 17,
            }}>
            {description}
          </Text>
        </Text>
      </View>
      {trailingIcon ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginLeft: spacing[2] }}>
          <MaterialIcons name={trailingIcon} size={19} color={trailingIconColor ?? colors.text.muted} />
        </View>
      ) : (
        <MaterialIcons name="chevron-right" size={19} color={colors.text.muted} />
      )}
    </TouchableOpacity>
  );
}

export function AdminKycActionMenu({
  visible,
  item,
  onClose,
  onReview,
  onApprove,
  onReject,
}: AdminKycActionMenuProps) {
  const t = useTranslations('admin.kyc-approvals');
  const allowReviewActions = item?.status === 'Pending';

  if (!item) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(17,24,39,0.48)', justifyContent: 'flex-end' }}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{
            width: '100%',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: colors.background.surface,
            paddingTop: spacing[1],
            paddingBottom: spacing[5],
            paddingHorizontal: spacing[4],
            gap: spacing[3],
          }}>
          <View
            style={{
              alignSelf: 'center',
              width: 46,
              height: 5,
              borderRadius: 999,
              backgroundColor: '#d4d4d8',
              marginBottom: spacing[1],
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[1] }}>
            <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 22, lineHeight: 28 }}>
              {t('menu.title')}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
              }}>
              <MaterialIcons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: '#FCF6E8',
              borderRadius: 24,
              padding: spacing[3],
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[3],
            }}>
            <View style={{ width: 72, height: 72, borderRadius: 20, overflow: 'hidden', backgroundColor: '#ead9c4', borderWidth: 1, borderColor: '#f5e9d8' }}>
              {item.photoUrl ? (
                <Image source={{ uri: item.photoUrl }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8dccd' }}>
                  <MaterialIcons name="person" size={34} color={colors.primary.DEFAULT} />
                </View>
              )}
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                numberOfLines={1}
                style={{
                  color: '#4a2f16',
                  fontSize: 23,
                  lineHeight: 28,
                  fontFamily: typography.fontFamily.bold,
                  fontStyle: 'italic',
                }}>
                {item.memberName}
              </Text>
              <Text style={{ color: colors.text.muted, fontSize: 14, marginTop: 2 }}>
                {t('meta.applicationId').replace('{id}', item.memberId || `#${item.id.slice(0, 5).toUpperCase()}`)}
              </Text>
            </View>
          </View>

          <View style={{ gap: spacing[2], paddingHorizontal: spacing[1] }}>
            <ActionRow
              icon="manage-search"
              label={t('menu.viewProfile')}
              description={t('menu.viewProfileDesc')}
              tone={colors.primary.DEFAULT}
              onPress={() => {
                onClose();
                onReview(item);
              }}
            />
            <ActionRow
              icon="contact-mail"
              label={t('menu.contactApplicant')}
              description={t('menu.contactApplicantDesc')}
              tone="#a0522d"
              trailingIcon="phone"
              trailingIconColor="#9ca3af"
              onPress={() => {
                onClose();
                onReview(item);
              }}
            />
            <ActionRow
              icon="badge"
              label={t('menu.verifyDocs')}
              description={t('menu.verifyDocsDesc')}
              tone="#a0522d"
              onPress={() => {
                onClose();
                onReview(item);
              }}
            />
            {allowReviewActions ? (
              <>
                <ActionRow
                  icon="check-circle"
                  label={t('menu.approve')}
                  description={t('menu.approveDesc')}
                  tone={colors.status.success}
                  trailingIcon="done"
                  trailingIconColor={colors.status.success}
                  onPress={() => {
                    onClose();
                    onApprove(item);
                  }}
                />
                <ActionRow
                  icon="block"
                  label={t('menu.reject')}
                  description={t('menu.rejectDesc')}
                  tone={colors.status.error}
                  trailingIcon="close"
                  trailingIconColor={colors.status.error}
                  onPress={() => {
                    onClose();
                    onReject(item);
                  }}
                />
              </>
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
