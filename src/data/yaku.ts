export type YakuType = 'regular' | 'yakuman';

export interface Yaku {
  id: string;
  name: string;
  nameEn: string;
  nameJp: string;
  han: number | 'yakuman';
  type: YakuType;
  description: string;
  conditions: string[];
  notes?: string;
  category: string;
}

export const yakuList: Yaku[] = [
  // 1 Han Yaku
  {
    id: 'riichi',
    name: 'Riichi',
    nameEn: 'Ready Hand',
    nameJp: '立直',
    han: 1,
    type: 'regular',
    description: 'Declare riichi when your hand is one tile away from winning.',
    conditions: [
      'Hand must be closed (no open melds)',
      'Must be waiting on exactly one tile',
      'Must have at least 1000 points to declare',
      'Cannot change your hand after declaring'
    ],
    notes: 'Can be combined with ippatsu for an additional han.',
    category: 'Declared'
  },
  {
    id: 'ippatsu',
    name: 'Ippatsu',
    nameEn: 'One Shot',
    nameJp: '一発',
    han: 1,
    type: 'regular',
    description: 'Win within one turn after declaring riichi.',
    conditions: [
      'Must win on your first turn after declaring riichi',
      'Cannot be interrupted by another player\'s discard'
    ],
    notes: 'Only available with riichi.',
    category: 'Declared'
  },
  {
    id: 'menzenchin',
    name: 'Menzenchin Tsumohou',
    nameEn: 'Fully Concealed Hand',
    nameJp: '門前清自摸和',
    han: 1,
    type: 'regular',
    description: 'Win by self-draw with a fully concealed hand.',
    conditions: [
      'Hand must be completely closed (no open melds)',
      'Must win by tsumo (self-draw)'
    ],
    notes: 'Not applicable if hand is open or won by ron.',
    category: 'Concealed'
  },
  {
    id: 'pinfu',
    name: 'Pinfu',
    nameEn: 'All Sequences',
    nameJp: '平和',
    han: 1,
    type: 'regular',
    description: 'Hand consists entirely of sequences with no triplets.',
    conditions: [
      'All melds must be sequences (chi)',
      'No triplets (pon) or quads (kan)',
      'Pair must be a non-value pair (not dragons or seat/wind)',
      'Must be closed hand',
      'Must have a two-sided wait'
    ],
    notes: 'Cannot combine with tanyao if pinfu is used.',
    category: 'Hand Pattern'
  },
  {
    id: 'iipeikou',
    name: 'Iipeikou',
    nameEn: 'Identical Sequences',
    nameJp: '一盃口',
    han: 1,
    type: 'regular',
    description: 'Two identical sequences in the same suit.',
    conditions: [
      'Two identical sequences in the same suit',
      'Hand must be closed',
      'Cannot be combined with sanshoku doujun'
    ],
    notes: 'Example: 2-3-4 man and 2-3-4 man.',
    category: 'Hand Pattern'
  },
  {
    id: 'tanyao',
    name: 'Tanyao',
    nameEn: 'All Simples',
    nameJp: '断幺九',
    han: 1,
    type: 'regular',
    description: 'Hand contains only tiles numbered 2-8 (no terminals or honors).',
    conditions: [
      'No 1s or 9s (terminals)',
      'No dragons or winds (honors)',
      'Only tiles 2-8 in man, pin, or sou suits'
    ],
    notes: 'Can be open or closed. Very common yaku.',
    category: 'Hand Pattern'
  },
  {
    id: 'yakuhai',
    name: 'Yakuhai',
    nameEn: 'Value Tiles',
    nameJp: '役牌',
    han: 1,
    type: 'regular',
    description: 'A triplet of dragons, seat wind, or round wind.',
    conditions: [
      'Triplet of any dragon (white, green, red)',
      'Triplet of your seat wind',
      'Triplet of the round wind'
    ],
    notes: 'Each yakuhai triplet is worth 1 han. Can have multiple.',
    category: 'Triplets'
  },
  {
    id: 'chanta',
    name: 'Chanta',
    nameEn: 'Terminal or Honor in Each Meld',
    nameJp: '混全帯幺九',
    han: 1,
    type: 'regular',
    description: 'Each meld contains at least one terminal (1 or 9) or honor tile.',
    conditions: [
      'All sequences and triplets must contain terminals or honors',
      'Pair can be anything',
      'Can be open or closed'
    ],
    notes: 'Closed version is worth 2 han (junchan).',
    category: 'Hand Pattern'
  },
  {
    id: 'sanshoku',
    name: 'Sanshoku Doujun',
    nameEn: 'Three Color Straight',
    nameJp: '三色同順',
    han: 2,
    type: 'regular',
    description: 'Same sequence in all three suits.',
    conditions: [
      'Same sequence pattern in man, pin, and sou',
      'Example: 2-3-4 in all three suits'
    ],
    notes: 'Closed version is worth 2 han, open is worth 1 han.',
    category: 'Hand Pattern'
  },
  {
    id: 'ittsu',
    name: 'Ittsu',
    nameEn: 'Straight',
    nameJp: '一気通貫',
    han: 2,
    type: 'regular',
    description: '1-2-3, 4-5-6, and 7-8-9 sequences in the same suit.',
    conditions: [
      'Must have 1-2-3, 4-5-6, and 7-8-9 in the same suit',
      'Can be open or closed'
    ],
    notes: 'Closed version is worth 2 han, open is worth 1 han.',
    category: 'Hand Pattern'
  },
  {
    id: 'toitoi',
    name: 'Toitoi',
    nameEn: 'All Triplets',
    nameJp: '対々和',
    han: 2,
    type: 'regular',
    description: 'Hand consists entirely of triplets (or quads) and a pair.',
    conditions: [
      'All melds must be triplets or quads',
      'No sequences allowed',
      'Can be open or closed'
    ],
    notes: 'Very common pattern, easy to achieve.',
    category: 'Hand Pattern'
  },
  {
    id: 'sanankou',
    name: 'Sanankou',
    nameEn: 'Three Concealed Triplets',
    nameJp: '三暗刻',
    han: 2,
    type: 'regular',
    description: 'Three concealed triplets in the hand.',
    conditions: [
      'Three triplets that were not called (pon)',
      'Can be combined with other yaku',
      'Hand can be open or closed'
    ],
    notes: 'The triplets must be self-drawn or formed from your hand.',
    category: 'Triplets'
  },
  {
    id: 'sankantsu',
    name: 'Sankantsu',
    nameEn: 'Three Quads',
    nameJp: '三槓子',
    han: 2,
    type: 'regular',
    description: 'Three quads (kan) in the hand.',
    conditions: [
      'Three quads (kan) in the hand',
      'Can be open or closed',
      'Very rare pattern'
    ],
    notes: 'Extremely rare due to tile limitations.',
    category: 'Triplets'
  },
  {
    id: 'sanshoku_doukou',
    name: 'Sanshoku Doukou',
    nameEn: 'Three Color Triplets',
    nameJp: '三色同刻',
    han: 2,
    type: 'regular',
    description: 'Same triplet in all three suits.',
    conditions: [
      'Same number triplet in man, pin, and sou',
      'Example: 5-5-5 in all three suits'
    ],
    notes: 'Can be open or closed.',
    category: 'Triplets'
  },
  {
    id: 'chitoitsu',
    name: 'Chitoitsu',
    nameEn: 'Seven Pairs',
    nameJp: '七対子',
    han: 2,
    type: 'regular',
    description: 'Hand consists of seven different pairs.',
    conditions: [
      'Seven different pairs (no quadruplets)',
      'Hand must be closed',
      'Cannot have any melds'
    ],
    notes: 'Unique hand structure, always closed.',
    category: 'Special'
  },
  {
    id: 'honroutou',
    name: 'Honroutou',
    nameEn: 'All Terminals and Honors',
    nameJp: '混老頭',
    han: 2,
    type: 'regular',
    description: 'Hand consists only of terminals (1, 9) and honors.',
    conditions: [
      'Only 1s, 9s, dragons, and winds',
      'No 2-8 tiles',
      'Can be open or closed'
    ],
    notes: 'Automatically includes toitoi.',
    category: 'Hand Pattern'
  },
  {
    id: 'shousangen',
    name: 'Shousangen',
    nameEn: 'Little Three Dragons',
    nameJp: '小三元',
    han: 2,
    type: 'regular',
    description: 'Two dragon triplets and a dragon pair.',
    conditions: [
      'Two dragon triplets',
      'One dragon pair',
      'Can be open or closed'
    ],
    notes: 'Automatically includes two yakuhai.',
    category: 'Triplets'
  },
  {
    id: 'junchan',
    name: 'Junchan',
    nameEn: 'Pure Terminal',
    nameJp: '純全帯幺九',
    han: 3,
    type: 'regular',
    description: 'Each meld contains terminals (1 or 9), no honors.',
    conditions: [
      'All melds contain terminals (1 or 9)',
      'No honor tiles',
      'Closed version is worth 3 han, open is worth 2 han'
    ],
    notes: 'Closed version is junchan, open is chanta.',
    category: 'Hand Pattern'
  },
  {
    id: 'honitsu',
    name: 'Honitsu',
    nameEn: 'Half Flush',
    nameJp: '混一色',
    han: 3,
    type: 'regular',
    description: 'Hand uses only one suit plus honors.',
    conditions: [
      'Only one suit (man, pin, or sou)',
      'Honor tiles allowed',
      'Closed version is worth 3 han, open is worth 2 han'
    ],
    notes: 'Very common pattern, especially with open melds.',
    category: 'Hand Pattern'
  },
  {
    id: 'ryanpeikou',
    name: 'Ryanpeikou',
    nameEn: 'Two Sets of Identical Sequences',
    nameJp: '二盃口',
    han: 3,
    type: 'regular',
    description: 'Two sets of identical sequences (four sequences total, two pairs).',
    conditions: [
      'Two pairs of identical sequences',
      'Hand must be closed',
      'Automatically includes pinfu'
    ],
    notes: 'Very difficult to achieve, always closed.',
    category: 'Hand Pattern'
  },
  {
    id: 'chinitsu',
    name: 'Chinitsu',
    nameEn: 'Full Flush',
    nameJp: '清一色',
    han: 6,
    type: 'regular',
    description: 'Hand uses only one suit, no honors.',
    conditions: [
      'Only one suit (man, pin, or sou)',
      'No honor tiles',
      'Closed version is worth 6 han, open is worth 5 han'
    ],
    notes: 'Closed version is mangan (limit hand).',
    category: 'Hand Pattern'
  },
  // Yakuman
  {
    id: 'kokushi',
    name: 'Kokushi Musou',
    nameEn: 'Thirteen Orphans',
    nameJp: '国士無双',
    han: 'yakuman',
    type: 'yakuman',
    description: 'One of each terminal (1, 9) and honor, plus one duplicate.',
    conditions: [
      'One of each: 1 man, 9 man, 1 pin, 9 pin, 1 sou, 9 sou',
      'One of each dragon and wind',
      'One duplicate of any of the above'
    ],
    notes: 'The only yakuman that can be won with 13 tiles.',
    category: 'Yakuman'
  },
  {
    id: 'suuankou',
    name: 'Suuankou',
    nameEn: 'Four Concealed Triplets',
    nameJp: '四暗刻',
    han: 'yakuman',
    type: 'yakuman',
    description: 'Four concealed triplets.',
    conditions: [
      'Four triplets, all concealed (not called)',
      'If self-drawn, double yakuman',
      'Hand must be closed'
    ],
    notes: 'Suuankou tanki (single wait) is double yakuman.',
    category: 'Yakuman'
  },
  {
    id: 'daisangen',
    name: 'Daisangen',
    nameEn: 'Big Three Dragons',
    nameJp: '大三元',
    han: 'yakuman',
    type: 'yakuman',
    description: 'Triplets of all three dragons.',
    conditions: [
      'Triplet of white dragon',
      'Triplet of green dragon',
      'Triplet of red dragon'
    ],
    notes: 'Automatically includes three yakuhai.',
    category: 'Yakuman'
  },
  {
    id: 'tsuuiisou',
    name: 'Tsuuiisou',
    nameEn: 'All Honors',
    nameJp: '字一色',
    han: 'yakuman',
    type: 'yakuman',
    description: 'Hand consists only of honor tiles (dragons and winds).',
    conditions: [
      'Only dragons and winds',
      'No number tiles',
      'Can be open or closed'
    ],
    notes: 'Automatically includes toitoi.',
    category: 'Yakuman'
  },
  {
    id: 'shousuushi',
    name: 'Shousuushi',
    nameEn: 'Little Four Winds',
    nameJp: '小四喜',
    han: 'yakuman',
    type: 'yakuman',
    description: 'Triplets of three winds and a pair of the fourth wind.',
    conditions: [
      'Triplets of three different winds',
      'Pair of the remaining wind'
    ],
    notes: 'Very rare pattern.',
    category: 'Yakuman'
  },
  {
    id: 'daisuushi',
    name: 'Daisuushi',
    nameEn: 'Big Four Winds',
    nameJp: '大四喜',
    han: 'yakuman',
    type: 'yakuman',
    description: 'Triplets of all four winds.',
    conditions: [
      'Triplet of east wind',
      'Triplet of south wind',
      'Triplet of west wind',
      'Triplet of north wind'
    ],
    notes: 'Extremely rare, considered double yakuman in some rules.',
    category: 'Yakuman'
  },
  {
    id: 'ryuuiisou',
    name: 'Ryuuiisou',
    nameEn: 'All Green',
    nameJp: '緑一色',
    han: 'yakuman',
    type: 'yakuman',
    description: 'Hand consists only of green tiles (2, 3, 4, 6, 8 sou, green dragon).',
    conditions: [
      'Only green tiles: 2, 3, 4, 6, 8 sou and green dragon',
      'No other tiles allowed'
    ],
    notes: 'All tiles must be green in color.',
    category: 'Yakuman'
  },
  {
    id: 'chinroutou',
    name: 'Chinroutou',
    nameEn: 'All Terminals',
    nameJp: '清老頭',
    han: 'yakuman',
    type: 'yakuman',
    description: 'Hand consists only of terminals (1 and 9).',
    conditions: [
      'Only 1s and 9s',
      'No honor tiles',
      'Can be open or closed'
    ],
    notes: 'Automatically includes toitoi.',
    category: 'Yakuman'
  },
  {
    id: 'chuuren',
    name: 'Chuuren Poutou',
    nameEn: 'Nine Gates',
    nameJp: '九蓮宝燈',
    han: 'yakuman',
    type: 'yakuman',
    description: '1-1-1-2-3-4-5-6-7-8-9-9-9 in one suit, plus any tile of that suit.',
    conditions: [
      '1112345678999 in one suit',
      'Plus any 1-9 tile of that suit',
      'Hand must be closed'
    ],
    notes: 'Pure nine gates (waiting on all 9 tiles) is double yakuman.',
    category: 'Yakuman'
  },
  {
    id: 'suukantsu',
    name: 'Suukantsu',
    nameEn: 'Four Quads',
    nameJp: '四槓子',
    han: 'yakuman',
    type: 'yakuman',
    description: 'Four quads (kan) in the hand.',
    conditions: [
      'Four quads (kan)',
      'Can be open or closed',
      'Extremely rare'
    ],
    notes: 'Due to tile limitations, this is almost impossible.',
    category: 'Yakuman'
  }
];

export const yakuByCategory: Record<string, Yaku[]> = {
  Declared: yakuList.filter(y => y.category === 'Declared'),
  'Hand Pattern': yakuList.filter(y => y.category === 'Hand Pattern'),
  Triplets: yakuList.filter(y => y.category === 'Triplets'),
  Concealed: yakuList.filter(y => y.category === 'Concealed'),
  Special: yakuList.filter(y => y.category === 'Special'),
  Yakuman: yakuList.filter(y => y.category === 'Yakuman')
};

export function getYakuById(id: string): Yaku | undefined {
  return yakuList.find(y => y.id === id);
}

