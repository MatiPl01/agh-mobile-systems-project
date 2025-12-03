import { Text, View } from '@/components';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export default function YakuListScreen() {
  const { theme } = useUnistyles();
  const styles = stylesheet;

  return (
    <View style={styles.container}>
      <Text type='title' style={styles.title}>
        Yaku List
      </Text>
      <Text style={styles.placeholder}>Coming soon...</Text>
    </View>
  );
}

const stylesheet = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background
  },
  title: {
    marginBottom: theme.spacing.base,
    color: theme.colors.text
  },
  placeholder: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.base
  }
}));
