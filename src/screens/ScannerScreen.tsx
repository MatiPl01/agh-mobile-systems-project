import { Scanner, Text, View } from '@/components';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import { Hand } from '@/types/hand';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;

export default function ScannerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();

  const [hand, setHand] = useState<Hand | null>();

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        {isFocused && <Scanner onHandDetected={setHand} />}
      </View>

      <Pressable
        style={({ pressed }) => [
          pressed && styles.buttonPressed,
          !hand && styles.buttonDisabled
        ]}
        disabled={!hand}
        onPress={() =>
          hand &&
          navigation.navigate('Confirm', {
            hand: JSON.parse(JSON.stringify(hand))
          })
        }>
        <Text style={styles.buttonText}>Calculate Points</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.base
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden'
  },
  buttonPressed: {
    opacity: 0.8
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    backgroundColor: theme.colors.primary,
    color: '#FFFFFF',
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.base
  }
}));
