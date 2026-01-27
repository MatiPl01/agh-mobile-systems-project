import { Text, View } from '@/components';
import { useHistory } from '@/hooks/useHistory';
import type { HistoryStackParamList } from '@/navigation/HistoryStackNavigator';
import { capitalizeFirstLetter } from '@/utils/utils';
import { TILES } from '@assets/images/tiles';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Image, Pressable, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type HandDetailRouteProp = RouteProp<HistoryStackParamList, 'HandDetail'>;
type NavigationProp = NativeStackNavigationProp<HistoryStackParamList>;

export default function HandDetailScreen() {
  const route = useRoute<HandDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { handId } = route.params;
  const { getItem, removeItem } = useHistory();

  const item = getItem(handId);

  const handleDelete = () => {
    Alert.alert(
      'Delete Calculation',
      'Are you sure you want to remove this from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeItem(handId);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    if (!item) return;
    // Navigate to root tab and then to Calculator with tiles
    // Using a simple approach - reset to calculate stack
    navigation.getParent()?.navigate('Calculate', {
      screen: 'Calculator',
      params: {
        // We only have tiles, not the full hand options, so we recreate a basic hand
        initialHand: { closedPart: item.tiles, openPart: [] },
        historyId: handId
      }
    });
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Item not found</Text>
        </View>
      </View>
    );
  }

  const { result, tiles, timestamp } = item;
  const date = new Date(timestamp);

  // Transform yaku object to array for display
  // Robust method to handle potential data inconsistencies (array vs object)
  const yakuEntries: { name: string; han: string }[] = (() => {
    if (!result.yaku) return [];

    const entries = Object.entries(result.yaku);
    return entries
      .map(([key, value]) => {
        // If value is an object (legacy array item usually), extract han/name
        if (typeof value === 'object' && value !== null) {
          const valObj = value as any;
          return {
            name: capitalizeFirstLetter(valObj.yaku || valObj.name || key),
            han: String(valObj.han).replace(' han', '')
          };
        }

        // Standard object format: key is name, value is han string
        return {
          name: capitalizeFirstLetter(key),
          han: String(value).replace(' han', '')
        };
      })
      .filter(e => e.name !== 'undefined');
  })();

  // Safe access for points (support old data)
  const points = result.ten ?? (result as any).totalPoints ?? 0;

  // Attempt to get limit name if available (using 'name' property from riichi-ts result if it exists, or 'text')
  // Also support legacy 'limitName'
  // @ts-ignore
  const limitName =
    (result as any).limitName ||
    result.name ||
    (result.text && result.text.length < 20 ? result.text : null);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Score Header */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.pointsLabel}>Total Points</Text>
            <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
            {limitName && (
              <View style={styles.limitBadge}>
                <Text style={styles.limitText}>{limitName}</Text>
              </View>
            )}
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
            {/* Win Type (Ron/Tsumo) info is not currently stored in history item result */}
          </View>
        </View>

        {/* Date */}
        <Text style={styles.dateText}>
          {date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>

        {/* Hand Tiles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hand</Text>
          <View style={styles.tilesContainer}>
            {tiles.map((tileId, index) => (
              <View key={`${tileId}-${index}`} style={styles.tileWrapper}>
                <Image source={TILES[tileId]} style={styles.tile} />
              </View>
            ))}
          </View>
        </View>

        {/* Yaku List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yaku</Text>
          {yakuEntries.map(({ name, han }, index) => (
            <View key={name + index} style={styles.yakuCard}>
              <View style={styles.yakuInfo}>
                <Text style={styles.yakuName}>{name}</Text>
              </View>
              <View style={styles.yakuHanBadge}>
                <Text style={styles.yakuHanValue}>{han}</Text>
                <Text style={styles.yakuHanLabel}>han</Text>
              </View>
            </View>
          ))}
          {yakuEntries.length === 0 && (
            <View style={styles.emptyYakuContainer}>
              <Text style={styles.emptyYakuText}>No Yaku recorded</Text>
            </View>
          )}
        </View>

        {/* Payment Breakdown - Not available in current Result type */}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.deleteButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit Hand</Text>
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
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: theme.spacing.base,
    gap: theme.spacing.base
  },
  scoreCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: theme.spacing.lg,
    alignItems: 'center'
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.base,
    backgroundColor: 'transparent'
  },
  pointsLabel: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4
  },
  pointsValue: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  limitBadge: {
    marginTop: theme.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12
  },
  limitText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
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
  dateText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  },
  section: {
    gap: theme.spacing.sm,
    backgroundColor: 'transparent'
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    padding: theme.spacing.sm
  },
  tileWrapper: {
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  tile: {
    width: 32,
    height: 44,
    resizeMode: 'contain'
  },
  yakuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.sm,
    borderRadius: 12
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
    paddingVertical: 4,
    borderRadius: 8
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
  paymentCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: 'transparent'
  },
  paymentLabel: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary
  },
  paymentValue: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    color: theme.colors.text
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: theme.spacing.base,
    paddingBottom: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  deleteButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: '#FF3B30'
  },
  buttonPressed: {
    opacity: 0.8
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  }
}));
