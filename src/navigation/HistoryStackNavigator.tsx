import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import HandDetailScreen from '@/screens/HandDetailScreen';
import HistoryScreen from '@/screens/HistoryScreen';

export type HistoryStackParamList = {
  HistoryList: undefined;
  HandDetail: { handId: string };
};

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export default function HistoryStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='HistoryList'
      screenOptions={{
        headerShown: true
      }}>
      <Stack.Screen
        name='HistoryList'
        component={HistoryScreen}
        options={{ title: 'History' }}
      />
      <Stack.Screen
        name='HandDetail'
        component={HandDetailScreen}
        options={{ title: 'Hand Details' }}
      />
    </Stack.Navigator>
  );
}
