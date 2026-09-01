import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

export function useDrawerOpenAction() {
  const navigation = useNavigation();

  return useCallback(() => {
    let currentNavigation: any = navigation;

    while (currentNavigation) {
      const state = typeof currentNavigation.getState === 'function' ? currentNavigation.getState() : undefined;

      if (state?.type === 'drawer') {
        currentNavigation.dispatch(DrawerActions.openDrawer());
        return;
      }

      currentNavigation = typeof currentNavigation.getParent === 'function' ? currentNavigation.getParent() : undefined;
    }
  }, [navigation]);
}
