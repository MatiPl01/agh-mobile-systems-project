import { Text, View } from '@/components';
import { Hand, TileId } from '@/types/hand';
import { addClosedPartTile, getHandTileCounts } from '@/utils/hand';
import { TILES } from '@assets/images/tiles';
import React from 'react';
import { Image, Pressable } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

const TILE_GROUPS = [
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
] as const satisfies { title: string; tiles: TileId[] }[];

type TileSelectorProps = {
  hand: Hand;
  onHandChange: (newHand: Hand) => void;
  bottomSheetHeight: SharedValue<number>;
};

export default function TileSelector({
  hand,
  onHandChange,
  bottomSheetHeight
}: TileSelectorProps) {
  const canSelectMore = true;
  const selectedCounts = getHandTileCounts(hand);

  const animatedStyle = useAnimatedStyle(() => ({
    height: bottomSheetHeight.value
  }));

  const onTilePress = (tileId: TileId) => {
    if ((selectedCounts[tileId] || 0) >= 4) return;

    const newHand = addClosedPartTile(hand, tileId);
    onHandChange(newHand);
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {TILE_GROUPS.map(group => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
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
                    pressed &&
                      !isDisabled &&
                      !isMaxed &&
                      styles.tileButtonPressed
                  ]}>
                  <Image source={TILES[tileId]} style={styles.tileImage} />
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
      <Animated.View style={animatedStyle} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1
  },
  content: {
    padding: theme.spacing.base,
    gap: theme.spacing.lg
  },
  group: {
    gap: theme.spacing.xs
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
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
    position: 'relative'
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
    width: 32,
    height: 44,
    resizeMode: 'contain'
  },
  countBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  countText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    color: theme.colors.background,
    lineHeight: 0
  }
}));
