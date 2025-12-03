import { Text, View } from '@/components';
import type { TileId } from '@assets/images/tiles';
import { TILES } from '@assets/images/tiles';
import React from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type TileSelectorProps = {
  onTilePress: (tileId: TileId) => void;
  selectedCounts: Record<TileId, number>;
  canSelectMore: boolean;
};

const TILE_GROUPS: { title: string; tiles: TileId[] }[] = [
  {
    title: 'Man (Characters)',
    tiles: ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m']
  },
  {
    title: 'Pin (Circles)',
    tiles: ['1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p']
  },
  {
    title: 'Sou (Bamboo)',
    tiles: ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s']
  },
  {
    title: 'Winds',
    tiles: ['ew', 'sw', 'ww', 'nw']
  },
  {
    title: 'Dragons',
    tiles: ['wd', 'gd', 'rd']
  }
];

export default function TileSelector({
  onTilePress,
  selectedCounts,
  canSelectMore
}: TileSelectorProps) {
  const styles = stylesheet;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {TILE_GROUPS.map(group => (
        <View key={group.title} style={styles.group}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>{group.title}</Text>
          </View>
          <View style={styles.tileGrid}>
            {group.tiles.map(tileId => {
              const count = selectedCounts[tileId] || 0;
              const isMaxed = count >= 4;
              const isDisabled = !canSelectMore && count === 0;

              return (
                <Pressable
                  key={tileId}
                  onPress={() => onTilePress(tileId)}
                  disabled={isDisabled || isMaxed}
                  style={({ pressed }) => [
                    styles.tileButton,
                    count > 0 && styles.tileButtonSelected,
                    isMaxed && styles.tileButtonMaxed,
                    (isDisabled || isMaxed) && styles.tileButtonDisabled,
                    pressed && !isDisabled && !isMaxed && styles.tileButtonPressed
                  ]}>
                  <Image
                    source={TILES[tileId]}
                    style={styles.tileImage}
                    resizeMode='contain'
                  />
                  {count > 0 && (
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>{count}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const stylesheet = StyleSheet.create(theme => ({
  container: {
    flex: 1
  },
  content: {
    padding: theme.spacing.base,
    paddingBottom: 450, // Extra padding for last row and expanded bottom sheet (400px + some margin)
    gap: theme.spacing.lg
  },
  group: {
    gap: theme.spacing.sm
  },
  groupHeader: {
    paddingHorizontal: theme.spacing.xs
  },
  groupTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs
  },
  tileButton: {
    width: 50,
    height: 70,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  tileButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10'
  },
  tileButtonMaxed: {
    borderColor: theme.colors.warning,
    backgroundColor: theme.colors.warning + '10',
    opacity: 0.6
  },
  tileButtonDisabled: {
    opacity: 0.3
  },
  tileButtonPressed: {
    opacity: 0.7
  },
  tileImage: {
    width: 40,
    height: 56
  },
  countBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  countText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    color: '#FFFFFF'
  }
}));

