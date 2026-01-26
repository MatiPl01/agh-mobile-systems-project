import CalculateHomeScreen from '@/screens/CalculateHomeScreen';
import CalculatorScreen from '@/screens/CalculatorScreen';
import ConfirmScreen from '@/screens/ConfirmScreen';
import ResultScreen from '@/screens/ResultScreen';
import ScannerScreen from '@/screens/ScannerScreen';
import { Hand } from '@/types/hand';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type CalculateStackParamList = {
  CalculateHome: undefined;
  Scanner: undefined;
  Confirm: { hand: Hand };
  Calculator: { initialHand?: Hand; historyId?: string } | undefined;
  Result: { hand: Hand; historyId?: string };
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
        component={CalculateHomeScreen}
        options={{ title: 'Calculate Points' }}
      />
      <Stack.Screen
        name='Scanner'
        component={ScannerScreen}
        options={{ title: 'Scan Board' }}
      />
      <Stack.Screen
        name='Confirm'
        component={ConfirmScreen}
        options={{ title: 'Confirm Hand' }}
      />
      <Stack.Screen
        name='Calculator'
        component={CalculatorScreen}
        options={{ title: 'Hand Editor' }}
      />
      <Stack.Screen
        name='Result'
        component={ResultScreen}
        options={{ title: 'Result' }}
      />
    </Stack.Navigator>
  );
}
