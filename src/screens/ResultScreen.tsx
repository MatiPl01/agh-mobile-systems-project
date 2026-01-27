import { Text, View } from '@/components';
import { yakuList } from '@/data/yaku';
import { useHistory } from '@/hooks/useHistory';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
import type { HandPoints as ScoringResult } from '@/types/hand';
import { calculateHandPoints } from '@/utils/calculator';
import { capitalizeFirstLetter } from '@/utils/utils';
import { TILES } from '@assets/images/tiles';
import {
  CommonActions,
  useNavigation,
  useRoute,
  type RouteProp
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;
type ResultsRouteProp = RouteProp<CalculateStackParamList, 'Result'>;

export default function ResultScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultsRouteProp>();
  const hand = route.params.hand;
  const { addItem, updateItem } = useHistory();
  const { theme } = useUnistyles();

  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<ScoringResult | null>(null);

  useEffect(() => {
    // Small delay to allow transition animation to finish and show loader
    const timer = setTimeout(() => {
      try {
        const calculated = calculateHandPoints(hand);
        setResult(calculated);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [hand]);

  const handleEdit = () => {
    // Go back to Calculator (pop Result and Confirm)
    if (navigation.canGoBack()) {
      navigation.pop(2);
    } else {
      // Fallback if not in stack (e.g. direct nav)
      navigation.replace('Calculator', { initialHand: hand });
    }
  };

  const handleSave = async () => {
    if (!result) return;

    // Collect all tiles for the history view
    const allTiles = [
      ...hand.closedPart,
      ...hand.openPart.flatMap(p => p.tiles)
    ];

    const historyId = route.params.historyId;
    if (historyId) {
      await updateItem(historyId, allTiles, result);
    } else {
      await addItem(allTiles, result);
    }

    Alert.alert(
      historyId ? 'Updated' : 'Saved',
      historyId ? 'Hand updated in history.' : 'Hand saved to history.',
      [
        {
          text: 'View History',
          onPress: () => {
            // Navigate to History tab first (via parent TabNavigator)
            // @ts-ignore
            navigation.getParent()?.navigate('History');

            // Then reset the Calculate stack to home
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'CalculateHome' }]
              })
            );
          }
        },
        {
          text: 'Done',
          onPress: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'CalculateHome' }]
              })
            );
          }
        }
      ]
    );
  };

  const yakuEntries = useMemo(() => {
    if (!result || !result.yaku) return [];

    return Object.entries(result.yaku).map(([yakuId, han]) => {
      const yakuData = yakuList.find(y => y.id === yakuId);
      return {
        id: yakuId,
        name: yakuData?.name || capitalizeFirstLetter(yakuId),
        nameEn: yakuData?.nameEn || capitalizeFirstLetter(yakuId),
        han
      };
    });
  }, [result]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
        <Text style={styles.loadingText}>Calculating points...</Text>
      </View>
    );
  }

  const isValidHand = result && !result.error && result.isAgari;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.scoreCard, !isValidHand && styles.errorCard]}>
          {isValidHand ? (
            <>
              <View style={styles.scoreHeader}>
                <Text style={styles.pointsLabel}>Total Points</Text>
                <Text style={styles.pointsValue}>
                  {result.ten.toLocaleString()}
                </Text>
              </View>

              <View style={styles.hanFuRow}>
                <View style={styles.hanFuItem}>
                  <Text style={styles.hanFuValue}>{result.han}</Text>
                  <Text style={styles.hanFuLabel}>Han</Text>
                </View>
                <View style={styles.hanFuDivider} />
                <View style={styles.hanFuItem}>
                  <Text style={styles.hanFuValue}>{result.fu}</Text>
                  <Text style={styles.hanFuLabel}>Fu</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.scoreHeader}>
              <Text style={styles.errorTitle}>Invalid Hand</Text>
              <Text style={styles.errorText}>
                {result?.error
                  ? 'There was an error parsing this hand.'
                  : 'This hand is not a winning hand (Agari). Check if you have at least one Yaku and a valid shape (4 sets + 1 pair).'}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Your Hand</Text>

        <View style={styles.tilesContainer}>
          {/* Closed Tiles */}
          {hand.closedPart.map((tileId, index) => (
            <View key={`closed-${tileId}-${index}`} style={styles.tileWrapper}>
              <Image source={TILES[tileId]} style={styles.tile} />
            </View>
          ))}

          {/* Separator spacing if needed, handled by gap */}

          {/* Open Tiles (Melds) */}
          {hand.openPart.map((meld, meldIndex) => (
            <View key={`meld-${meldIndex}`} style={styles.meldGroup}>
              {meld.tiles.map((tileId, index) => (
                <View
                  key={`open-${tileId}-${index}`}
                  style={styles.tileWrapper}>
                  <Image source={TILES[tileId]} style={styles.tile} />
                </View>
              ))}
            </View>
          ))}
        </View>

        {isValidHand && yakuEntries.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Yaku</Text>
            <View style={styles.yakuSection}>
              <View style={styles.yakuList}>
                {yakuEntries.map(({ id, name, nameEn, han }) => (
                  <View key={id} style={styles.yakuCard}>
                    <View style={styles.yakuInfo}>
                      <Text style={styles.yakuName}>{name}</Text>
                      <Text style={styles.yakuNameEn}>{nameEn}</Text>
                    </View>
                    <View style={styles.yakuHanBadge}>
                      <Text style={styles.yakuHanValue}>{han}</Text>
                      <Text style={styles.yakuHanLabel}>han</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : isValidHand ? (
          <View style={styles.emptyYakuContainer}>
            <Text style={styles.emptyYakuText}>No Yaku found (Dora only?)</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleEdit}>
          <Text style={styles.secondaryButtonText}>Edit</Text>
        </Pressable>
        {isValidHand && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.saveButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        )}
        {!isValidHand && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.saveButton,
              pressed && styles.buttonPressed
            ]}
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'CalculateHome' }]
                })
              );
            }}>
            <Text style={styles.buttonText}>New</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.base
  },
  loadingText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    fontWeight: '500'
  },
  content: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.base
  },
  scoreCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm
  },
  errorCard: {
    backgroundColor: theme.colors.error || '#FF3B30'
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.base,
    backgroundColor: 'transparent'
  },
  pointsLabel: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.xs
  },
  pointsValue: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22
  },
  hanFuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    backgroundColor: 'transparent'
  },
  hanFuItem: {
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  hanFuValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  hanFuLabel: {
    fontSize: theme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  hanFuDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.base,
    marginTop: theme.spacing.sm
  },
  tilesContainer: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  meldGroup: {
    flexDirection: 'row',
    gap: 4,
    // Add margin to separate melds from closed part or each other when wrapping
    marginLeft: 8
  },
  tileWrapper: {
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary
  },
  tile: {
    width: 32,
    height: 44,
    resizeMode: 'contain'
  },
  yakuSection: {
    paddingHorizontal: theme.spacing.base
  },
  yakuList: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs
  },
  yakuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.base
  },
  yakuInfo: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  yakuName: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    color: theme.colors.text
  },
  yakuNameEn: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  },
  yakuHanBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm
  },
  yakuHanValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.primary
  },
  yakuHanLabel: {
    fontSize: 10,
    color: theme.colors.primary
  },
  emptyYakuContainer: {
    padding: theme.spacing.base,
    alignItems: 'center'
  },
  emptyYakuText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.base,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    paddingBottom: 32
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  saveButton: {
    backgroundColor: theme.colors.primary
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.border
  },
  buttonPressed: {
    opacity: 0.8
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.base,
    fontWeight: '600'
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.base,
    fontWeight: '600'
  }
}));
