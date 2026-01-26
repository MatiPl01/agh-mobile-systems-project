import { Text, View } from '@/components';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import type { RootTabParamList } from '@/navigation/RootNavigator';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<CalculateStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;

export default function CalculateHomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View>
        <Text type='title' style={styles.title}>
          Calculate Points
        </Text>
        <Text style={styles.subtitle}>
          Choose how you want to input your hand
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => navigation.navigate('Scanner')}>
        <Text style={styles.buttonText}>Scan Hand</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => navigation.navigate('Calculator')}>
        <Text style={styles.buttonText}>Manual Input</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.base,
    gap: theme.spacing.sm
  },
  title: {
    textAlign: 'center'
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.base
  },
  button: {
    width: '100%',
    maxWidth: 300
  },
  buttonPressed: {
    opacity: 0.8
  },
  buttonText: {
    backgroundColor: theme.colors.primary,
    color: '#FFFFFF',
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: theme.borderRadius.md
  }
}));
