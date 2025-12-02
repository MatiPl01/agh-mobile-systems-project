import { Platform } from 'react-native';

export const typography = {
  fonts: {
    regular: Platform.select({
      ios: 'system-ui',
      android: 'Roboto',
      default: 'normal'
    }),
    medium: Platform.select({
      ios: 'system-ui',
      android: 'Roboto-Medium',
      default: 'normal'
    }),
    bold: Platform.select({
      ios: 'system-ui',
      android: 'Roboto-Bold',
      default: 'bold'
    })
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40
  }
} as const;

