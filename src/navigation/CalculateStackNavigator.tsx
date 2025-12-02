import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import CalculateScreen from '@/screens/CalculateScreen';
import CalculatorScreen from '@/screens/CalculatorScreen';
import EditHandScreen from '@/screens/EditHandScreen';
import ResultsScreen from '@/screens/ResultsScreen';
import ScannerScreen from '@/screens/ScannerScreen';

export type CalculateStackParamList = {
  CalculateHome: undefined;
  Scanner: undefined;
  Calculator: undefined;
  Results: undefined;
  EditHand: undefined;
};

const Stack = createNativeStackNavigator<CalculateStackParamList>();

export default function CalculateStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='CalculateHome'
      screenOptions={{
        headerShown: true
      }}>
      <Stack.Screen
        name='CalculateHome'
        component={CalculateScreen}
        options={{ title: 'Calculate Points' }}
      />
      <Stack.Screen
        name='Scanner'
        component={ScannerScreen}
        options={{ title: 'Scan Board' }}
      />
      <Stack.Screen
        name='Calculator'
        component={CalculatorScreen}
        options={{ title: 'Manual Input' }}
      />
      <Stack.Screen
        name='Results'
        component={ResultsScreen}
        options={{ title: 'Results' }}
      />
      <Stack.Screen
        name='EditHand'
        component={EditHandScreen}
        options={{ title: 'Edit Hand' }}
      />
    </Stack.Navigator>
  );
}
