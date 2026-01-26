import { Text, View } from '@/components';
import { yakuList } from '@/data/yaku';
import type { CalculateStackParamList } from '@/navigation/CalculateStackNavigator';
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
import { useMemo } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<CalculateStackParamList>;
type ResultsRouteProp = RouteProp<CalculateStackParamList, 'Result'>;

export default function ResultScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultsRouteProp>();
  const hand = route.params.hand;

  const result = useMemo(() => calculateHandPoints(hand), [hand]);

  const handleEdit = () => {
    navigation.replace('Calculator', { initialHand: hand });
  };

  const handleNewCalculation = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'CalculateHome' }]
      })
    );
  };

  const yakuEntries = useMemo(() => {
    if (!result.yaku) return [];

    return Object.entries(result.yaku).map(([yakuId, han]) => {
      const yakuData = yakuList.find(y => y.id === yakuId);
      return {
        id: yakuId,
        name: yakuData?.name || capitalizeFirstLetter(yakuId),
        nameEn: yakuData?.nameEn || capitalizeFirstLetter(yakuId),
        han
      };
    });
  }, [result.yaku]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.scoreCard}>
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
        </View>

        <Text style={styles.sectionTitle}>Your Hand</Text>

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tilesContainer}>
            {hand.closedPart.map((tileId, index) => (
              <View key={`${tileId}-${index}`} style={styles.tileWrapper}>
                <Image source={TILES[tileId]} style={styles.tile} />
              </View>
            ))}
          </ScrollView>
        </View>

        {hand.openPart.length > 0 && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tilesContainer}>
              {hand.openPart.map((meld, meldIndex) => (
                <View key={meldIndex} style={styles.meldGroup}>
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

        <Text style={styles.sectionTitle}>Yaku</Text>
        {yakuEntries.length > 0 && (
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
            pressed && styles.buttonPressed
          ]}
          onPress={handleNewCalculation}>
          <Text style={styles.buttonText}>New</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
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
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.base,
    gap: theme.spacing.xs,
    flexDirection: 'row'
  },
  meldGroup: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginRight: theme.spacing.base
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
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary
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
  secondaryButtonText: {
    backgroundColor: theme.colors.secondary,
    color: '#FFFFFF',
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: theme.borderRadius.md
  }
}));
