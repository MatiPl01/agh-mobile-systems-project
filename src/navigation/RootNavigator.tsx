import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '@/screens/HomeScreen';
import ScannerScreen from '@/screens/ScannerScreen';

export type RootTabParamList = {
  Home: undefined;
  ScannerScreen: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Tab.Screen
          name="ScannerScreen"
          component={ScannerScreen}
          options={{ title: 'Scanner' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}