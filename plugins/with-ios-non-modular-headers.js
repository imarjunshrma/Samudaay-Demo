const { withPodfile } = require("@expo/config-plugins");

const BUILD_SETTING =
  "CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES";

module.exports = function withIosNonModularHeaders(config) {
  return withPodfile(config, (podfileConfig) => {
    const marker = "# Allow React Native headers in static framework modules";

    if (podfileConfig.modResults.contents.includes(marker)) {
      return podfileConfig;
    }

    const postInstallPattern = /(post_install do \|installer\|\n)/;
    if (!postInstallPattern.test(podfileConfig.modResults.contents)) {
      throw new Error(
        "Unable to configure non-modular iOS headers: post_install was not found in the Podfile.",
      );
    }

    podfileConfig.modResults.contents = podfileConfig.modResults.contents.replace(
      postInstallPattern,
      `$1  ${marker}\n  installer.pods_project.targets.each do |target|\n    target.build_configurations.each do |build_config|\n      build_config.build_settings['${BUILD_SETTING}'] = 'YES'\n    end\n  end\n\n`,
    );

    return podfileConfig;
  });
};
