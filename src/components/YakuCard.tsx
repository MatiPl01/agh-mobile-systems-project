import { Text, View } from '@/components';
import type { Yaku } from '@/data/yaku';
import { getRarityColor } from '@/utils/rarity';
import { TILES } from '@assets/images/tiles';
import React from 'react';
import { Image, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import HanBadge from './HanBadge';
import RarityBadge from './RarityBadge';

type YakuCardProps = {
  yaku: Yaku;
  onPress: (yakuId: string) => void;
};

export default function YakuCard({ yaku, onPress }: YakuCardProps) {
  const getRarityBorderStyle = (rarity?: string) => {
    if (!rarity) return null;
    const color = getRarityColor(rarity as any);
    return { borderLeftWidth: 4, borderLeftColor: color };
  };

  return (
    <View style={styles.cardShadow}>
      <Pressable
        onPress={() => onPress(yaku.id)}
        style={({ pressed }) => [
          styles.card,
          yaku.rarity && getRarityBorderStyle(yaku.rarity),
          pressed && styles.cardPressed
        ]}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Text type='subtitle' style={styles.cardTitle}>
                {yaku.name}
              </Text>
              <Text style={styles.cardNameJp}>{yaku.nameJp}</Text>
            </View>
            <HanBadge yaku={yaku} />
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {yaku.description}
          </Text>
          {yaku.exampleTiles && yaku.exampleTiles.length > 0 && (
            <View style={styles.tilesContainer}>
              {yaku.exampleTiles.map((tileId, index) => (
                <View key={`${tileId}-${index}`} style={styles.tileWrapper}>
                  <Image source={TILES[tileId]} style={styles.tileImage} />
                </View>
              ))}
            </View>
          )}
          {yaku.rarity && <RarityBadge rarity={yaku.rarity} />}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  cardShadow: {
    borderRadius: theme.borderRadius.base,
    marginBottom: theme.spacing.base,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  card: {
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.backgroundSecondary,
    overflow: 'hidden'
  },
  cardPressed: {
    opacity: 0.7
  },
  cardContent: {
    padding: theme.spacing.base,
    gap: theme.spacing.sm
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
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
  tileWrapper: {
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#F9F9F9'
  },
  tileImage: {
    width: 24,
    height: 32,
    resizeMode: 'contain'
  }
}));
