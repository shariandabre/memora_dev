import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_ENV === "development";
const IS_PREVIEW = process.env.APP_ENV === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.sharian.memora.dev";
  }

  if (IS_PREVIEW) {
    return "com.sharian.memora.preview";
  }

  return "com.sharian.memora";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Memora (Dev)";
  }

  if (IS_PREVIEW) {
    return "Memora (Preview)";
  }

  return "Memora";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "memora",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/adaptive-icon.png",
  scheme: "memora",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon-light.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*", "drizzle/**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: getUniqueIdentifier(),
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-notifications",
    [
      "expo-sqlite",
      {
        enableFTS: true,
        useSQLCipher: true,
        android: {
          enableFTS: false,
          useSQLCipher: false,
        },
        ios: {
          customBuildFlags: [
            "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1",
          ],
        },
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you add them in ideas.",
      },
    ],

    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/splash-icon-light.png",
        dark: {
          image: "./assets/splash-icon-dark.png",
          backgroundColor: "#16161D",
        },
        imageWidth: 200,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "7771ab35-79e9-4614-a64d-32171f502f4b",
    },
  },
  owner: "sharian",
  updates: {
    url: "https://u.expo.dev/7771ab35-79e9-4614-a64d-32171f502f4b",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
});
