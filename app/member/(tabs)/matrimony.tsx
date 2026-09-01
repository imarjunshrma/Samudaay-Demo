import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { CreateMatrimonyProfileContent } from '@/src/features/matrimony/components/create-matrimony-profile-content';
import { MatrimonyDiscoveryContent } from '@/src/features/matrimony/components/matrimony-discovery-content';
import { MatrimonyMessagesContent } from '@/src/features/matrimony/components/matrimony-messages-content';
import { MatrimonyRequestsContent } from '@/src/features/matrimony/components/matrimony-requests-content';
import type { MatrimonyModuleTabKey } from '@/src/features/matrimony/components/matrimony-module-tabs';

/**
 * State-based Matrimony module tab container.
 *
 * WHY: The module tabs (discovery / matches / requests / messages) are peer
 * screens inside the member tab layout. Using router.replace() to switch them
 * pushes into app/matrimony/ — a separate root-stack segment — which:
 *   • hides MemberTabBar (outside the (tabs) layout)
 *   • fires a slide animation (appStackScreenOptions)
 *   • fully remounts the screen → re-fetches data → shows skeleton again
 *
 * SOLUTION: Render each pane conditionally inside this single tab screen.
 * Only one pane is mounted at a time — no display:'none' stacking which can
 * cause SafeAreaView conflicts in react-native-safe-area-context. This means:
 *   ✓ MemberTabBar always visible (we never leave the (tabs) layout)
 *   ✓ No animation on tab switch (no navigation at all)
 *   ✓ No SafeAreaView interference from hidden siblings
 *
 * The /matrimony/ Stack routes (discovery.tsx, requests.tsx, messages.tsx)
 * are kept intact for deep-link and push-notification support.
 *
 * DETAIL SCREENS (discovery-premium, approve-profiles, analytics)
 * still use router.push — they open on the /matrimony/ Stack with slide animation
 * and a back button, as expected.
 */

type ActiveTab = 'discovery' | 'matches' | 'requests' | 'messages' | 'profile';

function parseActiveTab(value?: string | string[]): ActiveTab {
  const tab = Array.isArray(value) ? value[0] : value;
  if (tab === 'matches' || tab === 'requests' || tab === 'messages' || tab === 'profile') {
    return tab;
  }
  return 'discovery';
}

export default function MemberMatrimonyRoute() {
  const params = useLocalSearchParams<{ tab?: string | string[] }>();
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => parseActiveTab(params.tab));

  useEffect(() => {
    setActiveTab(parseActiveTab(params.tab));
  }, [params.tab]);

  const handleTabPress = useCallback((key: MatrimonyModuleTabKey): boolean | void => {
    setActiveTab(key as ActiveTab);
    return true; // signal handled: prevents router.replace inside MatrimonyModuleTabs
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {activeTab === 'discovery' && (
        <MatrimonyDiscoveryContent onTabPress={handleTabPress} />
      )}

      {(activeTab === 'matches' || activeTab === 'messages') && (
        <MatrimonyMessagesContent
          activeModuleTab={activeTab === 'matches' ? 'matches' : 'messages'}
          onTabPress={handleTabPress}
        />
      )}

      {activeTab === 'requests' && (
        <MatrimonyRequestsContent onTabPress={handleTabPress} />
      )}

      {activeTab === 'profile' && (
        <CreateMatrimonyProfileContent embeddedInMemberTab onTabPress={handleTabPress} />
      )}
    </View>
  );
}
