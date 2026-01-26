import { Riichi } from 'riichi-ts';

export type TileId =
  | '1m'
  | '2m'
  | '3m'
  | '4m'
  | '5m'
  | '6m'
  | '7m'
  | '8m'
  | '9m'
  | '1p'
  | '2p'
  | '3p'
  | '4p'
  | '5p'
  | '6p'
  | '7p'
  | '8p'
  | '9p'
  | '1s'
  | '2s'
  | '3s'
  | '4s'
  | '5s'
  | '6s'
  | '7s'
  | '8s'
  | '9s'
  | 'ew'
  | 'sw'
  | 'ww'
  | 'nw'
  | 'wd'
  | 'gd'
  | 'rd';

export type WinType = 'tsumo' | 'ron';

export type Wind = 'ew' | 'sw' | 'ww' | 'nw';

export type Hand = {
  // Closed part of the hand. Taken tile from the wall should be the last here in case of tsumo.
  closedPart: TileId[];
  // Open part of the hand
  openPart: Array<{
    open: boolean; // set open: false to mark closed kan (ankan)
    tiles: TileId[];
  }>;
  options?: {
    winningTileIndex: number;
    winType: WinType;
    roundWind: Wind;
    seatWind: Wind;
    riichi: boolean;
    ippatsu: boolean;
    doubleRiichi: boolean;
  };
};

export type HandPoints = Riichi['tmpResult'];

export type TileCount = Record<TileId, number>;
