import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { YakuStackParamList } from '@/navigation/YakuStackNavigator';

type YakuDetailRouteProp = RouteProp<YakuStackParamList, 'YakuDetail'>;

export default function YakuDetailScreen() {
  const route = useRoute<YakuDetailRouteProp>();
  const { yakuId } = route.params;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type='title' style={styles.title}>
          Yaku Details
        </ThemedText>
        <ThemedText style={styles.yakuId}>ID: {yakuId}</ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Name</ThemedText>
          <ThemedView style={styles.placeholder}>
            <ThemedText style={styles.placeholderText}>
              Yaku name will be displayed here
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Han Value</ThemedText>
          <ThemedView style={styles.placeholder}>
            <ThemedText style={styles.placeholderText}>
              Han value will be displayed here
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <ThemedView style={styles.placeholder}>
            <ThemedText style={styles.placeholderText}>
              Detailed description and conditions will be displayed here
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Examples</ThemedText>
          <ThemedView style={styles.placeholder}>
            <ThemedText style={styles.placeholderText}>
              Example hands will be displayed here
            </ThemedText>
          </ThemedView>
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
  yakuId: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 20
  },
  section: {
    gap: 12
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8
  },
  placeholder: {
    padding: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#999',
    borderRadius: 12,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center'
  }
});

