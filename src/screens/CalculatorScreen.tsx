import { HandBuilder, Text, TileSelector, View } from '@/components';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import type { Meld } from '@/types/hand';
import { addTile, canAddTile, getTileCounts, removeTile } from '@/utils/hand';
import type { TileId } from '@assets/images/tiles';
import {
  useNavigation,
  useRoute,
  type RouteProp
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;
type CalculatorRouteProp = RouteProp<CalculateStackParamList, 'Calculator'>;

export default function CalculatorScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CalculatorRouteProp>();
  const styles = stylesheet;
  const [tiles, setTiles] = useState<TileId[]>([]);
  const [melds, setMelds] = useState<Meld[]>([]);

  useEffect(() => {
    if (route.params?.initialTiles) {
      setTiles(route.params.initialTiles);
    }
  }, [route.params?.initialTiles]);

  const handleTilePress = (tileId: TileId) => {
    if (canAddTile(tiles, tileId)) {
      setTiles(addTile(tiles, tileId));
    }
  };

  const handleRemoveTile = (index: number) => {
    setTiles(removeTile(tiles, index));
  };

  const handleClearAll = () => {
    setTiles([]);
    setMelds([]);
  };

  const handleCalculate = () => {
    if (tiles.length === 14) {
      navigation.replace('Results', {
        tiles,
        historyId: route.params?.historyId
      });
    }
  };

  const selectedCounts = getTileCounts(tiles);
  const canSelectMore = tiles.length < 14;

  const isEditingFromScan = !!route.params?.initialTiles;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          {isEditingFromScan
            ? 'Adjust tiles if needed'
            : 'Select tiles to build your hand'}
        </Text>
      </View>

      <View style={styles.tileSelectorContainer}>
        <TileSelector
          onTilePress={handleTilePress}
          selectedCounts={selectedCounts}
          canSelectMore={canSelectMore}
        />
      </View>

      <HandBuilder
        tiles={tiles}
        melds={melds}
        onRemoveTile={handleRemoveTile}
        onUpdateMelds={setMelds}
        onClearAll={handleClearAll}
        onCalculate={handleCalculate}
        initiallyExpanded={isEditingFromScan}
      />
    </View>
  );
}

const stylesheet = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    padding: theme.spacing.base,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  },
  tileSelectorContainer: {
    flex: 1,
    minHeight: 200
  }
}));
