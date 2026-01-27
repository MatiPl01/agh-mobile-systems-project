import { HandBuilder, TileSelector, View } from '@/components';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import type { Hand } from '@/types/hand';
import { createEmptyHand, sortHandTiles } from '@/utils/hand';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {
  useNavigation,
  useRoute,
  type RouteProp
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;
type CalculatorRouteProp = RouteProp<CalculateStackParamList, 'Calculator'>;

export default function CalculatorScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CalculatorRouteProp>();

  const [hand, setHand] = useState<Hand>(createEmptyHand());

  const sortedHand = sortHandTiles(hand);

  const snapPoints = [84];
  const bottomSheetHeight = useSharedValue(0);

  useEffect(() => {
    if (route.params?.initialHand) {
      setHand(route.params.initialHand);
    }
  }, [route.params?.initialHand]);

  const handleCalculate = () => {
    navigation.navigate('Confirm', {
      hand: sortedHand,
      historyId: route.params?.historyId
    });
  };

  return (
    <View style={styles.container}>
      <TileSelector
        hand={sortedHand}
        onHandChange={setHand}
        bottomSheetHeight={bottomSheetHeight}
      />
      <BottomSheet
        index={1}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
        style={styles.bottomSheet}>
        <BottomSheetView>
          <HandBuilder
            hand={sortedHand}
            onHandChange={setHand}
            onCalculate={handleCalculate}
            bottomSheetHeight={bottomSheetHeight}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  bottomSheet: {
    marginHorizontal: 0,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  handleIndicator: {
    width: 60
  }
}));
