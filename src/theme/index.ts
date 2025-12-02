import { colors } from './colors';
import { spacing, borderRadius } from './spacing';
import { typography } from './typography';

export const lightTheme = {
  colors: colors.light,
  spacing,
  borderRadius,
  typography
};

export const darkTheme = {
  colors: colors.dark,
  spacing,
  borderRadius,
  typography
};

export type AppTheme = typeof lightTheme | typeof darkTheme;

