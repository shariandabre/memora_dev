import React, { useRef, useCallback, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated, Easing } from 'react-native';
import { Link, Tabs, router } from 'expo-router';
import {
  BotMessageSquare,
  Home,
  User2,
  Bell,
} from 'lucide-react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { H4, Muted, P, Small, Title } from '~/components/ui/typography';

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const [syncProgress, setSyncProgress] = useState(new Animated.Value(0));
  const [isSyncing, setIsSyncing] = useState(false);
  useEffect(() => {
    if (isSyncing) {
      Animated.timing(syncProgress, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        setIsSyncing(false);
        setSyncProgress(new Animated.Value(0));
      });
    }
  }, [isSyncing]);

  const startSync = () => {
    setIsSyncing(true);
  };

  return (
    <>
      <View style={styles.container}>
        {isSyncing && (
          <View className="absolute left-0 top-0 flex w-full flex-1 p-2">
            <View style={styles.progressBarContainer}>
              <View className="flex flex-col p-2">
                <P>Syncing data...</P>
                <Muted className="">Please wait while we update your information.</Muted>
              </View>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: syncProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}
        <Tabs
          screenOptions={{
            headerShadowVisible: false,
            tabBarShowLabel: false,
            headerShown: false,
            tabBarActiveTintColor: isDarkColorScheme
              ? NAV_THEME.dark.primary
              : NAV_THEME.light.primary,
            tabBarIconStyle: { marginTop: 5 },
          }}>
          <Tabs.Screen
            name="(top-tabs)"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => {
                return <Home size={size} color={color} />;
              },
            }}
          />
          <Tabs.Screen
            name="two"
            options={{
              title: 'Memora AI',
              tabBarIcon: ({ color, size }) => <BotMessageSquare size={size} color={color} />,
            }}
          />

          <Tabs.Screen
            name="notification"
            options={{
              title: 'Notification',
              tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => <User2 size={size} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#A3A6C5',
  },

  progressBarContainer: {
    backgroundColor: '#272731',
    borderColor: '#48495A',
    borderWidth: 1,
    width: '100%',
    borderRadius: 5,
    display: 'flex',
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    display: 'flex',
  },
  darkBackground: {
    backgroundColor: '#1a1b25',
  },
  lightBackground: {
    backgroundColor: '#ffffff',
  },
  darkHandleIndicator: {
    backgroundColor: '#ffffff',
  },
  lightHandleIndicator: {
    backgroundColor: '#1a1b25',
  },
  syncButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  syncButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
