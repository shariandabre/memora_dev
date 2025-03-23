import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarLabelStyle: { fontFamily: 'Montserrat_500Medium' },
      }}>
      <MaterialTopTabs.Screen name="index" options={{ title: 'All Ideas' }} />
      <MaterialTopTabs.Screen name="folder" options={{ title: 'Folders' }} />
    </MaterialTopTabs>
  );
}
