export const firebaseEnvironmentRequirements = {
  androidPackageEnv: 'APP_ANDROID_PACKAGE',
  iosBundleIdEnv: 'APP_IOS_BUNDLE_ID',
  androidGoogleServicesEnv: 'GOOGLE_SERVICES_JSON',
  iosGoogleServicesEnv: 'GOOGLE_SERVICES_INFO_PLIST',
  androidGoogleServicesDefaultPath: './firebase/google-services.json',
  iosGoogleServicesDefaultPath: './firebase/GoogleService-Info.plist',
} as const;

export function getFirebaseConfigurationHelp() {
  return {
    developmentBuildRequired: true,
    note: 'Phone OTP auth uses native Firebase modules and requires an Expo development build, not Expo Go. Add the client Firebase native config files under frontend/firebase or override their paths with env vars.',
    envs: firebaseEnvironmentRequirements,
  };
}
