import { Text, View } from '@/components';
import type { Rarity, YakuType } from '@/data/yaku';
import type { FilterState } from '@/utils/yakuSearch';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import FilterChip from './FilterChip';

type YakuFiltersProps = {
  filters: FilterState;
  categories: string[];
  onRarityToggle: (rarity: Rarity) => void;
  onTypeToggle: (type: YakuType | 'special') => void;
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
};

export default function YakuFilters({
  filters,
  categories,
  onRarityToggle,
  onTypeToggle,
  onCategoryToggle,
  onClearAll
}: YakuFiltersProps) {
  const hasActiveFilters = filters.rarity || filters.type || filters.category;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Rarity Filters */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupLabel}>Rarity:</Text>
          {(
            [
              'Frequent',
              'Unusual',
              'Rare',
              'Very Rare',
              'Ultra Rare'
            ] as Rarity[]
          ).map(rarity => (
            <FilterChip
              key={rarity}
              label={rarity}
              isActive={filters.rarity === rarity}
              onPress={() => onRarityToggle(rarity)}
              rarity={rarity}
            />
          ))}
        </View>

        {/* Type Filters */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupLabel}>Type:</Text>
          {(['regular', 'yakuman', 'special'] as const).map(type => (
            <FilterChip
              key={type}
              label={
                type === 'yakuman'
                  ? 'Yakuman'
                  : type === 'regular'
                  ? 'Regular'
                  : 'Special'
              }
              isActive={filters.type === type}
              onPress={() => onTypeToggle(type)}
            />
          ))}
        </View>

        {/* Category Filters */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupLabel}>Category:</Text>
          {categories.map(category => (
            <FilterChip
              key={category}
              label={category}
              isActive={filters.category === category}
              onPress={() => onCategoryToggle(category)}
            />
          ))}
        </View>

        {hasActiveFilters && (
          <Pressable onPress={onClearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.sm
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.base,
    gap: theme.spacing.sm,
    alignItems: 'center'
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginRight: theme.spacing.sm
  },
  filterGroupLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginRight: theme.spacing.xs
  },
  clearButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: 16,
    backgroundColor: theme.colors.warning + '20',
    borderWidth: 1,
    borderColor: theme.colors.warning,
    marginLeft: theme.spacing.xs
  },
  clearText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.warning,
    fontWeight: '600'
  }
}));
