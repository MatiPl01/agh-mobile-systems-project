import Scanner from '@/components/Scanner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function ScannerScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title'>Scanner</ThemedText>
      <Scanner />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
