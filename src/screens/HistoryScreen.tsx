import { Text, View } from '@/components';
import React from 'react';
import { StyleSheet } from 'react-native-unistyles';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text type='title' style={styles.title}>
        History
      </Text>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderEmoji}>📜</Text>
        <Text style={styles.placeholderTitle}>Coming Soon</Text>
        <Text style={styles.placeholderText}>
          Your calculation history will be saved here
        </Text>
        <Text style={styles.placeholderSubtext}>
          View past hands, scores, and statistics
        </Text>
      </View>
    </View>
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
