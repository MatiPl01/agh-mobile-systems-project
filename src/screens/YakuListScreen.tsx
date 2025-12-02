import { Text, View } from '@/components';
import type { Yaku } from '@/data/yaku';
import { yakuList } from '@/data/yaku';
import type { YakuStackParamList } from '@/navigation/YakuStackNavigator';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, TextInput } from 'react-native';
import Animated, {
  clamp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Yaku>);

type NavigationProp = NativeStackNavigationProp<YakuStackParamList>;

const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 80;
const HEADER_DELTA = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const SNAP_THRESHOLD = HEADER_DELTA / 2;

export default function YakuListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useUnistyles();
  const styles = stylesheet;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(HEADER_MAX_HEIGHT);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(yakuList.map(y => y.category)));
    return cats.sort();
  }, []);

  const filteredYaku = useMemo(() => {
    let filtered = yakuList;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        y =>
          y.name.toLowerCase().includes(query) ||
          y.nameEn.toLowerCase().includes(query) ||
          y.nameJp.includes(query) ||
          y.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(y => y.category === selectedCategory);
    }

    return filtered.sort((a, b) => {
      if (a.type === 'yakuman' && b.type !== 'yakuman') return -1;
      if (a.type !== 'yakuman' && b.type === 'yakuman') return 1;
      if (typeof a.han === 'number' && typeof b.han === 'number') {
        return b.han - a.han;
      }
      if (a.han === 'yakuman' && b.han === 'yakuman') return 0;
      return 0;
    });
  }, [searchQuery, selectedCategory]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const offsetY = event.contentOffset.y;
      scrollY.value = offsetY;

      const clampedScroll = clamp(offsetY, 0, HEADER_DELTA);
      const newHeight = HEADER_MAX_HEIGHT - clampedScroll;
      headerHeight.value = clamp(
        newHeight,
        HEADER_MIN_HEIGHT,
        HEADER_MAX_HEIGHT
      );
    },
    onEndDrag: event => {
      const offsetY = event.contentOffset.y;
      const clampedOffset = clamp(offsetY, 0, HEADER_DELTA);
      const currentHeight = HEADER_MAX_HEIGHT - clampedOffset;

      const shouldCollapse = currentHeight < HEADER_MAX_HEIGHT - SNAP_THRESHOLD;
      headerHeight.value = withSpring(
        shouldCollapse ? HEADER_MIN_HEIGHT : HEADER_MAX_HEIGHT,
        {
          damping: 20,
          stiffness: 90
        }
      );
    }
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
      opacity: 1
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const scale = headerHeight.value / HEADER_MAX_HEIGHT;
    return {
      transform: [{ scale: Math.max(0.7, scale) }]
    };
  });

  const searchAnimatedStyle = useAnimatedStyle(() => {
    const progress = (headerHeight.value - HEADER_MIN_HEIGHT) / HEADER_DELTA;
    const isCollapsed = progress < 0.3;
    return {
      opacity: isCollapsed ? 0 : progress,
      height: isCollapsed ? 0 : undefined,
      marginBottom: isCollapsed ? 0 : undefined,
      overflow: 'hidden',
      pointerEvents: isCollapsed ? 'none' : 'auto'
    };
  });

  const renderYakuItem = ({ item: yaku }: { item: Yaku }) => (
    <Pressable
      style={({ pressed }) => [
        styles.yakuItem,
        yaku.type === 'yakuman' && styles.yakuItemYakuman,
        pressed && styles.yakuItemPressed
      ]}
      onPress={() => navigation.navigate('YakuDetail', { yakuId: yaku.id })}>
      <View style={styles.yakuItemHeader}>
        <View style={styles.yakuItemTitle}>
          <Text style={styles.yakuName}>{yaku.name}</Text>
          <Text style={styles.yakuNameJp}>{yaku.nameJp}</Text>
        </View>
        <View
          style={[
            styles.hanBadge,
            yaku.type === 'yakuman' && styles.hanBadgeYakuman
          ]}>
          <Text
            style={[
              styles.hanText,
              yaku.type === 'yakuman' && styles.hanTextYakuman
            ]}>
            {yaku.han === 'yakuman' ? '役満' : `${yaku.han} han`}
          </Text>
        </View>
      </View>
      <Text style={styles.yakuDescription} numberOfLines={2}>
        {yaku.description}
      </Text>
      <View style={styles.yakuItemFooter}>
        <Text style={styles.yakuCategory}>{yaku.category}</Text>
      </View>
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No yaku found</Text>
      <Text style={styles.emptyStateSubtext}>
        Try adjusting your search or filter
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Animated.View style={titleAnimatedStyle}>
          <Text type='title' style={styles.title}>
            Yaku Reference
          </Text>
        </Animated.View>

        <Animated.View style={searchAnimatedStyle}>
          <TextInput
            style={styles.searchInput}
            placeholder='Search yaku...'
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Animated.View>
      </Animated.View>

      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}>
          <Pressable
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(null)}>
            <Text
              style={[
                styles.categoryChipText,
                !selectedCategory && styles.categoryChipTextActive
              ]}>
              All
            </Text>
          </Pressable>
          {categories.map(category => (
            <Pressable
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }>
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive
                ]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <AnimatedFlatList
        data={filteredYaku}
        renderItem={renderYakuItem}
        keyExtractor={(item: Yaku) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={true}
        alwaysBounceVertical={true}
      />
    </View>
  );
}

const stylesheet = StyleSheet.create(theme => ({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.sm,
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    overflow: 'hidden'
  },
  title: {
    textAlign: 'center',
    fontSize: theme.typography.sizes['2xl']
  },
  searchInput: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  categoryWrapper: {
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.sm
  },
  categoryScroll: {
    maxHeight: 50
  },
  categoryContainer: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    paddingRight: theme.spacing.base
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  categoryChipText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text,
    fontWeight: '500'
  },
  categoryChipTextActive: {
    color: '#FFFFFF'
  },
  listContent: {
    gap: theme.spacing.sm,
    padding: theme.spacing.base,
    paddingBottom: theme.spacing['2xl']
  },
  yakuItem: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 70,
    justifyContent: 'center',
    marginBottom: theme.spacing.sm
  },
  yakuItemYakuman: {
    backgroundColor: theme.colors.warning + '15',
    borderColor: theme.colors.warning,
    borderWidth: 2
  },
  yakuItemPressed: {
    opacity: 0.7
  },
  yakuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs
  },
  yakuItemTitle: {
    flex: 1,
    gap: theme.spacing.xs / 2
  },
  yakuName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.text
  },
  yakuNameJp: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary
  },
  hanBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.base,
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hanBadgeYakuman: {
    backgroundColor: theme.colors.warning
  },
  hanText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  hanTextYakuman: {
    fontSize: theme.typography.sizes.xs
  },
  yakuDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.sm,
    marginBottom: theme.spacing.xs
  },
  yakuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  yakuCategory: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm
  },
  emptyState: {
    padding: theme.spacing['3xl'],
    alignItems: 'center',
    gap: theme.spacing.sm
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.text
  },
  emptyStateSubtext: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary
  }
}));
