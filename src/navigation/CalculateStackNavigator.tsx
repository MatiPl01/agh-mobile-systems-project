import type { TileId } from '@assets/images/tiles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CalculateScreen from '@/screens/CalculateScreen';
import CalculatorScreen from '@/screens/CalculatorScreen';
import ResultsScreen from '@/screens/ResultsScreen';
import ScanConfirmScreen from '@/screens/ScanConfirmScreen';
import ScannerScreen from '@/screens/ScannerScreen';

export type CalculateStackParamList = {
  CalculateHome: undefined;
  Scanner: undefined;
  ScanConfirm: { tiles: TileId[] };
  Calculator: { initialTiles?: TileId[]; historyId?: string } | undefined;
  Results: { tiles: TileId[]; historyId?: string };
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
        name='ScanConfirm'
        component={ScanConfirmScreen}
        options={{ title: 'Confirm Scan' }}
      />
      <Stack.Screen
        name='Calculator'
        component={CalculatorScreen}
        options={{ title: 'Hand Editor' }}
      />
      <Stack.Screen
        name='Results'
        component={ResultsScreen}
        options={{ title: 'Results' }}
      />
    </Stack.Navigator>
  );
}
