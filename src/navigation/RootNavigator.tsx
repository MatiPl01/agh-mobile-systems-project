import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CalculateStackNavigator from './CalculateStackNavigator';
import HistoryStackNavigator from './HistoryStackNavigator';
import YakuStackNavigator from './YakuStackNavigator';

export type RootTabParamList = {
  Calculate: undefined;
  Yaku: undefined;
  History: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function getTabBarIcon(routeName: string, focused: boolean): string {
  if (routeName === 'Calculate') {
    return focused ? 'calculator' : 'calculator-outline';
  } else if (routeName === 'Yaku') {
    return focused ? 'book' : 'book-outline';
  } else if (routeName === 'History') {
    return focused ? 'time' : 'time-outline';
  }
  return 'help-outline';
}

function TabBarIcon({
  route,
  focused,
  color,
  size
}: {
  route: RouteProp<RootTabParamList, keyof RootTabParamList>;
  focused: boolean;
  color: string;
  size: number;
}) {
  const iconName = getTabBarIcon(route.name, focused);
  return <Ionicons name={iconName} size={size} color={color} />;
}

export default function RootNavigator() {
  const { theme } = useUnistyles();

  const screenOptions = useMemo(
    () =>
      ({
        route
      }: {
        route: RouteProp<RootTabParamList, keyof RootTabParamList>;
        navigation: any;
      }): BottomTabNavigationOptions => ({
        headerShown: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon
            route={route}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border
        }
      }),
    [
      theme.colors.primary,
      theme.colors.textSecondary,
      theme.colors.background,
      theme.colors.border
    ]
  );

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Calculate' screenOptions={screenOptions}>
        <Tab.Screen
          name='Calculate'
          component={CalculateStackNavigator}
          options={{ title: 'Calculate' }}
        />
        <Tab.Screen
          name='Yaku'
          component={YakuStackNavigator}
          options={{ title: 'Yaku' }}
        />
        <Tab.Screen
          name='History'
          component={HistoryStackNavigator}
          options={{ title: 'History' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
