import type { Rarity, Yaku, YakuType } from '@/data/yaku';
import { yakuList } from '@/data/yaku';
import Fuse from 'fuse.js';

export type FilterState = {
  rarity: Rarity | null;
  type: YakuType | 'special' | null;
  category: string | null;
};

// Configure Fuse.js for fuzzy search
export function createYakuFuse() {
  if (!yakuList || !Array.isArray(yakuList) || yakuList.length === 0) {
    return null;
  }

  return new Fuse(yakuList, {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'nameEn', weight: 0.3 },
      { name: 'nameJp', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'category', weight: 0.1 },
      { name: 'rarity', weight: 0.15 }
    ],
    threshold: 0.3, // Lower = more strict matching
    includeScore: true,
    minMatchCharLength: 1
  });
}

export function filterYakuList(
  searchQuery: string,
  filters: FilterState,
  fuse: Fuse<Yaku> | null
): Yaku[] {
  if (!yakuList || !Array.isArray(yakuList) || yakuList.length === 0) {
    return [];
  }

  let filtered = yakuList;

  // Apply text search
  if (searchQuery.trim() && fuse) {
    const results = fuse.search(searchQuery);
    filtered = results.map(result => result.item);
  }

  // Apply filters
  if (filters.rarity) {
    filtered = filtered.filter(y => y.rarity === filters.rarity);
  }

  if (filters.type) {
    filtered = filtered.filter(y => y.type === filters.type);
  }

  if (filters.category) {
    filtered = filtered.filter(y => y.category === filters.category);
  }

  return filtered;
}

export function getAllCategories(): string[] {
  if (!yakuList || !Array.isArray(yakuList)) return [];
  return Array.from(new Set(yakuList.map(y => y.category))).sort();
}
