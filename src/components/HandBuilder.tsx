import { Text, View } from '@/components';
import type { Meld } from '@/types/hand';
import { getTileCounts, HAND_SIZE } from '@/utils/hand';
import type { TileId } from '@assets/images/tiles';
import { TILES } from '@assets/images/tiles';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

type HandBuilderProps = {
  tiles: TileId[];
  melds: Meld[];
  onRemoveTile: (index: number) => void;
  onUpdateMelds: (melds: Meld[]) => void;
  onClearAll: () => void;
  onCalculate?: () => void;
};

export default function HandBuilder({
  tiles,
  melds,
  onRemoveTile,
  onUpdateMelds,
  onClearAll,
  onCalculate
}: HandBuilderProps) {
  const styles = stylesheet;
  const [groupingMode, setGroupingMode] = useState(false);
  const [removalMode, setRemovalMode] = useState(false);
  const [selectedForGroup, setSelectedForGroup] = useState<number[]>([]);
  const tilesRemaining = HAND_SIZE - tiles.length;
  const isComplete = tiles.length === HAND_SIZE;

  // Bottom sheet snap points - always have both for smooth transitions
  // Collapsed: 60px (just header), Partial: 120px (header + cards), Expanded: 350px (full content)
  // Don't add bottom inset to snap points - let the sheet sit above tab bar naturally
  const snapPoints = [60, 120, 350];

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Auto-expand when tiles are added, collapse when empty
  React.useEffect(() => {
    if (tiles.length > 0 && bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(2); // Expand to full (index 2 = 350px)
    } else if (tiles.length === 0 && bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0); // Collapse to just header (index 0 = 60px)
    }
  }, [tiles.length]);

  const handleTilePress = (index: number) => {
    if (removalMode) {
      // In removal mode, tap to remove
      handleLongPressRemove(index);
      return;
    }

    // If in grouping mode and this tile is in a meld, ungroup it first
    if (groupingMode) {
      const meldContainingTile = melds.find(meld =>
        meld.tileIndices.includes(index)
      );
      if (meldContainingTile) {
        // Ungroup this meld first, then continue with selection
        onUpdateMelds(melds.filter(m => m.id !== meldContainingTile.id));
        // Continue to add this tile to selection
      }
    } else {
      // Check if this specific tile index is in a meld - if so, ungroup it
      const meldContainingTile = melds.find(meld =>
        meld.tileIndices.includes(index)
      );
      if (meldContainingTile) {
        // Ungroup: remove this meld
        onUpdateMelds(melds.filter(m => m.id !== meldContainingTile.id));
        return;
      }
    }

    if (!groupingMode) {
      setGroupingMode(true);
      setSelectedForGroup([index]);
      return;
    }

    if (selectedForGroup.includes(index)) {
      // Deselect
      const newSelection = selectedForGroup.filter(i => i !== index);
      setSelectedForGroup(newSelection);
      if (newSelection.length === 0) {
        setGroupingMode(false);
      }
    } else {
      // Add to selection
      const newSelection = [...selectedForGroup, index];

      // Update selection state first so all tiles show as selected
      setSelectedForGroup(newSelection);

      // Auto-detect meld type and create group
      if (newSelection.length >= 2) {
        const selectedTiles = newSelection.map(i => tiles[i]);
        const meldType = detectMeldType(selectedTiles);

        if (meldType && newSelection.length === getMeldSize(meldType)) {
          // Check if any of these specific tile indices are already in another meld
          const existingMeldIndices = melds
            .map((meld, meldIndex) => {
              const hasOverlap = newSelection.some(tileIndex =>
                meld.tileIndices.includes(tileIndex)
              );
              return hasOverlap ? meldIndex : -1;
            })
            .filter(i => i !== -1);

          // Remove overlapping melds
          const filteredMelds = melds.filter(
            (_, i) => !existingMeldIndices.includes(i)
          );

          // Sort indices and corresponding tiles to ensure consistency
          const sortedIndices = [...newSelection].sort((a, b) => a - b);
          const sortedTiles = sortedIndices.map(i => tiles[i]);

          const newMeld: Meld = {
            id: `meld-${Date.now()}-${Math.random()}`,
            type: meldType,
            tiles: sortedTiles,
            tileIndices: sortedIndices,
            isOpen: false
          };

          // Update melds - this will cause tiles to show meld style (green) instead of selection style
          onUpdateMelds([...filteredMelds, newMeld]);

          // Clear selection after a brief delay to allow visual feedback
          // The tiles will now show the meld style (green) instead
          setTimeout(() => {
            setGroupingMode(false);
            setSelectedForGroup([]);
          }, 100);
        }
      }
    }
  };

  const handleLongPressRemove = (index: number) => {
    // Calculate what the new tiles array will be after removal
    const newTiles = tiles.filter((_, i) => i !== index);

    // Remove melds that contained this specific tile index
    // (a meld is invalid if any of its tiles are removed)
    const updatedMelds = melds
      .filter(meld => !meld.tileIndices.includes(index))
      .map(meld => {
        // Update indices for tiles that come after the removed one
        // All indices greater than the removed index need to be decremented by 1
        const updatedIndices = meld.tileIndices
          .filter(i => i !== index) // Remove the index being deleted
          .map(i => (i > index ? i - 1 : i)) // Decrement indices after the removed one
          .sort((a, b) => a - b); // Keep indices sorted

        // Rebuild tiles array from updated indices using the NEW tiles array
        const updatedTiles = updatedIndices
          .map(i => newTiles[i])
          .filter(Boolean);

        return {
          ...meld,
          tileIndices: updatedIndices,
          tiles: updatedTiles
        };
      });

    // Update melds first, then remove the tile
    onUpdateMelds(updatedMelds);
    onRemoveTile(index);
  };

  const cancelGrouping = () => {
    setGroupingMode(false);
    setSelectedForGroup([]);
  };

  const toggleRemovalMode = () => {
    setRemovalMode(!removalMode);
    if (groupingMode) {
      setGroupingMode(false);
      setSelectedForGroup([]);
    }
  };

  const tileCounts = getTileCounts(tiles);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      activeOffsetY={[-1, 1]}
      failOffsetX={[-5, 5]}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.bottomSheet}>
      <BottomSheetView style={styles.container}>
        <View style={[styles.header, styles.headerPadding]}>
          <View style={styles.headerLeft}>
            <Text type='subtitle' style={styles.title}>
              Your Hand
            </Text>
            <Text style={styles.counter}>
              {tiles.length}/{HAND_SIZE} tiles
              {tilesRemaining > 0 && ` (${tilesRemaining} remaining)`}
            </Text>
          </View>
          {tiles.length > 0 && !removalMode && (
            <View style={styles.headerRight}>
              <Pressable
                onPress={toggleRemovalMode}
                style={({ pressed }) => [
                  styles.removeButton,
                  pressed && styles.removeButtonPressed
                ]}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
              <Pressable onPress={onClearAll} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.contentWrapper}>
          {tiles.length === 0 ? (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              style={[styles.emptyState, styles.emptyStatePadding]}>
              <Text style={styles.emptyText}>
                Tap tiles above to add them to your hand
              </Text>
            </Animated.View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.tilesContainer}
              style={styles.tilesScrollView}
              nestedScrollEnabled={true}>
              {tiles.map((tileId, index) => {
                const isSelected = selectedForGroup.includes(index);
                // Check if this specific tile index is in any meld
                const isInMeld = melds.some(meld =>
                  meld.tileIndices.includes(index)
                );
                const count = tileCounts[tileId];
                // Show count badge on all duplicate tiles, or just the first one
                const isFirstOfType = tiles.indexOf(tileId) === index;
                const showCount = count > 1 && isFirstOfType;

                return (
                  <Animated.View
                    key={`${tileId}-${index}`}
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    layout={LinearTransition}>
                    <Pressable
                      onPress={() => handleTilePress(index)}
                      style={({ pressed }) => [
                        styles.tileWrapper,
                        isSelected && styles.tileWrapperSelected,
                        isInMeld && styles.tileWrapperInMeld,
                        removalMode && styles.tileWrapperRemovalMode,
                        pressed && styles.tileWrapperPressed
                      ]}>
                      <Image
                        source={TILES[tileId]}
                        style={styles.tileImage}
                        resizeMode='contain'
                      />
                      {removalMode && (
                        <Animated.View
                          entering={FadeIn.duration(150)}
                          exiting={FadeOut.duration(100)}
                          style={styles.removeBadge}>
                          <Text style={styles.removeBadgeText}>×</Text>
                        </Animated.View>
                      )}
                      {showCount && !removalMode && (
                        <Animated.View
                          entering={FadeIn.duration(150)}
                          exiting={FadeOut.duration(100)}
                          style={styles.countBadge}>
                          <Text style={styles.countText}>{count}</Text>
                        </Animated.View>
                      )}
                      {isInMeld && !removalMode && !groupingMode && (
                        <Animated.View
                          entering={FadeIn.duration(150)}
                          exiting={FadeOut.duration(100)}
                          style={styles.ungroupHint}>
                          <View style={styles.ungroupHintInner}>
                            <Text style={styles.ungroupHintText}>Ungroup</Text>
                          </View>
                        </Animated.View>
                      )}
                    </Pressable>
                  </Animated.View>
                );
              })}
            </ScrollView>
          )}

          {groupingMode && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              layout={LinearTransition}
              style={[styles.groupingModeBanner, styles.bannerPadding]}>
              <Text style={styles.groupingModeText}>
                Tap tiles to group them into melds
              </Text>
              <Pressable onPress={cancelGrouping} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </Animated.View>
          )}

          {removalMode && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              layout={LinearTransition}
              style={[styles.removalModeBanner, styles.bannerPadding]}>
              <Text style={styles.removalModeText}>
                Tap tiles to remove them
              </Text>
              <Pressable
                onPress={toggleRemovalMode}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Done</Text>
              </Pressable>
            </Animated.View>
          )}

          {isComplete && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              layout={LinearTransition}
              style={[styles.completeBanner, styles.bannerPadding]}>
              <Text style={styles.completeText}>
                ✓ Hand complete! Ready to calculate.
              </Text>
            </Animated.View>
          )}

          {onCalculate && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(150)}
              layout={LinearTransition}
              style={styles.calculateButtonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.calculateButton,
                  tiles.length !== 14 && styles.calculateButtonDisabled,
                  pressed &&
                    tiles.length === 14 &&
                    styles.calculateButtonPressed
                ]}
                onPress={onCalculate}
                disabled={tiles.length !== 14}>
                <Text
                  style={[
                    styles.calculateButtonText,
                    tiles.length !== 14 && styles.calculateButtonTextDisabled
                  ]}>
                  {tiles.length === 14
                    ? 'Calculate Points'
                    : `Select ${14 - tiles.length} more tile${
                        14 - tiles.length !== 1 ? 's' : ''
                      }`}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

