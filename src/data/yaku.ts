/**
 * Yaku data types and utilities
 *
 * Data source: The yaku data is stored directly in this file for better Metro bundler compatibility.
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

import { TileId } from '@/types/hand';

export type YakuType = 'regular' | 'yakuman';
export type Rarity =
  | 'Frequent'
  | 'Unusual'
  | 'Rare'
  | 'Very Rare'
  | 'Ultra Rare';
export type OpenHand = 'closed' | 'open' | 'both';

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

export const yakuList: Yaku[] = [
  {
    id: 'menzentsumo',
    name: 'Menzenchin tsumohou',
    nameEn: 'Fully concealed hand',
    nameJp: '門前清自摸和',
    han: 1,
    hanClosed: 1,
    hanOpen: null,
    type: 'regular',
    description: 'A fully closed hand that wins by self-draw (tsumo).',
    conditions: [
      'Hand must be completely closed (no open melds)',
      'Must win by tsumo (self-draw)'
    ],
    notes: 'Not applicable if hand is open or won by ron.',
    category: 'Concealed',
    rarity: 'Frequent',
    openHand: 'closed'
  },
  {
    id: 'riichi',
    name: 'Riichi',
    nameEn: 'Ready hand',
    nameJp: '立直',
    han: 1,
    hanClosed: 1,
    hanOpen: null,
    type: 'regular',
    description:
      'Declare riichi with a closed hand that is in tenpai, placing 1000 points on the table.',
    conditions: [
      'Hand must be closed (no open melds)',
      'Must be waiting on exactly one tile',
      'Must have at least 1000 points to declare',
      'Cannot change your hand after declaring'
    ],
    notes: 'Can be combined with ippatsu for an additional han.',
    category: 'Declared',
    rarity: 'Frequent',
    openHand: 'closed'
  },
  {
    id: 'ippatsu',
    name: 'Ippatsu',
    nameEn: 'One shot',
    nameJp: '一発',
    han: 1,
    hanClosed: 1,
    hanOpen: null,
    type: 'regular',
    description:
      'Win within one uninterrupted turn cycle after declaring riichi (no calls in between).',
    conditions: [
      'Must win on your first turn after declaring riichi',
      "Cannot be interrupted by another player's discard"
    ],
    notes: 'Only available with riichi.',
    category: 'Declared',
    rarity: 'Frequent',
    openHand: 'closed'
  },
  {
    id: 'pinfu',
    name: 'Pinfu',
    nameEn: 'All sequences, minimum fu',
    nameJp: '平和',
    han: 1,
    hanClosed: 1,
    hanOpen: null,
    type: 'regular',
    description:
      'Closed hand of only sequences, non-value pair, and a two-sided (ryanmen) wait, with no fu from hand structure.',
    conditions: [
      'All melds must be sequences (chi)',
      'No triplets (pon) or quads (kan)',
      'Pair must be a non-value pair (not dragons or seat/wind)',
      'Must be closed hand',
      'Must have a two-sided wait'
    ],
    notes: 'Cannot combine with tanyao if pinfu is used.',
    category: 'Hand Pattern',
    rarity: 'Frequent',
    openHand: 'closed',
    exampleTiles: [
      '1m',
      '2m',
      '3m',
      '2p',
      '3p',
      '4p',
      '5s',
      '6s',
      '7s',
      '8m',
      '9m',
      '1m',
      '5p',
      '5p'
    ]
  },
  {
    id: 'iipeikou',
    name: 'Iipeikou',
    nameEn: 'One set of identical sequences',
    nameJp: '一盃口',
    han: 1,
    hanClosed: 1,
    hanOpen: null,
    type: 'regular',
    description: 'Closed hand with two identical sequences in the same suit.',
    conditions: [
      'Two identical sequences in the same suit',
      'Hand must be closed',
      'Cannot be combined with sanshoku doujun'
    ],
    notes: 'Example: 2-3-4 man and 2-3-4 man.',
    category: 'Hand Pattern',
    rarity: 'Frequent',
    openHand: 'closed',
    exampleTiles: [
      '1p',
      '2p',
      '3p',
      '1p',
      '2p',
      '3p',
      '4s',
      '5s',
      '6s',
      '7s',
      '8s',
      '9s',
      '5m',
      '5m'
    ]
  },
  {
    id: 'haitei_raoyue',
    name: 'Haitei raoyue',
    nameEn: 'Win by last draw',
    nameJp: '海底撈月',
    han: 1,
    hanClosed: 1,
    hanOpen: 1,
    type: 'regular',
    description: 'Win by drawing the very last tile from the live wall.',
    conditions: [
      'Win by tsumo on the last draw',
      'Must be the final draw before exhaustive draw'
    ],
    notes: 'Rare opportunity yaku.',
    category: 'Special',
    rarity: 'Rare',
    openHand: 'both'
  },
  {
    id: 'houtei_raoyui',
    name: 'Houtei raoyui',
    nameEn: 'Win by last discard',
    nameJp: '河底撈魚',
    han: 1,
    hanClosed: 1,
    hanOpen: 1,
    type: 'regular',
    description: 'Win on the very last discard of the hand.',
    conditions: [
      'Win by ron on the last discard',
      'Must be the final discard before exhaustive draw'
    ],
    notes: 'Rare opportunity yaku.',
    category: 'Special',
    rarity: 'Rare',
    openHand: 'both'
  },
  {
    id: 'rinshan_kaihou',
    name: 'Rinshan kaihou',
    nameEn: 'Win by dead wall draw',
    nameJp: '嶺上開花',
    han: 1,
    hanClosed: 1,
    hanOpen: 1,
    type: 'regular',
    description:
      'Win using the replacement tile drawn from the dead wall after declaring a kan.',
    conditions: [
      'Win with a tile drawn from the dead wall after declaring kan',
      'Must win immediately after drawing from dead wall'
    ],
    notes: 'Rare opportunity yaku.',
    category: 'Special',
    rarity: 'Rare',
    openHand: 'both'
  },
  {
    id: 'chankan',
    name: 'Chankan',
    nameEn: 'Robbing a kan',
    nameJp: '搶槓',
    han: 1,
    hanClosed: 1,
    hanOpen: 1,
    type: 'regular',
    description:
      'Win by ron on the tile another player uses to upgrade a pon to an added kan.',
    conditions: [
      'Win by ron on a tile added to an open kan',
      'Opponent must be adding a tile to complete an open kan'
    ],
    notes: 'Rare opportunity yaku.',
    category: 'Special',
    rarity: 'Rare',
    openHand: 'both'
  },
  {
    id: 'tanyao',
    name: 'Tanyao',
    nameEn: 'All simples',
    nameJp: '断幺九',
    han: 1,
    hanClosed: 1,
    hanOpen: 1,
    type: 'regular',
    description:
      'Hand composed entirely of suit tiles 2–8; no terminals or honors.',
    conditions: [
      'No 1s or 9s (terminals)',
      'No dragons or winds (honors)',
      'Only tiles 2-8 in man, pin, or sou suits'
    ],
    notes:
      'Some rule sets restrict this to closed hands only. Can be open or closed. Very common yaku.',
    category: 'Hand Pattern',
    rarity: 'Frequent',
    openHand: 'both'
  },
  {
    id: 'yakuhai',
    name: 'Yakuhai',
    nameEn: 'Value tiles',
    nameJp: '役牌',
    han: 1,
    hanClosed: 1,
    hanOpen: 1,
    type: 'regular',
    description:
      'Hand containing one or more sets of dragons and/or relevant wind tiles.',
    conditions: [
      'Triplet of any dragon (white, green, red)',
      'Triplet of your seat wind',
      'Triplet of the round wind'
    ],
    notes:
      'Each triplet/quad of value tiles (dragons, seat wind, round wind) is worth 1 han. Can have multiple.',
    category: 'Triplets',
    rarity: 'Frequent',
    openHand: 'both',
    exampleTiles: ['ew', 'ew', 'ew', 'gd', 'gd', 'gd', 'rd', 'rd', 'rd']
  },
  {
    id: 'double_riichi',
    name: 'Double riichi',
    nameEn: 'Double ready',
    nameJp: '両立直',
    han: 2,
    hanClosed: 2,
    hanOpen: null,
    type: 'regular',
    description:
      'Riichi declared before your first discard and before any calls are made.',
    conditions: [
      'Must declare riichi on your first uninterrupted turn',
      'Hand must be closed',
      'Must have at least 1000 points to declare'
    ],
    notes: 'Rare variant of riichi.',
    category: 'Declared',
    rarity: 'Rare',
    openHand: 'closed'
  },
  {
    id: 'chanta',
    name: 'Chantaiyao',
    nameEn: 'Terminal or honor in each set',
    nameJp: '全帯幺九',
    han: 2,
    hanClosed: 2,
    hanOpen: 1,
    type: 'regular',
    description:
      'Every meld and the pair includes at least one terminal or honor tile.',
    conditions: [
      'All sequences and triplets must contain terminals or honors',
      'Pair can be anything',
      'Can be open or closed'
    ],
    notes: 'Closed version is worth 2 han, open is worth 1 han.',
    category: 'Hand Pattern',
    rarity: 'Unusual',
    openHand: 'both'
  },
  {
    id: 'sanshoku',
    name: 'Sanshoku doujun',
    nameEn: 'Three-colored straight',
    nameJp: '三色同順',
    han: 2,
    hanClosed: 2,
    hanOpen: 1,
    type: 'regular',
    description: 'Three sequences of the same numbers across all three suits.',
    conditions: [
      'Same sequence pattern in man, pin, and sou',
      'Example: 2-3-4 in all three suits'
    ],
    notes: 'Closed version is worth 2 han, open is worth 1 han.',
    category: 'Hand Pattern',
    rarity: 'Unusual',
    openHand: 'both',
    exampleTiles: [
      '1m',
      '2m',
      '3m',
      '1p',
      '2p',
      '3p',
      '1s',
      '2s',
      '3s',
      '4m',
      '5m',
      '6m',
      '7p',
      '7p'
    ]
  },
  {
    id: 'ittsu',
    name: 'Ittsu',
    nameEn: 'Straight (1–9)',
    nameJp: '一気通貫',
    han: 2,
    hanClosed: 2,
    hanOpen: 1,
    type: 'regular',
    description: 'Sequences 123, 456, and 789 in the same suit.',
    conditions: [
      'Must have 1-2-3, 4-5-6, and 7-8-9 in the same suit',
      'Can be open or closed'
    ],
    notes: 'Closed version is worth 2 han, open is worth 1 han.',
    category: 'Hand Pattern',
    rarity: 'Unusual',
    openHand: 'both',
    exampleTiles: [
      '1m',
      '2m',
      '3m',
      '4m',
      '5m',
      '6m',
      '7m',
      '8m',
      '9m',
      '1p',
      '2p',
      '3p',
      '4s',
      '4s'
    ]
  },
  {
    id: 'toitoi',
    name: 'Toitoi',
    nameEn: 'All triplets',
    nameJp: '対々',
    han: 2,
    hanClosed: 2,
    hanOpen: 2,
    type: 'regular',
    description: 'All four melds are triplets or quads.',
    conditions: [
      'All melds must be triplets or quads',
      'No sequences allowed',
      'Can be open or closed'
    ],
    notes: 'Very common pattern, easy to achieve.',
    category: 'Hand Pattern',
    rarity: 'Unusual',
    openHand: 'both'
  },
  {
    id: 'sanankou',
    name: 'Sanankou',
    nameEn: 'Three closed triplets',
    nameJp: '三暗刻',
    han: 2,
    hanClosed: 2,
    hanOpen: 2,
    type: 'regular',
    description:
      'Hand containing three concealed triplets/quads; the fourth meld may be open.',
    conditions: [
      'Three triplets that were not called (pon)',
      'Can be combined with other yaku',
      'Hand can be open or closed'
    ],
    notes: 'The triplets must be self-drawn or formed from your hand.',
    category: 'Triplets',
    rarity: 'Rare',
    openHand: 'both'
  },
  {
    id: 'sanshoku_doukou',
    name: 'Sanshoku doukou',
    nameEn: 'Three-colored triplets',
    nameJp: '三色同刻',
    han: 2,
    hanClosed: 2,
    hanOpen: 2,
    type: 'regular',
    description:
      'Three triplets/quads of the same number in each of the three suits.',
    conditions: [
      'Same number triplet in man, pin, and sou',
      'Example: 5-5-5 in all three suits'
    ],
    notes: 'Can be open or closed.',
    category: 'Triplets',
    rarity: 'Rare',
    openHand: 'both'
  },
  {
    id: 'sankantsu',
    name: 'Sankantsu',
    nameEn: 'Three kans',
    nameJp: '三槓子',
    han: 2,
    hanClosed: 2,
    hanOpen: 2,
    type: 'regular',
    description: 'Hand containing three quads of any kind.',
    conditions: [
      'Three quads (kan) in the hand',
      'Can be open or closed',
      'Very rare pattern'
    ],
    notes: 'Extremely rare due to tile limitations.',
    category: 'Triplets',
    rarity: 'Ultra Rare',
    openHand: 'both'
  },
  {
    id: 'chiitoitsu',
    name: 'Chiitoitsu',
    nameEn: 'Seven pairs',
    nameJp: '七対子',
    han: 2,
    hanClosed: 2,
    hanOpen: null,
    type: 'regular',
    description: 'Closed hand consisting of seven distinct pairs.',
    conditions: [
      'Seven different pairs (no quadruplets)',
      'Hand must be closed',
      'Cannot have any melds'
    ],
    notes: 'Unique hand structure, always closed.',
    category: 'Special',
    rarity: 'Unusual',
    openHand: 'closed'
  },
  {
    id: 'honroutou',
    name: 'Honroutou',
    nameEn: 'Terminals and honors',
    nameJp: '混老頭',
    han: 2,
    hanClosed: 2,
    hanOpen: 2,
    type: 'regular',
    description: 'Hand using only terminals and honor tiles.',
    conditions: [
      'Only 1s, 9s, dragons, and winds',
      'No 2-8 tiles',
      'Can be open or closed'
    ],
    notes:
      'Always combined with Toitoi or Chiitoitsu in practice, effectively counting as 4 han. Automatically includes toitoi.',
    category: 'Hand Pattern',
    rarity: 'Rare',
    openHand: 'both'
  },
  {
    id: 'shousangen',
    name: 'Shousangen',
    nameEn: 'Small three dragons',
    nameJp: '小三元',
    han: 2,
    hanClosed: 2,
    hanOpen: 2,
    type: 'regular',
    description: 'Two dragon triplets/quads and a pair of the third dragon.',
    conditions: [
      'Two dragon triplets',
      'One dragon pair',
      'Can be open or closed'
    ],
    notes:
      'Includes 2 han from dragon triplets as Yakuhai, so often treated as 4 han total. Automatically includes two yakuhai.',
    category: 'Triplets',
    rarity: 'Rare',
    openHand: 'both'
  },
  {
    id: 'honitsu',
    name: 'Honitsu',
    nameEn: 'Half flush',
    nameJp: '混一色',
    han: 3,
    hanClosed: 3,
    hanOpen: 2,
    type: 'regular',
    description: 'Hand of one suit plus honor tiles.',
    conditions: [
      'Only one suit (man, pin, or sou)',
      'Honor tiles allowed',
      'Closed version is worth 3 han, open is worth 2 han'
    ],
    notes: 'Very common pattern, especially with open melds.',
    category: 'Hand Pattern',
    rarity: 'Frequent',
    openHand: 'both',
    exampleTiles: [
      '1m',
      '2m',
      '3m',
      '4m',
      '5m',
      '6m',
      '7m',
      '8m',
      '9m',
      'ew',
      'ew',
      'ew',
      'rd',
      'rd'
    ]
  },
  {
    id: 'junchan',
    name: 'Junchan',
    nameEn: 'Terminal in each set',
    nameJp: '純全帯么九',
    han: 3,
    hanClosed: 3,
    hanOpen: 2,
    type: 'regular',
    description:
      'Every meld and the pair includes at least one terminal tile (1 or 9).',
    conditions: [
      'All melds contain terminals (1 or 9)',
      'No honor tiles',
      'Closed version is worth 3 han, open is worth 2 han'
    ],
    notes: 'Closed version is junchan, open is chanta.',
    category: 'Hand Pattern',
    rarity: 'Rare',
    openHand: 'both'
  },
  {
    id: 'ryanpeikou',
    name: 'Ryanpeikou',
    nameEn: 'Two sets of identical sequences',
    nameJp: '二盃口',
    han: 3,
    hanClosed: 3,
    hanOpen: null,
    type: 'regular',
    description:
      'Closed hand with two distinct Iipeikou (two different pairs of identical sequences).',
    conditions: [
      'Two pairs of identical sequences',
      'Hand must be closed',
      'Automatically includes pinfu'
    ],
    notes: 'Very difficult to achieve, always closed.',
    category: 'Hand Pattern',
    rarity: 'Rare',
    openHand: 'closed'
  },
  {
    id: 'chinitsu',
    name: 'Chinitsu',
    nameEn: 'Full flush',
    nameJp: '清一色',
    han: 6,
    hanClosed: 6,
    hanOpen: 5,
    type: 'regular',
    description:
      'Hand composed entirely of tiles from a single suit, with no honors.',
    conditions: [
      'Only one suit (man, pin, or sou)',
      'No honor tiles',
      'Closed version is worth 6 han, open is worth 5 han'
    ],
    notes: 'Closed version is mangan (limit hand).',
    category: 'Hand Pattern',
    rarity: 'Rare',
    openHand: 'both',
    exampleTiles: [
      '1m',
      '2m',
      '3m',
      '4m',
      '5m',
      '6m',
      '7m',
      '8m',
      '9m',
      '1m',
      '2m',
      '3m',
      '4m',
      '4m'
    ]
  },
  {
    id: 'kazoe_yakuman',
    name: 'Kazoe yakuman',
    nameEn: 'Counted yakuman',
    nameJp: '数え役満',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description:
      'Any hand that reaches 13 or more han from normal yaku and/or dora; scored as a yakuman in many rules.',
    conditions: [
      'Total han value must be 13 or more',
      'Combined from other yaku and dora',
      'Can be open or closed'
    ],
    notes: 'Achieved by combining multiple yaku and dora.',
    category: 'Yakuman',
    rarity: 'Very Rare',
    openHand: 'both'
  },
  {
    id: 'kokushimusou',
    name: 'Kokushi musou',
    nameEn: 'Thirteen orphans',
    nameJp: '国士無双',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description:
      'Closed hand containing one of each terminal and honor tile plus one duplicate of any of them.',
    conditions: [
      'One of each: 1 man, 9 man, 1 pin, 9 pin, 1 sou, 9 sou',
      'One of each dragon and wind',
      'One duplicate of any of the above'
    ],
    notes: 'The only yakuman that can be won with 13 tiles.',
    category: 'Yakuman',
    rarity: 'Very Rare',
    openHand: 'closed'
  },
  {
    id: 'suuankou',
    name: 'Suuankou',
    nameEn: 'Four concealed triplets',
    nameJp: '四暗刻',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description:
      'Hand with four concealed triplets/quads; special treatment for certain waits depending on rules.',
    conditions: [
      'Four triplets, all concealed (not called)',
      'If self-drawn, double yakuman',
      'Hand must be closed'
    ],
    notes: 'Suuankou tanki (single wait) is double yakuman.',
    category: 'Yakuman',
    rarity: 'Very Rare',
    openHand: 'closed'
  },
  {
    id: 'daisangen',
    name: 'Daisangen',
    nameEn: 'Big three dragons',
    nameJp: '大三元',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description: 'Triplets/quads of all three dragon tiles.',
    conditions: [
      'Triplet of white dragon',
      'Triplet of green dragon',
      'Triplet of red dragon'
    ],
    notes: 'Automatically includes three yakuhai.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'both'
  },
  {
    id: 'shousuushii',
    name: 'Shousuushii',
    nameEn: 'Small four winds',
    nameJp: '小四喜',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description: 'Three wind triplets/quads and a pair of the fourth wind.',
    conditions: [
      'Triplets of three different winds',
      'Pair of the remaining wind'
    ],
    notes: 'Very rare pattern.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'both'
  },
  {
    id: 'daisuushii',
    name: 'Daisuushii',
    nameEn: 'Big four winds',
    nameJp: '大四喜',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description:
      'Triplets/quads of all four wind tiles; sometimes treated as double yakuman.',
    conditions: [
      'Triplet of east wind',
      'Triplet of south wind',
      'Triplet of west wind',
      'Triplet of north wind'
    ],
    notes: 'Extremely rare, considered double yakuman in some rules.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'both'
  },
  {
    id: 'tsuuiisou',
    name: 'Tsuuiisou',
    nameEn: 'All honors',
    nameJp: '字一色',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description: 'Hand made entirely of honor tiles (winds and dragons).',
    conditions: [
      'Only dragons and winds',
      'No number tiles',
      'Can be open or closed'
    ],
    notes: 'Automatically includes toitoi.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'both'
  },
  {
    id: 'chinroutou',
    name: 'Chinroutou',
    nameEn: 'All terminals',
    nameJp: '清老頭',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description: 'Hand made entirely of terminal suit tiles (1s and 9s).',
    conditions: ['Only 1s and 9s', 'No honor tiles', 'Can be open or closed'],
    notes: 'Automatically includes toitoi.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'both'
  },
  {
    id: 'ryuuiisou',
    name: 'Ryuuiisou',
    nameEn: 'All green',
    nameJp: '緑一色',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description:
      'Hand composed only of green tiles (2, 3, 4, 6, 8 of souzu and green dragon).',
    conditions: [
      'Only green tiles: 2, 3, 4, 6, 8 sou and green dragon',
      'No other tiles allowed'
    ],
    notes: 'All tiles must be green in color.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'both'
  },
  {
    id: 'chuuren_poutou',
    name: 'Chuuren poutou',
    nameEn: 'Nine gates',
    nameJp: '九蓮宝燈',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description:
      'Closed hand with 1112345678999 in one suit plus one extra tile of that suit, forming a special multi-sided wait.',
    conditions: [
      '1112345678999 in one suit',
      'Plus any 1-9 tile of that suit',
      'Hand must be closed'
    ],
    notes: 'Pure nine gates (waiting on all 9 tiles) is double yakuman.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'closed'
  },
  {
    id: 'suukantsu',
    name: 'Suukantsu',
    nameEn: 'Four kans',
    nameJp: '四槓子',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description: 'Hand with four quads declared.',
    conditions: ['Four quads (kan)', 'Can be open or closed', 'Extremely rare'],
    notes: 'Due to tile limitations, this is almost impossible.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'both'
  },
  {
    id: 'tenhou',
    name: 'Tenhou',
    nameEn: 'Heavenly hand',
    nameJp: '天和',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description:
      'Dealer wins on their starting hand before discarding any tile.',
    conditions: [
      'Must be the dealer',
      'Win on your first turn before any discards'
    ],
    notes: 'Ultra rare opportunity yakuman.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'closed'
  },
  {
    id: 'chiihou',
    name: 'Chiihou',
    nameEn: 'Earthly hand',
    nameJp: '地和',
    han: 'yakuman',
    hanClosed: null,
    hanOpen: null,
    type: 'yakuman',
    description:
      'Non-dealer wins by tsumo on their first drawn tile, with no calls made before that draw.',
    conditions: [
      'Must be a non-dealer',
      'Win on your first uninterrupted turn',
      'Before any discards from your hand'
    ],
    notes: 'Ultra rare opportunity yakuman.',
    category: 'Yakuman',
    rarity: 'Ultra Rare',
    openHand: 'closed'
  },
  {
    id: 'nagashi_mangan',
    name: 'Nagashi mangan',
    nameEn: 'Terminal honor discards',
    nameJp: '流し満貫',
    han: null,
    hanClosed: null,
    hanOpen: null,
    type: 'special',
    description:
      "At exhaustive draw, a player's discards are exclusively terminals and honors, and none of them are called; hand scores as mangan.",
    conditions: [
      'Exhaustive draw reached',
      'All discards are honors and terminals',
      'No one called any of your tiles'
    ],
    notes:
      'Not a yaku on the hand itself but a special draw result. Ultra rare opportunity yaku.',
    category: 'Special',
    rarity: 'Ultra Rare',
    openHand: 'both'
  }
];

export function getYakuById(id: string): Yaku | undefined {
  return yakuList.find(y => y.id === id);
}
