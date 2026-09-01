import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text } from '@/src/components';
import { colors, radius, spacing, typography } from '@/src/theme';
import { publicationFeedService, type PublicationRecord } from '@/src/features/publications/services/publication-feed-service';

export function CommunityPublicationCard() {
  const router = useRouter();
  const [publications, setPublications] = useState<PublicationRecord[]>([]);

  useEffect(() => {
    let active = true;

    void publicationFeedService.loadArchive()
      .then((items) => {
        if (active) {
          setPublications(items);
        }
      })
      .catch(() => {
        if (active) {
          setPublications([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredPublication = useMemo(
    () => publications.find((item) => item.status === 'PUBLISHED') || publications[0] || null,
    [publications],
  );

  if (!featuredPublication) {
    return null;
  }

  const title = featuredPublication.title;
  const issueLabel = featuredPublication.issueNo || featuredPublication.edition || 'Publication';
  const description = featuredPublication.description?.trim() || 'Open the latest community publication.';

  function handleOpenArchive() {
    router.push('/publications/archive' as never);
  }

  async function handleRead() {
    try {
      const config = await publicationFeedService.getPublicationReadConfig(featuredPublication);
      router.push({
        pathname: '/pdf-viewer',
        params: {
          title: config.title,
          url: config.url,
          ...(config.headers ? { headers: JSON.stringify(config.headers) } : {}),
        },
      } as never);
    } catch (error) {
      Alert.alert('Publication', error instanceof Error ? error.message : 'Unable to open publication.');
    }
  }

  return (
    <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[4] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
        <Text variant="h4" color={colors.text.primary} style={{ fontFamily: typography.fontFamily.bold }}>
          Monthly Publication
        </Text>
        <Pressable onPress={handleOpenArchive} accessibilityRole="button" hitSlop={8}>
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.semibold, fontSize: 14 }}>
            View Archive
          </Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing[4], padding: spacing[4], borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primary.borderLight, backgroundColor: 'rgba(242,120,13,0.05)' }}>
        {featuredPublication.coverImageUrl ? (
          <View style={{ width: 96, height: 128, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' }}>
            <Image source={{ uri: featuredPublication.coverImageUrl }} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
          </View>
        ) : (
          <View style={{ width: 96, height: 128, borderRadius: radius.lg, backgroundColor: colors.primary.subtle, borderWidth: 1, borderColor: colors.primary.borderLight, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[2] }}>
            <MaterialIcons name="menu-book" size={28} color={colors.primary.DEFAULT} />
            <Text variant="caption" color={colors.primary.DEFAULT} style={{ marginTop: spacing[2], textAlign: 'center', fontFamily: typography.fontFamily.bold, fontSize: 10 }}>
              {issueLabel}
            </Text>
          </View>
        )}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text variant="caption" color={colors.primary.DEFAULT} style={{ fontFamily: typography.fontFamily.bold, textTransform: 'uppercase', letterSpacing: 1 }}>
            {issueLabel}
          </Text>
          <Text variant="bodyLg" color={colors.text.primary} style={{ marginTop: 4, fontFamily: typography.fontFamily.bold }}>
            {title}
          </Text>
          <Text variant="caption" color="#64748b" style={{ marginTop: spacing[2], fontSize: 12, lineHeight: 18 }}>
            {description}
          </Text>
          <Pressable onPress={() => void handleRead()} accessibilityRole="button" style={{ marginTop: spacing[3], alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing[2], backgroundColor: colors.primary.DEFAULT, paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: radius.lg }}>
            <MaterialIcons name="menu-book" size={16} color="#fff" />
            <Text variant="caption" color="#fff" style={{ fontFamily: typography.fontFamily.bold, fontSize: 12 }}>
              Read Online
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
