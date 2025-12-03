import type { TileId } from '@assets/images/tiles';

export type MeldType = 'sequence' | 'triplet' | 'quad' | 'pair';

export interface Meld {
  id: string;
  type: MeldType;
  tiles: TileId[]; // Tile types in the meld
  tileIndices: number[]; // Specific indices of tiles in the meld (for tracking which instances)
  isOpen: boolean; // Whether the meld was called (open) or concealed
}

export interface Hand {
  tiles: TileId[]; // Flat list of all tiles (up to 14)
  melds: Meld[]; // Organized melds (optional, can be auto-detected later)
  winningTile?: TileId; // The tile that completes the hand
  isOpen: boolean; // Whether hand has any open melds
}

export type TileCount = Record<TileId, number>;

