import RootNavigator from '@/navigation/RootNavigator';
import { TensorflowModelProvider } from '@/providers/TensorflowModelProvider';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

function AppContent() {
  const { theme } = useUnistyles();

  // TODO: Re-enable dark mode support once tile colors are adjusted
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TensorflowModelProvider>
          <ThemeProvider value={DefaultTheme}>
            <StatusBar
              barStyle='dark-content'
              backgroundColor={theme.colors.background}
            />
            <RootNavigator />
          </ThemeProvider>
        </TensorflowModelProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function App() {
  return <AppContent />;
}

export default App;
