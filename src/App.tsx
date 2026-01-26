import RootNavigator from '@/navigation/RootNavigator';
import { TensorflowModelProvider } from '@/providers/TensorflowModelProvider';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TensorflowModelProvider>
          <ThemeProvider value={DefaultTheme}>
            <StatusBar />
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
