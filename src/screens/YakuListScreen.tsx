import { Text, View } from '@/components';
import type { Yaku } from '@/data/yaku';
import { yakuList } from '@/data/yaku';
import type { YakuStackParamList } from '@/navigation/YakuStackNavigator';
import { TILES } from '@assets/images/tiles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Image, Pressable, SectionList } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type NavigationProp = NativeStackNavigationProp<YakuStackParamList>;

type YakuSection = {
  title: string;
  data: Yaku[];
};

export default function YakuListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const styles = stylesheet;

  const sections = useMemo(() => {
    if (!yakuList || !Array.isArray(yakuList) || yakuList.length === 0) {
      return [];
    }

    const categories = Array.from(
      new Set(yakuList.map(y => y.category))
    ).sort();

    return categories.map(category => ({
      title: category,
      data: yakuList
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
  }, []);

  const handleYakuPress = (yakuId: string) => {
    navigation.navigate('YakuDetail', { yakuId });
  };

  const renderYakuCard = ({ item }: { item: Yaku }) => {
    const hanDisplay =
      item.han === 'yakuman'
        ? '役満'
        : item.han === null
        ? '—'
        : `${item.han} han`;

    // Get rarity-based color
    const getRarityColor = (rarity?: string) => {
      switch (rarity) {
        case 'Frequent':
          return styles.cardRarityFrequent;
        case 'Unusual':
          return styles.cardRarityUnusual;
        case 'Rare':
          return styles.cardRarityRare;
        case 'Very Rare':
          return styles.cardRarityVeryRare;
        case 'Ultra Rare':
          return styles.cardRarityUltraRare;
        default:
          return null;
      }
    };

    return (
      <Pressable
        onPress={() => handleYakuPress(item.id)}
        style={({ pressed }) => [
          styles.card,
          item.rarity && getRarityColor(item.rarity),
          pressed && styles.cardPressed
        ]}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Text type='subtitle' style={styles.cardTitle}>
                {item.name}
              </Text>
              <Text style={styles.cardNameJp}>{item.nameJp}</Text>
            </View>
            <View
              style={[
                styles.hanBadge,
                item.type === 'yakuman' && styles.hanBadgeYakuman
              ]}>
              <Text
                style={[
                  styles.hanText,
                  item.type === 'yakuman' && styles.hanTextYakuman
                ]}>
                {hanDisplay}
              </Text>
            </View>
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          {item.exampleTiles && item.exampleTiles.length > 0 && (
            <View style={styles.tilesContainer}>
              {item.exampleTiles.map((tileId, index) => {
                const tileImage = TILES[tileId];
                if (!tileImage) return null;
                return (
                  <Image
                    key={`${item.id}-${tileId}-${index}`}
                    source={tileImage}
                    style={styles.tileImage}
                    resizeMode='contain'
                  />
                );
              })}
            </View>
          )}
          {item.rarity && (
            <View
              style={[
                styles.rarityBadge,
                item.rarity === 'Frequent' && styles.rarityBadgeFrequent,
                item.rarity === 'Unusual' && styles.rarityBadgeUnusual,
                item.rarity === 'Rare' && styles.rarityBadgeRare,
                item.rarity === 'Very Rare' && styles.rarityBadgeVeryRare,
                item.rarity === 'Ultra Rare' && styles.rarityBadgeUltraRare
              ]}>
              <Text style={styles.rarityText}>{item.rarity}</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const renderSectionHeader = ({ section }: { section: YakuSection }) => (
    <View style={styles.sectionHeader}>
      <Text type='subtitle' style={styles.sectionTitle}>
        {section.title}
      </Text>
      <Text style={styles.sectionCount}>{section.data.length} yaku</Text>
    </View>
  );

  if (sections.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text type='title' style={styles.emptyTitle}>
            No Yaku Data
          </Text>
          <Text style={styles.emptyText}>
            Unable to load yaku data. Please try restarting the app.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderYakuCard}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item: Yaku) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const stylesheet = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  listContent: {
    padding: theme.spacing.base
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm
  },
  sectionTitle: {
    color: theme.colors.text
  },
  sectionCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  },
  card: {
    marginBottom: theme.spacing.base,
    borderRadius: theme.borderRadius.lg || 12,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden'
  },
  cardRarityFrequent: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759' // Green for frequent
  },
  cardRarityUnusual: {
    borderLeftWidth: 4,
    borderLeftColor: '#0A84FF' // Blue for unusual
  },
  cardRarityRare: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500' // Orange for rare
  },
  cardRarityVeryRare: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30' // Red for very rare
  },
  cardRarityUltraRare: {
    borderLeftWidth: 4,
    borderLeftColor: '#AF52DE' // Purple for ultra rare
  },
  cardPressed: {
    opacity: 0.7
  },
  cardContent: {
    padding: theme.spacing.base
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm
  },
  cardTitle: {
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  },
  cardNameJp: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary
  },
  hanBadge: {
    backgroundColor: '#6366F1', // Indigo for regular han
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999, // Fully rounded
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hanBadgeYakuman: {
    backgroundColor: '#DC2626', // Red for yakuman
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999, // Fully rounded
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hanText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.medium,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5
  },
  hanTextYakuman: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.medium,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5
  },
  cardDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeights.sm,
    marginBottom: theme.spacing.xs
  },
  tilesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.xs
  },
  tileImage: {
    width: 24,
    height: 32,
    marginRight: theme.spacing.xs / 2
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: 999, // Fully rounded
    backgroundColor: '#6366F1' // Same indigo as han badge for consistency
  },
  rarityBadgeFrequent: {
    backgroundColor: '#34C759' // Green
  },
  rarityBadgeUnusual: {
    backgroundColor: '#0A84FF' // Blue
  },
  rarityBadgeRare: {
    backgroundColor: '#FF9500' // Orange
  },
  rarityBadgeVeryRare: {
    backgroundColor: '#FF3B30' // Red
  },
  rarityBadgeUltraRare: {
    backgroundColor: '#AF52DE' // Purple
  },
  rarityText: {
    fontSize: theme.typography.sizes.xs,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.3
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
