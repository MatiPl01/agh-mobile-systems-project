import { Text, View } from '@/components';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import { TILES } from '@assets/images/tiles';
import {
  useNavigation,
  useRoute,
  type RouteProp
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;
type ScanConfirmRouteProp = RouteProp<CalculateStackParamList, 'ScanConfirm'>;

export default function ScanConfirmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScanConfirmRouteProp>();
  const { tiles } = route.params;

  const handleConfirm = () => {
    navigation.navigate('Results', { tiles });
  };

  const handleEdit = () => {
    navigation.navigate('Calculator', { initialTiles: tiles });
  };

  return (
    <View style={styles.container}>
      <Text type='title' style={styles.title}>
        Scanned Hand
      </Text>
      <Text style={styles.subtitle}>
        Review detected tiles. Edit if any were misidentified.
      </Text>

      <View style={styles.tilesContainer}>
        <View style={styles.tilesWrap}>
          {tiles.map((tileId, index) => (
            <View key={`${tileId}-${index}`} style={styles.tileWrapper}>
              <Image source={TILES[tileId]} style={styles.tile} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleEdit}>
          <Text style={styles.secondaryButtonText}>Edit Hand</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.base,
    backgroundColor: theme.colors.background
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.base
  },
  tilesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: theme.spacing.base,
    marginVertical: theme.spacing.base
  },
  tilesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  tileWrapper: {
    borderRadius: 6,
    overflow: 'visible',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)'
  },
  tile: {
    width: 44,
    height: 62,
    resizeMode: 'contain'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden'
  },
  primaryButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  secondaryButton: {},
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
}));
