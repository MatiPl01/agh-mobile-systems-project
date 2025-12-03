import { Text, View, HandBuilder, TileSelector } from '@/components';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import type { TileId } from '@assets/images/tiles';
import type { Meld } from '@/types/hand';
import { addTile, canAddTile, getTileCounts, removeTile } from '@/utils/hand';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;

export default function CalculatorScreen() {
  const navigation = useNavigation<NavigationProp>();
  const styles = stylesheet;
  const [tiles, setTiles] = useState<TileId[]>([]);
  const [melds, setMelds] = useState<Meld[]>([]);

  const handleTilePress = (tileId: TileId) => {
    if (canAddTile(tiles, tileId)) {
      setTiles(addTile(tiles, tileId));
    }
  };

  const handleRemoveTile = (index: number) => {
    // Just remove the tile - meld updates are handled by HandBuilder
    setTiles(removeTile(tiles, index));
  };

  const handleClearAll = () => {
    setTiles([]);
    setMelds([]);
  };

  const handleCalculate = () => {
    if (tiles.length === 14) {
      // TODO: Pass hand data to results screen
      navigation.navigate('Results');
    }
  };

  const selectedCounts = getTileCounts(tiles);
  const canSelectMore = tiles.length < 14;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text type='title' style={styles.title}>
          Manual Input
        </Text>
        <Text style={styles.subtitle}>Select tiles to build your hand</Text>
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
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text
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
