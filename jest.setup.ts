import '@testing-library/jest-native/extend-expect';

jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-constants', () => ({
  default: { expoConfig: { name: 'MECTV', slug: 'mectv' } },
}));

jest.mock('@react-native-firebase/app', () => ({}));
jest.mock('@react-native-firebase/auth', () => () => ({}));
jest.mock('@react-native-firebase/firestore', () => () => ({}));
jest.mock('@react-native-firebase/messaging', () => () => ({}));
jest.mock('@react-native-firebase/storage', () => () => ({}));
jest.mock('@notifee/react-native', () => ({}));
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
