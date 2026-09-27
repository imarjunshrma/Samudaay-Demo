import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, SearchInput, SelectField, Text } from '@/src/components';
import { audienceTargetOptions, getAudienceTargetOption, type AudienceTargetKey } from '@/src/features/communication/constants/audience-targets';
import { directoryService, type DirectoryMemberItem } from '@/src/features/directory/services/directory-service';
import { colors, spacing } from '@/src/theme';
import type { EventAudience } from '../services/event-service';

export function EventAudienceFields({ value, onChange }: { value: EventAudience; onChange: (value: EventAudience) => void }) {
  const [filters, setFilters] = useState<{ roles: string[] }>({ roles: [] });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [members, setMembers] = useState<DirectoryMemberItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const target = value.allUsers ? 'all' : audienceTargetOptions.find((option) =>
    option.roles?.[0] === value.roleKeys?.[0] && Boolean(value.roleKeys?.length)
    || option.audienceSegments?.[0] === value.audienceSegments?.[0] && Boolean(value.audienceSegments?.length),
  )?.key || 'custom';

  useEffect(() => {
    let active = true;
    directoryService.loadFilterOptions({ userType: 'all' }).then((result) => {
      if (active) setFilters({ roles: result.roles ?? [] });
    }).catch(() => { if (active) setError('Unable to load audience filters.'); });
    return () => { active = false; };
  }, [retry]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      directoryService.loadMembersPage({ userType: 'all', page, limit: 20, q: search.trim() || undefined }).then((result) => {
        if (!active) return;
        setMembers((current) => page === 1 ? result.items : [...current, ...result.items.filter((item) => !current.some((member) => member.id === item.id))]);
        setHasNext(Boolean(result.pagination?.hasNextPage));
      }).catch(() => { if (active) setError('Unable to load members.'); })
        .finally(() => { if (active) setLoading(false); });
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [open, page, search, retry]);

  return (
    <View style={{ gap: spacing[3] }}>
      <Text variant="h4">Event audience</Text>
      <SelectField label="Audience" value={target} variant="registration"
        options={audienceTargetOptions.map((option) => ({ label: option.label, value: option.key }))}
        onSelect={(key) => {
          const option = getAudienceTargetOption(key as AudienceTargetKey);
          onChange({ ...value, allUsers: Boolean(option.allUsers), roleKeys: option.roles ?? [], audienceSegments: option.audienceSegments ?? [] });
        }} />
      {target === 'custom' ? <SelectField label="Role" value={value.roleKeys?.[0] || ''} variant="registration"
        options={[{ label: 'No role filter', value: '' }, ...filters.roles.map((role) => ({ label: role.replace(/_/g, ' '), value: role }))]}
        onSelect={(role) => onChange({ ...value, roleKeys: role ? [role] : [] })} /> : null}
      <Button variant="outline" onPress={() => { setMembers([]); setPage(1); setSearch(''); setHasNext(false); setLoading(true); setOpen(true); }}
        leftIcon={<MaterialIcons name="person-add" size={20} color={colors.primary.DEFAULT} />}>
        {value.memberIds?.length ? `Selected users (${value.memberIds.length})` : 'Select individual users'}
      </Button>
      {value.memberIds?.length ? <Button variant="outline" onPress={() => onChange({ ...value, memberIds: [] })}>Clear selected users</Button> : null}
      {error && !open ? <Pressable onPress={() => { setError(null); setRetry((count) => count + 1); }}><Text color={colors.status.error}>{error} Retry</Text></Pressable> : null}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing[4], backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <View style={{ height: '70%', backgroundColor: colors.background.surface, borderRadius: 8, padding: spacing[4], gap: spacing[3] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="h4">Select users ({value.memberIds?.length || 0})</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setOpen(false)}><MaterialIcons name="close" size={24} color={colors.text.primary} /></Pressable>
            </View>
            <SearchInput value={search} placeholder="Search users" onChangeText={(text) => { setSearch(text); setPage(1); setMembers([]); setHasNext(false); setLoading(true); }} />
            <FlatList data={members} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled"
              onEndReachedThreshold={0.4} onEndReached={() => { if (hasNext && !loading && !error) { setLoading(true); setPage((current) => current + 1); } }}
              ListEmptyComponent={!loading && !error ? <Text>No users found.</Text> : null}
              ListFooterComponent={loading ? <ActivityIndicator color={colors.primary.DEFAULT} /> : error ? <Pressable onPress={() => setRetry((count) => count + 1)}><Text color={colors.status.error}>{error} Retry</Text></Pressable> : null}
              renderItem={({ item }) => {
                const selected = value.memberIds?.includes(item.id) ?? false;
                return <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: selected }}
                  onPress={() => onChange({ ...value, memberIds: selected ? value.memberIds?.filter((id) => id !== item.id) : [...(value.memberIds || []), item.id] })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingVertical: spacing[3] }}>
                  <MaterialIcons name={selected ? 'check-box' : 'check-box-outline-blank'} size={24} color={colors.primary.DEFAULT} />
                  <View style={{ flex: 1 }}><Text>{item.title}</Text><Text variant="caption">{item.memberId || item.phone}</Text></View>
                </Pressable>;
              }} />
            <Button onPress={() => setOpen(false)}>Done</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
