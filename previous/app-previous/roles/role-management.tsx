import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const roleCards = [
  {
    title: 'Super Admin',
    subtitle: 'Ultimate access to all modules',
    icon: '🛡️',
    primary: true,
    permissions: ['Manage Members', 'Financial Approvals', 'System Settings', 'Content Moderation', '+8 more'],
  },
  {
    title: 'Event Admin',
    subtitle: 'Organizes community gatherings',
    icon: '📅',
    permissions: ['Create Events', 'RSVP Management', 'Vendor Contacts'],
  },
  {
    title: 'Donation Admin',
    subtitle: 'Manages fund collection & relief',
    icon: '❤️',
    permissions: ['Approve Donations', 'Financial Auditing'],
  },
  {
    title: 'Matrimony Admin',
    subtitle: 'Profile verification & matching',
    icon: '💛',
    permissions: ['Profile Verification', 'Private Messaging'],
  },
];

const permissionReference = [
  { icon: '👥', label: 'Manage Members', enabled: true },
  { icon: '📣', label: 'Create Events', enabled: true },
  { icon: '💳', label: 'Approve Donations', enabled: false },
  { icon: '⚖️', label: 'Content Moderation', enabled: false },
];

export default function RoleManagementScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconButton}>
            <Text style={styles.iconButtonText}>←</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Role Management</Text>
            <Text style={styles.headerSubtitle}>Configure community access levels</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.smallIconButton}>
            <Text style={styles.smallIconText}>⌕</Text>
          </View>
          <View style={styles.smallIconButton}>
            <Text style={styles.smallIconText}>☰</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionHeading}>Existing Roles</Text>
          <Text style={styles.pill}>6 Roles Active</Text>
        </View>

        <View style={styles.stack}>
          {roleCards.map((role) => (
            <View key={role.title} style={styles.roleCard}>
              <View style={styles.roleTop}>
                <View style={styles.roleMetaRow}>
                  <View style={[styles.roleIcon, role.primary ? styles.roleIconPrimary : styles.roleIconSoft]}>
                    <Text style={[styles.roleIconGlyph, role.primary && styles.roleIconGlyphPrimary]}>{role.icon}</Text>
                  </View>
                  <View>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                  </View>
                </View>
                <TouchableOpacity style={role.primary ? styles.editPrimary : styles.editSoft}>
                  <Text style={role.primary ? styles.editPrimaryText : styles.editSoftText}>✎ Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={role.primary ? styles.roleSummaryPrimary : styles.roleSummary}>
                <Text style={role.primary ? styles.summaryLabelPrimary : styles.summaryLabel}>Permissions Summary</Text>
                <View style={styles.permissionChips}>
                  {role.permissions.map((permission) => (
                    <Text key={permission} style={role.primary ? styles.permissionChipPrimary : styles.permissionChip}>
                      {permission}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.referenceBlock}>
          <Text style={styles.sectionHeading}>Quick Permission Reference</Text>
          <View style={styles.referenceCard}>
            {permissionReference.map((permission) => (
              <View key={permission.label} style={styles.referenceRow}>
                <View style={styles.referenceLeft}>
                  <Text style={styles.referenceIcon}>{permission.icon}</Text>
                  <Text style={styles.referenceLabel}>{permission.label}</Text>
                </View>
                <View style={[styles.toggleTrack, permission.enabled ? styles.toggleTrackOn : styles.toggleTrackOff]}>
                  <View style={[styles.toggleKnob, permission.enabled && styles.toggleKnobOn]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <View style={styles.nav}>
        {[
          ['⌂', 'Home'],
          ['👤', 'Roles'],
          ['👥', 'Users'],
          ['⚙', 'Settings'],
        ].map(([icon, label]) => (
          <View key={label} style={styles.navItemWrap}>
            <Text style={[styles.navIcon, label === 'Roles' && styles.navActive]}>{icon}</Text>
            <Text style={[styles.navLabel, label === 'Roles' && styles.navActive]}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 120, 13, 0.1)',
    backgroundColor: 'rgba(248, 247, 245, 0.95)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(242, 120, 13, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: '#f2780d',
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallIconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(242, 120, 13, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallIconText: {
    color: '#f2780d',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 110,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(242, 120, 13, 0.2)',
    color: '#f2780d',
    fontSize: 11,
    fontWeight: '700',
    borderRadius: 999,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  stack: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(242, 120, 13, 0.05)',
  },
  roleTop: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 120, 13, 0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  roleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconPrimary: {
    backgroundColor: '#f2780d',
  },
  roleIconSoft: {
    backgroundColor: 'rgba(242, 120, 13, 0.2)',
  },
  roleIconGlyph: {
    fontSize: 22,
  },
  roleIconGlyphPrimary: {
    color: '#fff',
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  roleSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  editPrimary: {
    backgroundColor: '#f2780d',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editSoft: {
    backgroundColor: 'rgba(242, 120, 13, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editPrimaryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  editSoftText: {
    color: '#f2780d',
    fontSize: 13,
    fontWeight: '700',
  },
  roleSummaryPrimary: {
    padding: 16,
    backgroundColor: 'rgba(242, 120, 13, 0.05)',
  },
  roleSummary: {
    padding: 16,
  },
  summaryLabelPrimary: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f2780d',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  permissionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  permissionChipPrimary: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(242, 120, 13, 0.1)',
    fontSize: 12,
    color: '#0f172a',
  },
  permissionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f8f7f5',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(242, 120, 13, 0.05)',
    fontSize: 12,
    color: '#0f172a',
  },
  referenceBlock: {
    marginTop: 32,
  },
  referenceCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(242, 120, 13, 0.1)',
    gap: 16,
  },
  referenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  referenceIcon: {
    color: '#f2780d',
    fontSize: 18,
  },
  referenceLabel: {
    fontSize: 14,
    color: '#0f172a',
  },
  toggleTrack: {
    width: 36,
    height: 20,
    borderRadius: 999,
    padding: 3,
    justifyContent: 'center',
  },
  toggleTrackOn: {
    backgroundColor: '#f2780d',
  },
  toggleTrackOff: {
    backgroundColor: '#cbd5e1',
  },
  toggleKnob: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  toggleKnobOn: {
    marginLeft: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 92,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f2780d',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f2780d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
  },
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(242, 120, 13, 0.1)',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  navItemWrap: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  navIcon: {
    fontSize: 18,
    color: '#94a3b8',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94a3b8',
  },
  navActive: {
    color: '#f2780d',
  },
});
