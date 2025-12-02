import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;

export default function ResultsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleNewCalculation = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'CalculateHome' }]
      })
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title' style={styles.title}>
        Results
      </ThemedText>

      <ThemedView style={styles.placeholder}>
        <ThemedText style={styles.placeholderText}>
          Point calculation results will be displayed here
        </ThemedText>
        <ThemedText style={styles.placeholderSubtext}>
          Han, Fu, Yaku, and payment breakdown
        </ThemedText>
      </ThemedView>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.secondaryButton,
          pressed && styles.buttonPressed
        ]}
        onPress={() => navigation.navigate('EditHand')}>
        <ThemedText style={styles.secondaryButtonText}>Edit Hand</ThemedText>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={handleNewCalculation}>
        <ThemedText style={styles.buttonText}>New Calculation</ThemedText>
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
    marginBottom: 20
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
  secondaryButton: {
    marginBottom: 10
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
  },
  secondaryButtonText: {
    backgroundColor: '#8E8E93',
    color: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: 12
  }
});
