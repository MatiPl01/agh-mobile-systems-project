/**
 * Yaku data types and utilities
 *
 * Data source: The yaku data is stored in yaku.json for easier maintenance.
 * Data is based on Wikipedia and verified against:
 * - Riichi Mahjong Wiki (riichi.wiki)
 * - European Mahjong Association (EMA) official rules
 * - Japanese Mahjong League (JML) rules
 * - Official rulebooks (e.g., "Riichi Mahjong" by Daina Chiba)
 *
 * The yaku list includes:
 * - All standard yaku with descriptions matching Wikipedia data
 * - Rarity information (Frequent, Unusual, Rare, Very Rare, Ultra Rare)
 * - Open/closed hand applicability with separate han values (hanClosed, hanOpen)
 * - 40 total entries: 26 regular yaku + 13 yakuman + 1 special (nagashi mangan)
 */

import yakuData from './yaku.json';

export type YakuType = 'regular' | 'yakuman';
export type Rarity =
  | 'Frequent'
  | 'Unusual'
  | 'Rare'
  | 'Very Rare'
  | 'Ultra Rare';
export type OpenHand = 'closed' | 'open' | 'both';

import type { TileId } from '@assets/images/tiles';

export interface Yaku {
  id: string;
  name: string;
  nameEn: string;
  nameJp: string;
  han: number | 'yakuman' | null;
  hanClosed?: number | null;
  hanOpen?: number | null;
  type: YakuType | 'special';
  description: string;
  conditions: string[];
  notes?: string;
  category: string;
  rarity?: Rarity;
  openHand?: OpenHand;
  exampleTiles?: TileId[];
}

export const yakuList: Yaku[] = yakuData as Yaku[];

export function getYakuById(id: string): Yaku | undefined {
  return yakuList.find(y => y.id === id);
}
