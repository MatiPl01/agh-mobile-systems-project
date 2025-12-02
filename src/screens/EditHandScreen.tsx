import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;

export default function EditHandScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title' style={styles.title}>
        Edit Hand
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Adjust tiles that were incorrectly identified
      </ThemedText>

      <ThemedView style={styles.placeholder}>
        <ThemedText style={styles.placeholderText}>
          Tile editor interface will go here
        </ThemedText>
        <ThemedText style={styles.placeholderSubtext}>
          Add, remove, or modify tiles
        </ThemedText>
      </ThemedView>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => navigation.goBack()}>
        <ThemedText style={styles.buttonText}>Save & Recalculate</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20
  },
  title: {
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 10
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#999',
    borderRadius: 12,
    padding: 40,
    marginVertical: 20
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 10
  },
  placeholderSubtext: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center'
  },
  button: {
    width: '100%',
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

