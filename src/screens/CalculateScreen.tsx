import { Text, View } from '@/components';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;

export default function CalculateScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text type='title' style={styles.title}>
        Calculate Points
      </Text>
      <Text style={styles.subtitle}>
        Choose how you want to input your hand
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => navigation.navigate('Scanner')}>
        <Text style={styles.buttonText}>Scan Board</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12
  },
  title: {
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 20
  },
  button: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonPressed: {
    opacity: 0.8
  },
  buttonText: {
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: 12
  }
});