function detectMeldType(
  tiles: TileId[]
): 'sequence' | 'triplet' | 'pair' | null {
  if (!tiles || tiles.length === 0) return null;

  if (tiles.length === 2) {
    // Check if it's a pair (same tile)
    if (tiles[0] === tiles[1]) {
      return 'pair';
    }
  } else if (tiles.length === 3) {
    // Check if it's a triplet (all same)
    if (tiles[0] === tiles[1] && tiles[1] === tiles[2]) {
      return 'triplet';
    }
    // Check if it's a sequence (consecutive numbers in same suit)
    if (isSequence(tiles)) {
      return 'sequence';
    }
  }
  return null;
}

function isSequence(tiles: TileId[]): boolean {
  if (!tiles || tiles.length !== 3) return false;
  if (!tiles[0] || !tiles[1] || !tiles[2]) return false;

  // Extract suit and numbers
  const suit = tiles[0][1]; // 'm', 'p', or 's'
  if (!suit || !['m', 'p', 's'].includes(suit)) return false; // Winds/dragons can't form sequences

  // Check all tiles are same suit
  if (!tiles.every(t => t && t[1] === suit)) return false;

  const numbers = tiles
    .map(t => parseInt(t[0], 10))
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b);
  if (numbers.length !== 3) return false;

  // Check if consecutive
  return numbers[0] + 1 === numbers[1] && numbers[1] + 1 === numbers[2];
}

