import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import CalculateStackNavigator from './CalculateStackNavigator';
import HistoryStackNavigator from './HistoryStackNavigator';
import YakuStackNavigator from './YakuStackNavigator';

export type RootTabParamList = {
  Calculate: undefined;
  Yaku: undefined;
  History: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Calculate'
        screenOptions={{
          headerShown: false
        }}>
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
