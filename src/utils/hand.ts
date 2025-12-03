import type { TileId } from '@assets/images/tiles';
import type { TileCount } from '@/types/hand';

export const MAX_TILES_PER_TYPE = 4;
export const HAND_SIZE = 14;

export function getTileCounts(tiles: TileId[]): TileCount {
  const counts: TileCount = {} as TileCount;
  tiles.forEach(tile => {
    counts[tile] = (counts[tile] || 0) + 1;
  });
  return counts;
}

export function canAddTile(tiles: TileId[], tileId: TileId): boolean {
  if (tiles.length >= HAND_SIZE) return false;
  
  const counts = getTileCounts(tiles);
  return (counts[tileId] || 0) < MAX_TILES_PER_TYPE;
}

export function addTile(tiles: TileId[], tileId: TileId): TileId[] {
  if (!canAddTile(tiles, tileId)) return tiles;
  return [...tiles, tileId];
}

export function removeTile(tiles: TileId[], index: number): TileId[] {
  return tiles.filter((_, i) => i !== index);
}

export function getTilesRemaining(tiles: TileId[]): number {
  return HAND_SIZE - tiles.length;
}

