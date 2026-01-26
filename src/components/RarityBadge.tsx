import { Text, View } from '@/components';
import type { Rarity } from '@/data/yaku';
import { getRarityColor } from '@/utils/rarity';
import React from 'react';
import { StyleSheet } from 'react-native-unistyles';

type RarityBadgeProps = {
  rarity: Rarity;
  size?: 'small' | 'medium';
};

export default function RarityBadge({
  rarity,
  size = 'small'
}: RarityBadgeProps) {
  const backgroundColor = getRarityColor(rarity);

  return (
    <View
      style={[
        styles.badge,
        size === 'medium' && styles.badgeMedium,
        { backgroundColor },
        styles.badgeContainer
      ]}>
      <Text style={[styles.text, size === 'medium' && styles.textMedium]}>
        {rarity}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  badgeContainer: {
    alignSelf: 'flex-start'
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeMedium: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs
  },
  text: {
    fontSize: theme.typography.sizes.xs,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5
  },
  textMedium: {
    fontSize: theme.typography.sizes.sm
  }
}));
