import { useEffect, useState } from 'react';

import { useSession } from '@/src/core/providers/session-provider';
import { profileService } from '@/src/features/profile/services/profile-service';
import { apiQueryKeys, useApiQueryClient, useConfiguredApiQuery } from '@/src/services/api';
import type { FamilyMember, StudentRecord, UserProfile } from '@/src/features/profile/types/profile';

export function useProfile() {
  const { session, updateSession } = useSession();
  const queryClient = useApiQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tenantId = session?.user.tenantId ?? null;
  const userId = session?.user.id ?? null;
  const queryKey = apiQueryKeys.profile(tenantId, userId);

  const query = useConfiguredApiQuery<UserProfile>({
    queryKey,
    queryFn: () => profileService.loadProfile(),
    enabled: Boolean(session),
    staleTime: 5 * 60_000,
  });

  async function reload() {
    await query.refetch();
  }

  async function saveProfile(nextProfile: UserProfile) {
    setIsSubmitting(true);
    try {
      const saved = await profileService.updateProfile(nextProfile);
      queryClient.setQueryData(queryKey, saved);
      if (session) {
        await updateSession((current) => ({
          ...current,
          user: {
            ...current.user,
            fullName: saved.fullNameEn || current.user.fullName,
            email: saved.email || current.user.email,
            mobileNumber: saved.mobileNumber || current.user.mobileNumber,
            profilePhotoUrl: saved.profilePhotoUrl ?? current.user.profilePhotoUrl ?? null,
          },
        }));
      }
      return saved;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unable to save profile.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSubmitting,
    errorMessage: query.error instanceof Error ? query.error.message : undefined,
    reload,
    saveProfile,
  };
}

export function useFamilyMembers() {
  const { session } = useSession();
  const tenantId = session?.user.tenantId ?? null;
  const userId = session?.user.id ?? null;
  const query = useConfiguredApiQuery<FamilyMember[]>({
    queryKey: [...apiQueryKeys.profile(tenantId, userId), 'family'],
    queryFn: () => profileService.loadFamilyMembers(),
    enabled: Boolean(session?.accessToken && tenantId && userId),
  });

  return { items: query.data ?? [], isLoading: query.isLoading, reload: query.refetch };
}

export function useStudentRecords() {
  const [items, setItems] = useState<StudentRecord[]>([]);
  useEffect(() => {
    profileService.loadStudentRecords().then(setItems);
  }, []);
  return items;
}
