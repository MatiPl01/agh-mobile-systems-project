import type { Hand, TileCount, TileId } from '@/types/hand';

export const ORDERED_TILES = [
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
  '4p',
  '5p',
  '6p',
  '7p',
  '8p',
  '9p',
  '1s',
  '2s',
  '3s',
  '4s',
  '5s',
  '6s',
  '7s',
  '8s',
  '9s',
  'ew',
  'sw',
  'ww',
  'nw',
  'wd',
  'gd',
  'rd'
] as const satisfies TileId[];

export const ORDERED_WINDS = [
  'ew',
  'sw',
  'ww',
  'nw'
] as const satisfies TileId[];

export const MAX_TILES_PER_TYPE = 4;
export const HAND_SIZE = 14;

export function isValidMeld(tiles: TileId[]): boolean {
  'worklet';

  // Melds can be either triplets or quads
  if (tiles.length !== 3 && tiles.length !== 4) {
    return false;
  }

  if (tiles.every(tile => tile === tiles[0])) {
    // Triplet or quad of the same tile
    return true;
  }

  // For sequences we need exactly 3 tiles
  if (tiles.length !== 3) {
    return false;
  }

  // Extract suit
  const suit = tiles[0][1];

  // Winds and dragons can't form sequences
  if (suit !== 'm' && suit !== 'p' && suit !== 's') {
    return false;
  }

  // Check all tiles are same suit
  if (!tiles.every(tile => tile[1] === suit)) {
    return false;
  }

  const numbers = tiles
    .map(tile => parseInt(tile[0], 10))
    .sort((a, b) => a - b);

  // Check if consecutive
  return numbers[0] + 1 === numbers[1] && numbers[1] + 1 === numbers[2];
}

export function isValidHand(hand: Hand) {
  'worklet';

  const { closedPart, openPart } = hand;

  const isOpenPartValid = openPart.every(meld => isValidMeld(meld.tiles));
  const isTilesCountValid = openPart.length * 3 + closedPart.length === 14;

  return isOpenPartValid && isTilesCountValid;
}

export function sortHandTiles(hand: Hand): Hand {
  'worklet';

  const closedPart = [...hand.closedPart].sort(
    (a, b) => ORDERED_TILES.indexOf(a) - ORDERED_TILES.indexOf(b)
  );

  const openPart = hand.openPart.map(meld => ({
    ...meld,
    tiles: [...meld.tiles].sort(
      (a, b) => ORDERED_TILES.indexOf(a) - ORDERED_TILES.indexOf(b)
    )
  }));

  return { closedPart, openPart };
}

export function getHandTileCounts(hand: Hand): TileCount {
  const counts = ORDERED_TILES.reduce((acc, tileId) => {
    acc[tileId] = 0;
    return acc;
  }, {} as TileCount);

  hand.closedPart.forEach(tile => (counts[tile] += 1));
  hand.openPart.forEach(meld => {
    meld.tiles.forEach(tile => (counts[tile] += 1));
  });

  return counts;
}

export function getHandSize(hand: Hand): number {
  return (
    hand.closedPart.length +
    hand.openPart.reduce((acc, meld) => acc + meld.tiles.length, 0)
  );
}

export function isEmptyHand(hand: Hand): boolean {
  return hand.closedPart.length === 0 && hand.openPart.length === 0;
}

export function createEmptyHand(): Hand {
  return { closedPart: [], openPart: [] };
}

export function addClosedPartTile(hand: Hand, tileId: TileId): Hand {
  return {
    ...hand,
    closedPart: [...hand.closedPart, tileId]
  };
}

export function removeClosedPartTile(hand: Hand, index: number): Hand {
  return {
    ...hand,
    closedPart: hand.closedPart.filter((_, i) => i !== index)
  };
}

export function groupTilesIntoOpenPart(hand: Hand, indexes: number[]): Hand {
  const selectedTiles = hand.closedPart.filter((_, index) =>
    indexes.includes(index)
  );

  // Check if selected tiles form a valid meld
  if (!isValidMeld(selectedTiles)) {
    return hand;
  }

  return {
    closedPart: hand.closedPart.filter((_, index) => !indexes.includes(index)),
    openPart: [...hand.openPart, { tiles: selectedTiles, open: true }]
  };
}

export function ungroupOpenPartMeld(hand: Hand, meldIndex: number): Hand {
  return {
    closedPart: [...hand.closedPart, ...hand.openPart[meldIndex].tiles],
    openPart: hand.openPart.filter((_, i) => i !== meldIndex)
  };
}
