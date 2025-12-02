import { View as RNView, type ViewProps as RNViewProps } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type ViewProps = RNViewProps & {
  variant?: 'default' | 'secondary';
};

export function View({ variant = 'default', style, ...rest }: ViewProps) {
  const { theme } = useUnistyles();
  const backgroundColor =
    variant === 'secondary'
      ? theme.colors.backgroundSecondary
      : theme.colors.background;

  return <RNView style={[{ backgroundColor }, style]} {...rest} />;
}
