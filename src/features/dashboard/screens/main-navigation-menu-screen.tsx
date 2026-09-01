import React from 'react';
import { MainNavigationMenuContent as MainNavigationMenuContentView } from '../components/main-navigation-menu-content';

type MainNavigationMenuScreenProps = Parameters<typeof MainNavigationMenuContentView>[0];

export function MainNavigationMenuScreen(props: MainNavigationMenuScreenProps) {
  return <MainNavigationMenuContentView {...(props ?? {})} />;
}

export default MainNavigationMenuScreen;
