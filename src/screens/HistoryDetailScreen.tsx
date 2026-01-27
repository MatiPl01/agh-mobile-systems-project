import { Text, View } from '@/components';
import { yakuList } from '@/data/yaku';
import { useHistory } from '@/hooks/useHistory';
import type { HistoryStackParamList } from '@/navigation/HistoryStackNavigator';
import { calculateHandPoints } from '@/utils/calculator';
import { createEmptyHand } from '@/utils/hand';
import { capitalizeFirstLetter } from '@/utils/utils';
import { TILES } from '@assets/images/tiles';
import type { TileId, Hand } from '@/types/hand';
import {
  useNavigation,
  useRoute,
  type RouteProp
} from '@react-navigation/native';
import { useMemo } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type HistoryDetailRouteProp = RouteProp<HistoryStackParamList, 'HandDetail'>;

export default function HistoryDetailScreen() {
  const route = useRoute<HistoryDetailRouteProp>();
  const navigation = useNavigation();

  const { handId } = route.params;

  const { getItem } = useHistory();

  const item = getItem(handId);
  
  // HistoryItem stores tiles as a flat array, so we create a simple hand structure
  // with all tiles in closedPart for display purposes
  const hand: Hand = item
    ? { closedPart: item.tiles, openPart: [] }
    : createEmptyHand();
  const result = item?.result ?? calculateHandPoints(hand);

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

  const handleYakuPress = (yakuId: string) => {
    navigation.getParent()?.navigate('Yaku', {
      screen: 'YakuDetail',
      params: { yakuId }
    });
  };

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

          {result.yakuman ? (
            <View style={styles.hanFuItem}>
              <Text style={styles.hanFuValue}>{result.yakuman}</Text>
              <Text style={styles.hanFuLabel}>Yakuman</Text>
            </View>
          ) : (
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
          )}
        </View>

        <Text style={styles.sectionTitle}>Your Hand</Text>

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tilesContainer}>
            {hand.closedPart.map((tileId: TileId, index: number) => (
              <View key={`${tileId}-${index}`} style={styles.tileWrapper}>
                <Image source={TILES[tileId] as number} style={styles.tile} />
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
              {hand.openPart.map((meld: { tiles: TileId[] }, meldIndex: number) => (
                <View key={meldIndex} style={styles.meldGroup}>
                  {meld.tiles.map((tileId: TileId, index: number) => (
                    <View key={`${tileId}-${index}`} style={styles.tileWrapper}>
                      <Image source={TILES[tileId] as number} style={styles.tile} />
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
                <Pressable
                  key={id}
                  style={({ pressed }) => [
                    styles.yakuCard,
                    pressed && styles.yakuCardPressed
                  ]}
                  onPress={() => handleYakuPress(id)}>
                  <View style={styles.yakuInfo}>
                    <Text style={styles.yakuName}>{name}</Text>
                    <Text style={styles.yakuNameEn}>{nameEn}</Text>
                  </View>
                  <View style={styles.yakuHanBadge}>
                    <Text style={styles.yakuHanValue}>{han}</Text>
                    <Text style={styles.yakuHanLabel}>han</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
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
    color: 'rgba(255, 255, 255, 0.8)'
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
  yakuCardPressed: {
    opacity: 0.7
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
  }
}));
