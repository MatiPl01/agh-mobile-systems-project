import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import type { YakuStackParamList } from '@/navigation/YakuStackNavigator';

type NavigationProp = NativeStackNavigationProp<YakuStackParamList>;

export default function YakuListScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Placeholder yaku list - will be replaced with actual data later
  const placeholderYaku = [
    { id: '1', name: 'Riichi', han: 1 },
    { id: '2', name: 'Tanyao', han: 1 },
    { id: '3', name: 'Pinfu', han: 1 },
    { id: '4', name: 'Iipeikou', han: 1 },
    { id: '5', name: 'Sanshoku', han: 2 }
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title' style={styles.title}>
        Yaku Reference
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Tap on a yaku to see details
      </ThemedText>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}>
        {placeholderYaku.map(yaku => (
          <Pressable
            key={yaku.id}
            style={({ pressed }) => [
              styles.yakuItem,
              pressed && styles.yakuItemPressed
            ]}
            onPress={() =>
              navigation.navigate('YakuDetail', { yakuId: yaku.id })
            }>
            <ThemedText style={styles.yakuName}>{yaku.name}</ThemedText>
            <ThemedText style={styles.yakuHan}>{yaku.han} han</ThemedText>
          </Pressable>
        ))}
        <ThemedView style={styles.placeholderNote}>
          <ThemedText style={styles.placeholderText}>
            Full yaku list will be implemented here
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
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
  list: {
    flex: 1
  },
  listContent: {
    gap: 12
  },
  yakuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  yakuItemPressed: {
    opacity: 0.7,
    backgroundColor: '#E0E0E0'
  },
  yakuName: {
    fontSize: 18,
    fontWeight: '600'
  },
  yakuHan: {
    fontSize: 16,
    opacity: 0.7
  },
  placeholderNote: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center'
  },
  placeholderText: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center'
  }
});
