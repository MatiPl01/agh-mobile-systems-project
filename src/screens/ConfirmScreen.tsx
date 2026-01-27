import { Text, View } from '@/components';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import { Wind, WinType } from '@/types/hand';
import { ORDERED_WINDS } from '@/utils/hand';
import { TILES } from '@assets/images/tiles';
import {
  useNavigation,
  useRoute,
  type RouteProp
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;
type ConfirmRouteProp = RouteProp<CalculateStackParamList, 'Confirm'>;

function getWindLabel(wind: Wind) {
  switch (wind) {
    case 'ew':
      return 'East';
    case 'sw':
      return 'South';
    case 'ww':
      return 'West';
    case 'nw':
      return 'North';
    default:
      return '';
  }
}

export default function ConfirmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ConfirmRouteProp>();

  const { hand, historyId } = route.params;

  const [winningTileIndex, setWinningTileIndex] = useState<number | null>(null);
  const [winType, setWinType] = useState<WinType>('tsumo');
  const [roundWind, setRoundWind] = useState<Wind>('ew');
  const [seatWind, setSeatWind] = useState<Wind>('ew');
  const [riichi, setRiichi] = useState(false);
  const [ippatsu, setIppatsu] = useState(false);
  const [doubleRiichi, setDoubleRiichi] = useState(false);

  const isConfirmDisabled = winningTileIndex === null;

  const handleEdit = () => {
    navigation.replace('Calculator', { initialHand: hand, historyId });
  };

  const handleConfirm = () => {
    if (winningTileIndex === null) return;

    navigation.navigate('Result', {
      hand: {
        ...hand,
        options: {
          winningTileIndex,
          winType,
          roundWind,
          seatWind,
          riichi,
          ippatsu,
          doubleRiichi
        }
      },
      historyId
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.sectionTitle}>Closed part</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.closedPartTilesContainer}>
            {hand.closedPart.map((tileId, index) => (
              <Pressable
                key={`${tileId}-${index}`}
                style={({ pressed }) => [
                  styles.tileWrapper,
                  winningTileIndex === index && styles.tileWrapperSelected,
                  pressed && styles.tileWrapperPressed
                ]}
                onPress={() => setWinningTileIndex(index)}>
                <Image source={TILES[tileId]} style={styles.tile} />
              </Pressable>
            ))}
          </ScrollView>
          <Text style={styles.guideText}>Tap the winning tile</Text>
        </View>

        {hand.openPart.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Open part</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.openPartTilesContainer}>
              {hand.openPart.map((meld, meldIndex) => (
                <View key={meldIndex} style={styles.meldTilesContainer}>
                  {meld.tiles.map((tileId, index) => (
                    <View key={`${tileId}-${index}`} style={styles.tileWrapper}>
                      <Image source={TILES[tileId]} style={styles.tile} />
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Win type</Text>
          <View style={styles.optionGroup}>
            <View style={styles.segmentedControl}>
              <Pressable
                style={({ pressed }) => [
                  styles.segmentButton,
                  styles.segmentButtonLeft,
                  winType === 'tsumo' && styles.segmentButtonActive,
                  pressed && styles.segmentButtonPressed
                ]}
                onPress={() => setWinType('tsumo')}>
                <Text
                  style={[
                    styles.segmentButtonText,
                    winType === 'tsumo' && styles.segmentButtonTextActive
                  ]}>
                  Tsumo
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.segmentButton,
                  styles.segmentButtonRight,
                  winType === 'ron' && styles.segmentButtonActive,
                  pressed && styles.segmentButtonPressed
                ]}
                onPress={() => setWinType('ron')}>
                <Text
                  style={[
                    styles.segmentButtonText,
                    winType === 'ron' && styles.segmentButtonTextActive
                  ]}>
                  Ron
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Round wind</Text>
          <View style={styles.optionGroup}>
            <View style={styles.windGrid}>
              {ORDERED_WINDS.map(wind => (
                <Pressable
                  key={wind}
                  style={({ pressed }) => [
                    styles.optionButton,
                    roundWind === wind && styles.optionButtonActive,
                    pressed && styles.optionButtonPressed
                  ]}
                  onPress={() => setRoundWind(wind)}>
                  <Text
                    style={[
                      styles.optionButtonText,
                      roundWind === wind && styles.optionButtonTextActive
                    ]}>
                    {getWindLabel(wind)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Seat wind</Text>
          <View style={styles.optionGroup}>
            <View style={styles.windGrid}>
              {ORDERED_WINDS.map(wind => (
                <Pressable
                  key={wind}
                  style={({ pressed }) => [
                    styles.optionButton,
                    seatWind === wind && styles.optionButtonActive,
                    pressed && styles.optionButtonPressed
                  ]}
                  onPress={() => setSeatWind(wind)}>
                  <Text
                    style={[
                      styles.optionButtonText,
                      seatWind === wind && styles.optionButtonTextActive
                    ]}>
                    {getWindLabel(wind)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {hand.openPart.length === 0 && (
          <View>
            <Text style={styles.sectionTitle}>Riichi options</Text>
            <View style={styles.optionGroup}>
              <View style={styles.windGrid}>
                <Pressable
                  style={({ pressed }) => [
                    styles.optionButton,
                    riichi && styles.optionButtonActive,
                    pressed && styles.optionButtonPressed
                  ]}
                  onPress={() => {
                    setRiichi(!riichi);
                    if (riichi) {
                      setIppatsu(false);
                      setDoubleRiichi(false);
                    }
                  }}>
                  <Text
                    style={[
                      styles.optionButtonText,
                      riichi && styles.optionButtonTextActive
                    ]}>
                    Riichi
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.optionButton,
                    ippatsu && styles.optionButtonActive,
                    !riichi && styles.optionButtonDisabled,
                    pressed && riichi && styles.optionButtonPressed
                  ]}
                  onPress={() => riichi && setIppatsu(!ippatsu)}
                  disabled={!riichi}>
                  <Text
                    style={[
                      styles.optionButtonText,
                      ippatsu && styles.optionButtonTextActive,
                      !riichi && styles.optionButtonTextDisabled
                    ]}>
                    Ippatsu
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.optionButton,
                    doubleRiichi && styles.optionButtonActive,
                    !riichi && styles.optionButtonDisabled,
                    pressed && riichi && styles.optionButtonPressed
                  ]}
                  onPress={() => riichi && setDoubleRiichi(!doubleRiichi)}
                  disabled={!riichi}>
                  <Text
                    style={[
                      styles.optionButtonText,
                      doubleRiichi && styles.optionButtonTextActive,
                      !riichi && styles.optionButtonTextDisabled
                    ]}>
                    Double
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
          onPress={handleEdit}>
          <Text style={styles.secondaryButtonText}>Edit Hand</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && !isConfirmDisabled && styles.buttonPressed
          ]}
          onPress={handleConfirm}
          disabled={isConfirmDisabled}>
          <Text
            style={[
              styles.buttonText,
              isConfirmDisabled && styles.buttonTextDisabled
            ]}>
            Confirm
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1
  },
  content: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.base
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.base
  },
  guideText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    paddingHorizontal: theme.spacing.base,
    fontWeight: '600'
  },
  closedPartTilesContainer: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.base,
    gap: theme.spacing.xs
  },
  openPartTilesContainer: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.base,
    gap: theme.spacing.base
  },
  meldTilesContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs
  },
  tileWrapper: {
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary
  },
  tileWrapperSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10'
  },
  tileWrapperPressed: {
    opacity: 0.7
  },
  tile: {
    width: 32,
    height: 44,
    resizeMode: 'contain'
  },
  optionGroup: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.base,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  segmentButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center'
  },
  segmentButtonLeft: {
    borderTopLeftRadius: theme.borderRadius.base,
    borderBottomLeftRadius: theme.borderRadius.base
  },
  segmentButtonRight: {
    borderTopRightRadius: theme.borderRadius.base,
    borderBottomRightRadius: theme.borderRadius.base,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.primary
  },
  segmentButtonPressed: {
    opacity: 0.7
  },
  segmentButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    color: theme.colors.text
  },
  segmentButtonTextActive: {
    color: '#FFFFFF'
  },
  windGrid: {
    flexDirection: 'row',
    gap: theme.spacing.xs
  },
  optionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.base,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center'
  },
  optionButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10'
  },
  optionButtonPressed: {
    opacity: 0.7
  },
  optionButtonDisabled: {
    opacity: 0.5
  },
  optionButtonText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    color: theme.colors.text
  },
  optionButtonTextActive: {
    color: theme.colors.primary
  },
  optionButtonTextDisabled: {
    color: theme.colors.textSecondary
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.base,
    borderTopWidth: 1,
    borderColor: theme.colors.border
  },
  button: {
    flex: 1
  },
  buttonPressed: {
    opacity: 0.8
  },
  buttonText: {
    backgroundColor: theme.colors.primary,
    color: '#FFFFFF',
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: theme.borderRadius.md
  },
  buttonTextDisabled: {
    opacity: 0.5
  },
  secondaryButtonText: {
    backgroundColor: theme.colors.secondary + '30',
    color: theme.colors.textSecondary,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: theme.borderRadius.md
  }
}));
