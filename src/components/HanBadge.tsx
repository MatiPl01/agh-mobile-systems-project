import { Text, View } from '@/components';
import type { Yaku } from '@/data/yaku';
import React from 'react';
import { StyleSheet } from 'react-native-unistyles';

type HanBadgeProps = {
  yaku: Yaku;
};

export default function HanBadge({ yaku }: HanBadgeProps) {
  const styles = stylesheet;
  const hanDisplay =
    yaku.han === 'yakuman'
      ? '役満'
      : yaku.han === null
      ? '—'
      : `${yaku.han} han`;

  return (
    <View
      style={[styles.badge, yaku.type === 'yakuman' && styles.badgeYakuman]}>
      <Text
        style={[styles.text, yaku.type === 'yakuman' && styles.textYakuman]}>
        {hanDisplay}
      </Text>
    </View>
  );
}

const stylesheet = StyleSheet.create(theme => ({
  badge: {
    backgroundColor: '#6366F1', // Indigo for regular han
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999, // Fully rounded
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeYakuman: {
    backgroundColor: '#DC2626' // Red for yakuman
  },
  text: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.medium,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5
  },
  textYakuman: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.medium,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5
  }
}));
