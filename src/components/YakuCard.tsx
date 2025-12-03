import { Text, View } from '@/components';
import type { Yaku } from '@/data/yaku';
import { TILES } from '@assets/images/tiles';
import { getRarityColor } from '@/utils/rarity';
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
  const styles = stylesheet;

  const getRarityBorderStyle = (rarity?: string) => {
    if (!rarity) return null;
    const color = getRarityColor(rarity as any);
    return { borderLeftWidth: 4, borderLeftColor: color };
  };

  return (
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
            {yaku.exampleTiles.map((tileId, index) => {
              const tileImage = TILES[tileId];
              if (!tileImage) return null;
              return (
                <Image
                  key={`${yaku.id}-${tileId}-${index}`}
                  source={tileImage}
                  style={styles.tileImage}
                  resizeMode='contain'
                />
              );
            })}
          </View>
        )}
        {yaku.rarity && <RarityBadge rarity={yaku.rarity} />}
      </View>
    </Pressable>
  );
}

const stylesheet = StyleSheet.create(theme => ({
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
  }
}));
