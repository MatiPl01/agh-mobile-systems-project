import { Text } from '@/components';
import type { Rarity } from '@/data/yaku';
import { getRarityColor, getRarityColorWithAlpha } from '@/utils/rarity';
import React from 'react';
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type FilterChipProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
  rarity?: Rarity;
};

export default function FilterChip({
  label,
  isActive,
  onPress,
  rarity
}: FilterChipProps) {
  const styles = stylesheet;

  const getActiveStyle = () => {
    if (rarity && isActive) {
      return {
        backgroundColor: getRarityColorWithAlpha(rarity),
        borderColor: getRarityColor(rarity)
      };
    }
    if (isActive) {
      return styles.chipActive;
    }
    return null;
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, getActiveStyle()]}>
      <Text
        style={[
          styles.text,
          isActive && styles.textActive
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const stylesheet = StyleSheet.create(theme => ({
  chip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  chipActive: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary
  },
  text: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    fontWeight: '500'
  },
  textActive: {
    color: theme.colors.text,
    fontWeight: '600'
  }
}));

