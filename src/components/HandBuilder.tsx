import { Text, View } from '@/components';
import type { Hand } from '@/types/hand';
import {
  createEmptyHand,
  getHandSize,
  groupTilesIntoOpenPart,
  isEmptyHand,
  isValidHand,
  isValidMeld,
  removeClosedPartTile,
  ungroupOpenPartMeld
} from '@/utils/hand';
import { TILES } from '@assets/images/tiles';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import {
  SharedValue,
  useDerivedValue,
  withSpring
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

type HandBuilderProps = {
  hand: Hand;
  onHandChange: (newHand: Hand) => void;
  onCalculate: () => void;
  bottomSheetHeight: SharedValue<number>;
};

export default function HandBuilder({
  hand,
  onHandChange,
  onCalculate,
  bottomSheetHeight
}: HandBuilderProps) {
  const [groupingMode, setGroupingMode] = useState(false);
  const [ungroupingMode, setUngroupingMode] = useState(false);
  const [removalMode, setRemovalMode] = useState(false);
  const [selectedForGroup, setSelectedForGroup] = useState<number[]>([]);

  const { animatedIndex, animatedSheetHeight } = useBottomSheetInternal();

  useDerivedValue(() => {
    bottomSheetHeight.value = withSpring(
      animatedIndex.value * (animatedSheetHeight.value - 84) + 84
    );
  });

  const handSize = getHandSize(hand);
  const isHandEmpty = isEmptyHand(hand);
  const isHandValid = isValidHand(hand);
  const hasClosedPart = hand.closedPart.length > 0;
  const hasOpenPart = hand.openPart.length > 0;

  const isSelectedTilesValidMeld = isValidMeld(
    hand.closedPart.filter((_, index) => selectedForGroup.includes(index))
  );

  const handleTilePress = (index: number) => {
    // Removal mode
    if (removalMode) {
      const newHand = removeClosedPartTile(hand, index);
      onHandChange(newHand);

      // Exit removal mode if new hand is empty
      if (newHand.closedPart.length === 0) {
        setRemovalMode(false);
      }

      return;
    }

    // Enter grouping mode
    if (!groupingMode) {
      setGroupingMode(true);
      setSelectedForGroup([index]);
      return;
    }

    // Remove from selection in grouping mode
    if (selectedForGroup.includes(index)) {
      const newSelection = selectedForGroup.filter(i => i !== index);
      setSelectedForGroup(newSelection);

      // Exit grouping mode if no tiles are selected
      if (newSelection.length === 0) {
        setGroupingMode(false);
      }

      return;
    }

    // Add to selection in grouping mode
    const newSelection = [...selectedForGroup, index];
    setSelectedForGroup(newSelection);
  };

  const handleUngroupMeld = (meldIndex: number) => () => {
    const newHand = ungroupOpenPartMeld(hand, meldIndex);
    onHandChange(newHand);

    // Exit ungrouping mode if no open part remains
    if (newHand.openPart.length === 0) {
      setUngroupingMode(false);
    }
  };

  const cancelGrouping = () => {
    setGroupingMode(false);
    setSelectedForGroup([]);
  };

  const handleEnterRemovalMode = () => {
    setRemovalMode(true);
    if (groupingMode) {
      cancelGrouping();
    }
  };

  const handleExitRemovalMode = () => {
    setRemovalMode(false);
  };

  const handleEnterUngroupingMode = () => {
    setUngroupingMode(true);
    if (groupingMode) {
      cancelGrouping();
    }
  };

  const handleExitUngroupingMode = () => {
    setUngroupingMode(false);
  };

  const handleClearAll = () => {
    onHandChange(createEmptyHand());
    cancelGrouping();
  };

  const handleGroupTiles = () => {
    const newHand = groupTilesIntoOpenPart(hand, selectedForGroup);
    onHandChange(newHand);
    cancelGrouping();
  };

  return (
    <View>
      <View style={[styles.header]}>
        <View style={styles.headerLeft}>
          <Text type='subtitle' style={styles.title}>
            Your Hand
          </Text>
          <Text style={styles.counter}>{handSize} tiles</Text>
        </View>
        {!isHandEmpty && !removalMode && !ungroupingMode && (
          <View style={styles.headerRight}>
            <Pressable
              onPress={handleEnterRemovalMode}
              style={({ pressed }) => [
                styles.removeButton,
                pressed && styles.removeButtonPressed
              ]}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
            {hasOpenPart && (
              <Pressable
                onPress={handleEnterUngroupingMode}
                style={({ pressed }) => [
                  styles.removeButton,
                  pressed && styles.removeButtonPressed
                ]}>
                <Text style={styles.removeButtonText}>Ungroup</Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleClearAll}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.clearButtonPressed
              ]}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.contentWrapper}>
        {isHandEmpty ? (
          <View style={[styles.emptyState]}>
            <Text style={styles.emptyText}>
              Tap tiles above to add them to your hand
            </Text>
          </View>
        ) : (
          <View style={styles.handPartsContainer}>
            {hasClosedPart && (
              <View>
                <Text style={[styles.handPartTitle]}>Closed Part</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.closedPartTilesContainer,
                    ungroupingMode && styles.tilesContainerDisabled
                  ]}
                  nestedScrollEnabled={true}>
                  {hand.closedPart.map((tileId, index) => {
                    const isSelected = selectedForGroup.includes(index);

                    return (
                      <View key={`${tileId}-${index}`}>
                        <Pressable
                          onPress={() => handleTilePress(index)}
                          style={({ pressed }) => [
                            styles.tileWrapper,
                            isSelected && styles.tileWrapperSelected,
                            removalMode && styles.tileWrapperRemovalMode,
                            pressed && styles.tileWrapperPressed
                          ]}
                          disabled={ungroupingMode}>
                          <Image
                            source={TILES[tileId]}
                            style={styles.tileImage}
                          />
                          {removalMode && (
                            <View style={styles.removeBadge}>
                              <Text style={styles.removeBadgeText}>×</Text>
                            </View>
                          )}
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
            {hasOpenPart && (
              <View>
                <Text style={[styles.handPartTitle]}>Open Part</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.openPartTilesContainer,
                    (removalMode || groupingMode) &&
                      styles.tilesContainerDisabled
                  ]}
                  nestedScrollEnabled={true}>
                  {hand.openPart.map((meld, meldIndex) => (
                    <Pressable
                      key={`meld-${meldIndex}`}
                      onPress={handleUngroupMeld(meldIndex)}
                      style={({ pressed }) => [
                        styles.meldTilesContainer,
                        pressed && styles.meldTilesContainerPressed
                      ]}
                      disabled={!ungroupingMode}>
                      {meld.tiles.map((tileId, tileIndex) => {
                        return (
                          <View key={`${tileId}-${tileIndex}`}>
                            <View
                              style={[
                                styles.tileWrapper,
                                ungroupingMode && styles.tileWrapperRemovalMode
                              ]}>
                              <Image
                                source={TILES[tileId]}
                                style={styles.tileImage}
                              />
                            </View>
                          </View>
                        );
                      })}
                      {ungroupingMode && (
                        <View style={styles.ungroupButton}>
                          <View style={styles.ungroupButtonInner}>
                            <Text style={styles.ungroupButtonText}>
                              Remove group
                            </Text>
                          </View>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {ungroupingMode && (
          <View style={[styles.removalModeBanner, styles.bannerPadding]}>
            <Text style={styles.removalModeText}>
              Tap to remove open meld groups
            </Text>
            <Pressable
              onPress={handleExitUngroupingMode}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed
              ]}>
              <Text style={styles.cancelButtonText}>Done</Text>
            </Pressable>
          </View>
        )}

        {removalMode && (
          <View style={[styles.removalModeBanner, styles.bannerPadding]}>
            <Text style={styles.removalModeText}>
              Tap open part tiles to remove them
            </Text>
            <Pressable
              onPress={handleExitRemovalMode}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed
              ]}>
              <Text style={styles.cancelButtonText}>Done</Text>
            </Pressable>
          </View>
        )}

        {!groupingMode && !removalMode && !ungroupingMode && isHandValid && (
          <View style={[styles.completeBanner, styles.bannerPadding]}>
            <Text style={styles.completeText}>
              ✓ Hand complete! Ready to calculate.
            </Text>
          </View>
        )}

        {!isHandEmpty && !groupingMode && !removalMode && !ungroupingMode && (
          <View style={styles.calculateButtonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.calculateButton,
                !isHandValid && styles.calculateButtonDisabled,
                pressed && styles.calculateButtonPressed
              ]}
              onPress={onCalculate}
              disabled={!isHandValid}>
              <Text
                style={[
                  styles.calculateButtonText,
                  !isHandValid && styles.calculateButtonTextDisabled
                ]}>
                {isHandValid
                  ? 'Calculate Points'
                  : 'Complete your hand to calculate points'}
              </Text>
            </Pressable>
          </View>
        )}

        {groupingMode && (
          <View style={styles.groupTilesButtonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.groupTilesButton,
                !isSelectedTilesValidMeld && styles.groupTilesButtonDisabled,
                pressed && styles.groupTilesButtonPressed
              ]}
              onPress={handleGroupTiles}
              disabled={!isSelectedTilesValidMeld}>
              <Text style={[styles.groupTilesButtonText]}>
                {isSelectedTilesValidMeld
                  ? 'Add Open Meld'
                  : 'Tap tiles to select valid open meld'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  contentWrapper: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
    marginHorizontal: theme.spacing.base
  },
  headerLeft: {
    flex: 1
  },
  title: {
    color: theme.colors.text
  },
  counter: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  },
  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    alignItems: 'flex-start',
    marginTop: theme.spacing.xs
  },
  removeButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border
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
    borderColor: theme.colors.warning + '50'
  },
  clearButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  clearButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning,
    fontWeight: '600'
  },
  emptyState: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.base,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  },
  bannerPadding: {
    marginHorizontal: theme.spacing.base,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.base,
    marginBottom: theme.spacing.sm
  },
  removalModeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20'
  },
  removalModeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning,
    fontWeight: '500',
    flex: 1
  },
  cancelButton: {
    paddingHorizontal: theme.spacing.sm
  },
  cancelButtonPressed: {
    opacity: 0.5
  },
  cancelButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  handPartsContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.base
  },
  handPartTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginHorizontal: theme.spacing.base
  },
  closedPartTilesContainer: {
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.xs
  },
  openPartTilesContainer: {
    gap: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.xs
  },
  tilesContainerDisabled: {
    opacity: 0.5
  },
  meldTilesContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    position: 'relative'
  },
  meldTilesContainerPressed: {
    opacity: 0.7
  },
  tileWrapper: {
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
    position: 'relative'
  },
  tileWrapperSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10'
  },
  tileWrapperRemovalMode: {
    borderColor: theme.colors.warning,
    backgroundColor: theme.colors.warning + '10'
  },
  tileWrapperPressed: {
    opacity: 0.7
  },
  tileImage: {
    width: 32,
    height: 44,
    resizeMode: 'contain'
  },
  removeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.background,
    zIndex: 10
  },
  removeBadgeText: {
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 16.6
  },
  ungroupButton: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    top: -4,
    zIndex: 10,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  ungroupButtonInner: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
    paddingHorizontal: theme.spacing.base
  },
  ungroupButtonText: {
    fontSize: theme.typography.sizes.xs,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 19
  },
  completeBanner: {
    alignItems: 'center',
    backgroundColor: theme.colors.success + '20'
  },
  completeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.success,
    fontWeight: '500'
  },
  calculateButtonContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingBottom: theme.spacing.sm
  },
  calculateButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.base
  },
  calculateButtonDisabled: {
    opacity: 0.75,
    backgroundColor: theme.colors.backgroundSecondary
  },
  calculateButtonPressed: {
    opacity: 0.8
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    textAlign: 'center'
  },
  calculateButtonTextDisabled: {
    color: theme.colors.textSecondary
  },
  groupTilesButtonContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingBottom: theme.spacing.sm
  },
  groupTilesButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.base
  },
  groupTilesButtonDisabled: {
    opacity: 0.5
  },
  groupTilesButtonPressed: {
    opacity: 0.8
  },
  groupTilesButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    textAlign: 'center'
  }
}));
