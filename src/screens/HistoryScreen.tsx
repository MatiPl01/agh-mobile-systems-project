import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function HistoryScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title' style={styles.title}>
        History
      </ThemedText>

      <ThemedView style={styles.placeholder}>
        <ThemedText style={styles.placeholderEmoji}>📜</ThemedText>
        <ThemedText style={styles.placeholderTitle}>Coming Soon</ThemedText>
        <ThemedText style={styles.placeholderText}>
          Your calculation history will be saved here
        </ThemedText>
        <ThemedText style={styles.placeholderSubtext}>
          View past hands, scores, and statistics
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    marginBottom: 40
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 20
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center'
  },
  placeholderText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 10
  },
  placeholderSubtext: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 5
  }
});
