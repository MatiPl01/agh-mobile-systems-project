import HistoryDetailScreen from '@/screens/HistoryDetailScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

export type HistoryStackParamList = {
  HistoryList: undefined;
  HistoryDetail: { handId: string };
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
        name='HistoryDetail'
        component={HistoryDetailScreen}
        options={{ title: 'Hand Details' }}
      />
    </Stack.Navigator>
  );
}
