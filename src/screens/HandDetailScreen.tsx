import { Text, View } from '@/components';
import type { HistoryStackParamList } from '@/navigation/HistoryStackNavigator';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type HandDetailRouteProp = RouteProp<HistoryStackParamList, 'HandDetail'>;

export default function HandDetailScreen() {
  const route = useRoute<HandDetailRouteProp>();
  const { handId } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text type='title' style={styles.title}>
          Hand Details
        </Text>
        <Text style={styles.handId}>ID: {handId}</Text>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Hand details will be displayed here
          </Text>
          <Text style={styles.placeholderSubtext}>
            Tiles, yaku, points, and calculation breakdown
          </Text>
        </View>
      </ScrollView>
    </View>
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
