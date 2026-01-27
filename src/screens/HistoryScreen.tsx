import { Text, View } from '@/components';
import { useHistory, type HistoryItem } from '@/hooks/useHistory';
import type { HistoryStackParamList } from '@/navigation/HistoryStackNavigator';
import type { TileId } from '@/types/hand';
import { TILES } from '@assets/images/tiles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Image, Pressable, ScrollView } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
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

function getAllTiles(item: HistoryItem): TileId[] {
  const closedTiles = item.hand.closedPart;
  const openTiles = item.hand.openPart.flatMap(meld => meld.tiles);
  return [...closedTiles, ...openTiles];
}

function HistoryItemCard({
  item,
  onPress,
  onDelete
}: {
  item: HistoryItem;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const tiles = getAllTiles(item);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(item.id)}>
      <View style={styles.cardHeader}>
        <View style={styles.scoreInfo}>
          <Text style={styles.pointsValue}>
            {item.result.ten.toLocaleString()}
          </Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
        <View style={styles.hanFuInfo}>
          {item.result.yakuman ? (
            <Text style={styles.hanFuText}>{item.result.yakuman} Yakuman</Text>
          ) : (
            <Text style={styles.hanFuText}>
              {item.result.han} Han / {item.result.fu} Fu
            </Text>
          )}
          <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
        </View>
        <Pressable
          onPress={() => onDelete(item.id)}
          hitSlop={10}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed
          ]}>
          <Icon name='delete-outline' size={20} style={styles.deleteIcon} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tilesContainer}>
        {tiles.map((tileId, index) => (
          <View key={`${tileId}-${index}`} style={styles.tileWrapper}>
            <Image source={TILES[tileId]} style={styles.tile} />
          </View>
        ))}
      </ScrollView>
    </Pressable>
  );
}

export default function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { items, removeItem } = useHistory();

  const handleItemPress = (id: string) => {
    navigation.navigate('HistoryDetail', { handId: id });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Hand',
      'Are you sure you want to remove this from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeItem(id) }
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📜</Text>
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Your hands history will appear here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => (
          <HistoryItemCard
            item={item}
            onPress={handleItemPress}
            onDelete={handleDelete}
          />
        )}
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
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  cardPressed: {
    opacity: 0.7
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: 'transparent'
  },
  scoreInfo: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    minWidth: 80
  },
  pointsValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  pointsLabel: {
    fontSize: theme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 12
  },
  hanFuInfo: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  hanFuText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    color: theme.colors.text
  },
  dateText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    lineHeight: 20
  },
  deleteButton: {
    padding: 6,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.error + '20'
  },
  deleteButtonPressed: {
    opacity: 0.7
  },
  deleteIcon: {
    color: theme.colors.error
  },
  tilesContainer: {
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
    flexDirection: 'row'
  },
  tileWrapper: {
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#F9F9F9'
  },
  tile: {
    width: 24,
    height: 32,
    resizeMode: 'contain'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.base
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  }
}));
