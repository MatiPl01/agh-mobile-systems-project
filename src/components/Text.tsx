import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type TextProps = RNTextProps & {
  variant?: 'default' | 'defaultSemiBold' | 'link' | 'subtitle' | 'title';
  type?: 'default' | 'defaultSemiBold' | 'link' | 'subtitle' | 'title';
  color?: keyof typeof import('@/theme/colors').colors.light;
};

export function Text({ variant, type, color, style, ...rest }: TextProps) {
  const { theme } = useUnistyles();
  const textVariant = variant || type || 'default';
  const textColor = color ? theme.colors[color] : theme.colors.text;

  return (
    <RNText
      style={[styles[textVariant], { color: textColor }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create(theme => ({
  default: {
    fontSize: theme.typography.sizes.base,
    lineHeight: theme.typography.lineHeights.base,
    fontFamily: theme.typography.fonts.regular
  },
  defaultSemiBold: {
    fontSize: theme.typography.sizes.base,
    lineHeight: theme.typography.lineHeights.base,
    fontFamily: theme.typography.fonts.medium,
    fontWeight: '600'
  },
  link: {
    fontSize: theme.typography.sizes.base,
    lineHeight: theme.typography.lineHeights.lg,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.tint
  },
  subtitle: {
    fontSize: theme.typography.sizes.xl,
    lineHeight: theme.typography.lineHeights.xl,
    fontFamily: theme.typography.fonts.bold,
    fontWeight: 'bold'
  },
  title: {
    fontSize: theme.typography.sizes['3xl'],
    lineHeight: theme.typography.lineHeights['3xl'],
    fontFamily: theme.typography.fonts.bold,
    fontWeight: 'bold'
  }
}));
