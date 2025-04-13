import "../global.css";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { ActivityIndicator, Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useStore from "~/store/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Sheet from "~/components/Sheet";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "drizzle/migrations";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getAllScheduledNotification,
  registerForPushNotificationsAsync,
} from "~/services/notificationService";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const LIGHT_THEME = { ...DefaultTheme, colors: NAV_THEME.light };
const DARK_THEME = { ...DarkTheme, colors: NAV_THEME.dark };

export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function AppContent() {
  const expoDb = openDatabaseSync("db.db");
  const db = drizzle(expoDb);
  useDrizzleStudio(expoDb);
  const { success, error } = useMigrations(db, migrations);

  const hasMounted = React.useRef(false);

  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const { isBottomSheetOpen, closeBottomSheet } = useStore();

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      //router.setParams({ editable: 1, title: "test" });
      //router.push("/content/1?editable=1&title=test");
    }
  }, [fontsLoaded, success, error]);

  const useIsomorphicLayoutEffect =
    Platform.OS === "web" ? React.useLayoutEffect : React.useEffect;

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }

    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, [colorScheme]);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        console.log("notification initialized");
        const notifications = await getAllScheduledNotification();
        console.log("notification", notifications);

        const notificationListener =
          Notifications.addNotificationReceivedListener((notification) => {
            console.log("Notification received:", notification);
          });

        const responseListener =
          Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("Notification tapped:", response);
            const taskId = response.notification.request.content.data.taskId;
            if (taskId) {
              router.push(`/content/${taskId}`);
            }
          });

        return () => {
          Notifications.removeNotificationSubscription(notificationListener);
          Notifications.removeNotificationSubscription(responseListener);
        };
      } catch (err) {
        console.error("Notification init error:", err);
      }
    };

    initializeNotifications();
  }, []);

  if (!fontsLoaded || !isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerTitleStyle: { fontFamily: "Montserrat_900Black" },
            animation: "slide_from_right",
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerTitleAlign: "center",
              title: "MEMORA",
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "Settings",
              headerTitleStyle: {
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="content/[id]"
            options={{
              headerTitleStyle: {
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="folder/[name]"
            options={{
              headerTitleStyle: {
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 18,
              },
            }}
          />
        </Stack>
        <Sheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet} />
      </GestureHandlerRootView>

      <PortalHost />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <React.Suspense fallback={<ActivityIndicator size={"large"} />}>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider
          databaseName="db.db"
          options={{ enableChangeListener: true }}
        >
          <AppContent />
        </SQLiteProvider>
      </QueryClientProvider>
    </React.Suspense>
  );
}
