import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { HistoryStackParamList } from '@/navigation/HistoryStackNavigator';

type HandDetailRouteProp = RouteProp<HistoryStackParamList, 'HandDetail'>;

export default function HandDetailScreen() {
  const route = useRoute<HandDetailRouteProp>();
  const { handId } = route.params;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type='title' style={styles.title}>
          Hand Details
        </ThemedText>
        <ThemedText style={styles.handId}>ID: {handId}</ThemedText>

        <ThemedView style={styles.placeholder}>
          <ThemedText style={styles.placeholderText}>
            Hand details will be displayed here
          </ThemedText>
          <ThemedText style={styles.placeholderSubtext}>
            Tiles, yaku, points, and calculation breakdown
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 20,
    gap: 24
  },
  title: {
    textAlign: 'center',
    marginBottom: 10
  },
  handId: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 20
  },
  placeholder: {
    padding: 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#999',
    borderRadius: 12,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.7,
    textAlign: 'center'
  },
  placeholderSubtext: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center'
  }
});
