import { Text, View } from '@/components';
import type { YakuStackParamList } from '@/navigation/YakuStackNavigator';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type YakuDetailRouteProp = RouteProp<YakuStackParamList, 'YakuDetail'>;

export default function YakuDetailScreen() {
  const route = useRoute<YakuDetailRouteProp>();
  const { yakuId } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text type='title' style={styles.title}>
          Yaku Details
        </Text>
        <Text style={styles.yakuId}>ID: {yakuId}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Name</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Yaku name will be displayed here
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Han Value</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Han value will be displayed here
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Detailed description and conditions will be displayed here
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Examples</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Example hands will be displayed here
            </Text>
          </View>
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
