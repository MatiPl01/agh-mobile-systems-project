import type { Rarity } from '@/data/yaku';

export const RARITY_COLORS: Record<Rarity, string> = {
  Frequent: '#34C759', // Green
  Unusual: '#0A84FF', // Blue
  Rare: '#FF9500', // Orange
  'Very Rare': '#FF3B30', // Red
  'Ultra Rare': '#AF52DE' // Purple
};

export function getRarityColor(rarity: Rarity): string {
  return RARITY_COLORS[rarity];
}

export function getRarityColorWithAlpha(
  rarity: Rarity,
  alpha: string = '20'
): string {
  return RARITY_COLORS[rarity] + alpha;
}
