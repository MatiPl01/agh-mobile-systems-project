import { StyleSheet } from 'react-native-unistyles';
import { darkTheme, lightTheme, type AppTheme } from './index';

type AppThemes = {
  light: AppTheme;
  dark: AppTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme
  },
  settings: {
    initialTheme: 'light'
  }
});
