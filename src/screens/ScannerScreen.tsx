import { Scanner, Text, View } from '@/components';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import type { TileId } from '@assets/images/tiles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;

const MOCK_SCAN_RESULT: TileId[] = [
  '1m',
  '2m',
  '3m',
  '4p',
  '5p',
  '6p',
  '7s',
  '7s',
  '7s',
  'ew',
  'ew',
  'ew',
  'rd',
  'rd'
];

export default function ScannerScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleCalculate = () => {
    navigation.navigate('ScanConfirm', { tiles: MOCK_SCAN_RESULT });
  };

  return (
    <View style={styles.container}>
      <Text type='title' style={styles.title}>
        Scan Board
      </Text>
      <View style={styles.scannerContainer}>
        <Scanner />
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={handleCalculate}>
        <Text style={styles.buttonText}>Calculate Points</Text>
      </Pressable>
    </View>
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
    marginBottom: 10
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden'
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
  }
});
