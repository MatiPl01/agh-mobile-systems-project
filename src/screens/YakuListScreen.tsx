import { Text, View, YakuCard, YakuFilters } from '@/components';
import type { Rarity, Yaku, YakuType } from '@/data/yaku';
import type { YakuStackParamList } from '@/navigation/YakuStackNavigator';
import {
  createYakuFuse,
  filterYakuList,
  getAllCategories,
  type FilterState
} from '@/utils/yakuSearch';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { SectionList } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<YakuStackParamList>;

type YakuSection = {
  title: string;
  data: Yaku[];
};

export default function YakuListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    rarity: null,
    type: null,
    category: null
  });

  const allCategories = useMemo(() => getAllCategories(), []);
  const fuse = useMemo(() => createYakuFuse(), []);

  const filteredYakuList = useMemo(
    () => filterYakuList(searchQuery, filters, fuse),
    [searchQuery, filters, fuse]
  );

  const sections = useMemo(() => {
    if (!filteredYakuList || filteredYakuList.length === 0) {
      return [];
    }

    const categories = Array.from(
      new Set(filteredYakuList.map(y => y.category))
    ).sort();

    return categories.map(category => ({
      title: category,
      data: filteredYakuList
        .filter(y => y.category === category)
        .sort((a, b) => {
          // Sort yakuman first, then by han value
          if (a.type === 'yakuman' && b.type !== 'yakuman') return -1;
          if (a.type !== 'yakuman' && b.type === 'yakuman') return 1;
          if (typeof a.han === 'number' && typeof b.han === 'number') {
            return b.han - a.han;
          }
          return 0;
        })
    })) as YakuSection[];
  }, [filteredYakuList]);

  const handleYakuPress = (yakuId: string) => {
    navigation.navigate('YakuDetail', { yakuId });
  };

  const toggleRarityFilter = (rarity: Rarity) => {
    setFilters(prev => ({
      ...prev,
      rarity: prev.rarity === rarity ? null : rarity
    }));
  };

  const toggleTypeFilter = (type: YakuType | 'special') => {
    setFilters(prev => ({
      ...prev,
      type: prev.type === type ? null : type
    }));
  };

  const toggleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? null : category
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      rarity: null,
      type: null,
      category: null
    });
  };

  // Update header search bar when search query changes
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search yaku...',
        hideWhenScrolling: false,
        onChangeText: (event: { nativeEvent: { text: string } }) => {
          setSearchQuery(event.nativeEvent.text);
        },
        onCancelButtonPress: () => {
          setSearchQuery('');
        },
        onSearchButtonPress: (event: { nativeEvent: { text: string } }) => {
          setSearchQuery(event.nativeEvent.text);
        }
      }
    });
  }, [navigation]);

  if (sections.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text type='title' style={styles.emptyTitle}>
            {searchQuery.trim() ||
            filters.rarity ||
            filters.type ||
            filters.category
              ? 'No Results'
              : 'No Yaku Data'}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery.trim() ||
            filters.rarity ||
            filters.type ||
            filters.category
              ? `No yaku found matching your search criteria`
              : 'Unable to load yaku data. Please try restarting the app.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <YakuFilters
        filters={filters}
        categories={allCategories}
        onRarityToggle={toggleRarityFilter}
        onTypeToggle={toggleTypeFilter}
        onCategoryToggle={toggleCategoryFilter}
        onClearAll={clearAllFilters}
      />

      <SectionList
        sections={sections}
        renderItem={({ item }) => (
          <YakuCard yaku={item} onPress={handleYakuPress} />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text type='subtitle' style={styles.sectionTitle}>
              {section.title}
            </Text>
            <Text style={styles.sectionCount}>{section.data.length} yaku</Text>
          </View>
        )}
        keyExtractor={(item: Yaku) => item.id}
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior='automatic'
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
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
    paddingHorizontal: theme.spacing.base,
    paddingBottom: theme.spacing.base,
    paddingTop: theme.spacing.xs
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.xs
  },
  sectionTitle: {
    color: theme.colors.text
  },
  sectionCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl
  },
  emptyTitle: {
    marginBottom: theme.spacing.base,
    color: theme.colors.text
  },
  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontSize: theme.typography.sizes.base
  }
}));