function getMeldSize(type: 'sequence' | 'triplet' | 'pair'): number {
  switch (type) {
    case 'pair':
      return 2;
    case 'triplet':
    case 'sequence':
      return 3;
    default:
      return 0;
  }
}

const stylesheet = StyleSheet.create(theme => ({
  bottomSheet: {
    marginHorizontal: 0
  },
  bottomSheetBackground: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg || 20,
    borderTopRightRadius: theme.borderRadius.lg || 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  handleIndicator: {
    backgroundColor: theme.colors.border,
    width: 40
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  headerPadding: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm
  },
  bannerPadding: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xs / 2 || 2, // Reduced gap from tiles
    marginBottom: 4 // Small gap before button
  },
  emptyStatePadding: {
    paddingHorizontal: theme.spacing.lg
  },
  calculateButtonContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: 2, // Reduced gap from cards
    paddingBottom: theme.spacing.sm
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm
  },
  headerLeft: {
    flex: 1
  },
  title: {
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2
  },
  counter: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  },
  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    alignItems: 'center'
  },
  removeButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  removeButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  removeButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text,
    fontWeight: '600',
    letterSpacing: 0.3
  },
  clearButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.warning + '20',
    borderWidth: 1,
    borderColor: theme.colors.warning
  },
  clearButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning,
    fontWeight: '600'
  },
  groupingModeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '20',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.base,
    marginBottom: theme.spacing.sm
  },
  removalModeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.base,
    marginBottom: theme.spacing.sm
  },
  removalModeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning,
    fontWeight: '500',
    flex: 1
  },
  groupingModeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: '500',
    flex: 1
  },
  cancelButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2
  },
  cancelButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  },
  tilesScrollView: {
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: theme.spacing.lg
  },
  tilesContainer: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingBottom: theme.spacing.sm + 20, // Extra padding for ungroup hints, reduced gap
    flexGrow: 0
  },
  tileWrapper: {
    width: 50,
    height: 70,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible'
  },
  tileWrapperSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '20',
    borderWidth: 3
  },
  tileWrapperInMeld: {
    borderColor: theme.colors.success || '#34C759',
    backgroundColor: (theme.colors.success || '#34C759') + '10'
  },
  tileWrapperRemovalMode: {
    borderColor: theme.colors.warning,
    backgroundColor: theme.colors.warning + '10'
  },
  tileWrapperPressed: {
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
  },
  removeBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
    zIndex: 10
  },
  removeBadgeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20
  },
  ungroupHint: {
    position: 'absolute',
    bottom: -18,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5
  },
  ungroupHintInner: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm / 2,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 50
  },
  ungroupHintText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center'
  },
  completeBanner: {
    marginTop: theme.spacing.xs / 2 || 2, // Reduced gap from tiles
    marginBottom: 4, // Small gap before button
    padding: theme.spacing.sm,
    backgroundColor: (theme.colors.success || '#34C759') + '20',
    borderRadius: theme.borderRadius.base,
    alignItems: 'center'
  },
  completeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.success || '#34C759',
    fontWeight: '600'
  },
  calculateButton: {
    marginTop: 0,
    borderRadius: theme.borderRadius.base,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3
  },
  calculateButtonDisabled: {
    opacity: 0.5
  },
  calculateButtonPressed: {
    opacity: 0.8
  },
  calculateButtonText: {
    backgroundColor: theme.colors.primary,
    color: '#FFFFFF',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: theme.borderRadius.base
  },
  calculateButtonTextDisabled: {
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.textSecondary
  }
}));
