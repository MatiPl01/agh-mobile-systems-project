import { Text, View } from '@/components';
import { yakuList } from '@/data/yaku';
import type { YakuStackParamList } from '@/navigation/YakuStackNavigator';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<YakuStackParamList>;

export default function YakuListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useUnistyles();
  const styles = stylesheet;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  return (
    <View style={styles.container}>
      <Text type='title' style={styles.title}>
        Yaku Reference
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder='Search yaku...'
        placeholderTextColor={theme.colors.textSecondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

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

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {filteredYaku.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No yaku found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filter
            </Text>
          </View>
        ) : (
          filteredYaku.map(yaku => (
            <Pressable
              key={yaku.id}
              style={({ pressed }) => [
                styles.yakuItem,
                yaku.type === 'yakuman' && styles.yakuItemYakuman,
                pressed && styles.yakuItemPressed
              ]}
              onPress={() =>
                navigation.navigate('YakuDetail', { yakuId: yaku.id })
              }>
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
          ))
        )}
      </ScrollView>
    </View>
  );
}

const stylesheet = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.base
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.base
  },
  searchInput: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.base,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  categoryScroll: {
    marginBottom: theme.spacing.base,
    maxHeight: 50
  },
  categoryContainer: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.base
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border
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
  list: {
    flex: 1
  },
  listContent: {
    gap: theme.spacing.base
  },
  yakuItem: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm
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
    alignItems: 'flex-start',
    gap: theme.spacing.sm
  },
  yakuItemTitle: {
    flex: 1,
    gap: theme.spacing.xs
  },
  yakuName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.text
  },
  yakuNameJp: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  },
  hanBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.base,
    minWidth: 60,
    alignItems: 'center'
  },
  hanBadgeYakuman: {
    backgroundColor: theme.colors.warning
  },
  hanText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  hanTextYakuman: {
    fontSize: theme.typography.sizes.xs
  },
  yakuDescription: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.base
  },
  yakuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.spacing.xs
  },
  yakuCategory: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
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
