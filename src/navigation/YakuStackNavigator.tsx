import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import YakuDetailScreen from '@/screens/YakuDetailScreen';
import YakuListScreen from '@/screens/YakuListScreen';

export type YakuStackParamList = {
  YakuList: undefined;
  YakuDetail: { yakuId: string };
};

const Stack = createNativeStackNavigator<YakuStackParamList>();

export default function YakuStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='YakuList'
      screenOptions={{
        headerShown: true
      }}>
      <Stack.Screen
        name='YakuList'
        component={YakuListScreen}
        options={{ title: 'Yaku Reference' }}
      />
      <Stack.Screen
        name='YakuDetail'
        component={YakuDetailScreen}
        options={{ title: 'Yaku Details' }}
      />
    </Stack.Navigator>
  );
}
