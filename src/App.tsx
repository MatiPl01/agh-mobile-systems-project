import RootNavigator from '@/navigation/RootNavigator';
import '@/theme/unistyles';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const { theme } = useUnistyles();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
