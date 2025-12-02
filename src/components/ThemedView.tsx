import { View, type ViewProps } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type ThemedViewProps = ViewProps & {
  variant?: 'default' | 'secondary';
};

export function ThemedView({ variant = 'default', style, ...rest }: ThemedViewProps) {
  const { theme } = useUnistyles();

  return (
    <View
      style={[
        { backgroundColor: theme.colors.background },
        style
      ]}
      {...rest}
    />
  );
}

