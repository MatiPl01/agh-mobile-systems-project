import type { Yaku } from '@/data/yaku';
import { yakuList } from '@/data/yaku';
import type { TileId } from '@assets/images/tiles';

export type WinType = 'tsumo' | 'ron';

export interface ScoringResult {
  han: number;
  fu: number;
  totalPoints: number;
  limitName: string | null;
  yaku: { yaku: Yaku; han: number }[];
  winType: WinType;
  isDealer: boolean;
  payment: {
    fromEach?: number;
    fromDealer?: number;
    fromDiscarder?: number;
  };
}

export function getLimitName(han: number, fu: number): string | null {
  if (han >= 13) return 'Yakuman';
  if (han >= 11) return 'Sanbaiman';
  if (han >= 8) return 'Baiman';
  if (han >= 6) return 'Haneman';
  if (han >= 5 || (han >= 4 && fu >= 40) || (han >= 3 && fu >= 70)) {
    return 'Mangan';
  }
  return null;
}

export function calculatePoints(
  han: number,
  fu: number,
  isDealer: boolean,
  winType: WinType
): { total: number; payment: ScoringResult['payment'] } {
  const limitName = getLimitName(han, fu);

  let basePoints: number;

  if (limitName === 'Yakuman') {
    basePoints = 8000;
  } else if (limitName === 'Sanbaiman') {
    basePoints = 6000;
  } else if (limitName === 'Baiman') {
    basePoints = 4000;
  } else if (limitName === 'Haneman') {
    basePoints = 3000;
  } else if (limitName === 'Mangan') {
    basePoints = 2000;
  } else {
    basePoints = fu * Math.pow(2, 2 + han);
    if (basePoints > 2000) basePoints = 2000;
  }

  const roundUp = (n: number) => Math.ceil(n / 100) * 100;

  if (isDealer) {
    if (winType === 'tsumo') {
      const fromEach = roundUp(basePoints * 2);
      return {
        total: fromEach * 3,
        payment: { fromEach }
      };
    } else {
      const fromDiscarder = roundUp(basePoints * 6);
      return {
        total: fromDiscarder,
        payment: { fromDiscarder }
      };
    }
  } else {
    if (winType === 'tsumo') {
      const fromDealer = roundUp(basePoints * 2);
      const fromEach = roundUp(basePoints);
      return {
        total: fromDealer + fromEach * 2,
        payment: { fromDealer, fromEach }
      };
    } else {
      const fromDiscarder = roundUp(basePoints * 4);
      return {
        total: fromDiscarder,
        payment: { fromDiscarder }
      };
    }
  }
}

export function getMockScoringResult(): ScoringResult {
  const mockYaku = [
    { yaku: yakuList.find(y => y.id === 'riichi')!, han: 1 },
    { yaku: yakuList.find(y => y.id === 'tanyao')!, han: 1 },
    { yaku: yakuList.find(y => y.id === 'pinfu')!, han: 1 }
  ].filter(y => y.yaku);

  const han = mockYaku.reduce((sum, y) => sum + y.han, 0);
  const fu = 30;
  const isDealer = false;
  const winType: WinType = 'tsumo';

  const { total, payment } = calculatePoints(han, fu, isDealer, winType);
  const limitName = getLimitName(han, fu);

  return {
    han,
    fu,
    totalPoints: total,
    limitName,
    yaku: mockYaku,
    winType,
    isDealer,
    payment
  };
}

export type { TileId };
