import { Text, View } from '@/components';
import { useHistory, type HistoryItem } from '@/hooks/useHistory';
import type { HistoryStackParamList } from '@/navigation/HistoryStackNavigator';
import { TILES } from '@assets/images/tiles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Image, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition
} from 'react-native-reanimated';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

type NavigationProp = NativeStackNavigationProp<HistoryStackParamList>;

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

const HistoryItemCard = React.memo(
  ({
    item,
    onPress,
    onDelete
  }: {
    item: HistoryItem;
    onPress: (id: string) => void;
    onDelete: (id: string) => void;
  }) => {
    const { theme } = useUnistyles();
    const gradId = `grad-${item.id}`;

    // Safe access for legacy data support
    const points = item.result.ten ?? (item.result as any).totalPoints ?? 0;

    return (
      <View>
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => onPress(item.id)}>
          <View style={styles.cardHeader}>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
              <Text style={styles.pointsLabel}>pts</Text>
            </View>
            <View style={styles.cardMeta}>
              <Text style={styles.cardHanFu}>
                {item.result.han} Han / {item.result.fu} Fu
              </Text>
              <Text style={styles.cardDate}>{formatDate(item.timestamp)}</Text>
            </View>
            <Pressable
              onPress={() => onDelete(item.id)}
              hitSlop={10}
              style={styles.deleteButton}>
              <Icon name='delete-outline' size={20} color='#FF3B30' />
            </Pressable>
          </View>

          <View style={styles.tilesContainer}>
            <View style={styles.tilesRow}>
              {item.tiles?.map((tileId, index) => (
                <View key={`${tileId}-${index}`} style={styles.tileWrapper}>
                  <Image source={TILES[tileId]} style={styles.tile} />
                </View>
              ))}
            </View>
            {/* Gradient Fade Overlay - Only on the right side */}
            <View style={styles.fadeOverlay} pointerEvents='none'>
              <Svg height='100%' width='60' style={styles.fadeSvg}>
                <Defs>
                  <LinearGradient id={gradId} x1='0' y1='0' x2='1' y2='0'>
                    <Stop
                      offset='0'
                      stopColor={theme.colors.backgroundSecondary}
                      stopOpacity='0'
                    />
                    <Stop
                      offset='1'
                      stopColor={theme.colors.backgroundSecondary}
                      stopOpacity='1'
                    />
                  </LinearGradient>
                </Defs>
                <Rect width='60' height='100%' fill={`url(#${gradId})`} />
              </Svg>
            </View>
          </View>
        </Pressable>
      </View>
    );
  }
);

export default function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { items, removeItem } = useHistory();

  const handleItemPress = React.useCallback(
    (id: string) => {
      navigation.navigate('HandDetail', { handId: id });
    },
    [navigation]
  );

  const handleDelete = React.useCallback(
    (id: string) => {
      Alert.alert('Delete', 'Remove this calculation from history?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeItem(id)
        }
      ]);
    },
    [removeItem]
  );

  const renderItem = React.useCallback(
    ({ item }: { item: HistoryItem }) => (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        layout={LinearTransition}>
        <HistoryItemCard
          item={item}
          onPress={handleItemPress}
          onDelete={handleDelete}
        />
      </Animated.View>
    ),
    [handleItemPress, handleDelete]
  );

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          {/* <Text style={styles.emptyEmoji}>📜</Text> */}
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Your calculation history will appear here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        itemLayoutAnimation={LinearTransition}
      />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  listContent: {
    padding: theme.spacing.base,
    gap: theme.spacing.sm
  },
  card: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 16,
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  cardPressed: {
    opacity: 0.8
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'transparent'
  },
  pointsBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 70
  },
  pointsValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  pointsLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  cardMeta: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  cardHanFu: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '700',
    color: theme.colors.text
  },
  cardDate: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2
  },
  limitBadge: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)'
  },
  tilesContainer: {
    position: 'relative',
    height: 44,
    overflow: 'hidden',
    backgroundColor: 'transparent'
  },
  tilesRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
    backgroundColor: 'transparent'
  },
  tileWrapper: {
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1
  },
  tile: {
    width: 28,
    height: 38,
    resizeMode: 'contain'
  },
  fadeOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  },
  fadeSvg: {
    backgroundColor: 'transparent'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  }
}));
