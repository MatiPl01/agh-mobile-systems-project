// Man (Characters) tiles
// 'm' = Man (萬, characters/numbers written in kanji)
import tile1m from './Man1.svg'; // '1m' = 1 of Man (一萬)
import tile2m from './Man2.svg'; // '2m' = 2 of Man (二萬)
import tile3m from './Man3.svg'; // '3m' = 3 of Man (三萬)
import tile4m from './Man4.svg'; // '4m' = 4 of Man (四萬)
import tile5m from './Man5.svg'; // '5m' = 5 of Man (五萬)
import tile6m from './Man6.svg'; // '6m' = 6 of Man (六萬)
import tile7m from './Man7.svg'; // '7m' = 7 of Man (七萬)
import tile8m from './Man8.svg'; // '8m' = 8 of Man (八萬)
import tile9m from './Man9.svg'; // '9m' = 9 of Man (九萬)

// Pin (Circles) tiles
// 'p' = Pin (筒, circles/dots)
import tile1p from './Pin1.svg'; // '1p' = 1 of Pin (一筒)
import tile2p from './Pin2.svg'; // '2p' = 2 of Pin (二筒)
import tile3p from './Pin3.svg'; // '3p' = 3 of Pin (三筒)
import tile4p from './Pin4.svg'; // '4p' = 4 of Pin (四筒)
import tile5p from './Pin5.svg'; // '5p' = 5 of Pin (五筒)
import tile6p from './Pin6.svg'; // '6p' = 6 of Pin (六筒)
import tile7p from './Pin7.svg'; // '7p' = 7 of Pin (七筒)
import tile8p from './Pin8.svg'; // '8p' = 8 of Pin (八筒)
import tile9p from './Pin9.svg'; // '9p' = 9 of Pin (九筒)

// Sou (Bamboo) tiles
// 's' = Sou (索, bamboo sticks)
import tile1s from './Sou1.svg'; // '1s' = 1 of Sou (一索)
import tile2s from './Sou2.svg'; // '2s' = 2 of Sou (二索)
import tile3s from './Sou3.svg'; // '3s' = 3 of Sou (三索)
import tile4s from './Sou4.svg'; // '4s' = 4 of Sou (四索)
import tile5s from './Sou5.svg'; // '5s' = 5 of Sou (五索)
import tile6s from './Sou6.svg'; // '6s' = 6 of Sou (六索)
import tile7s from './Sou7.svg'; // '7s' = 7 of Sou (七索)
import tile8s from './Sou8.svg'; // '8s' = 8 of Sou (八索)
import tile9s from './Sou9.svg'; // '9s' = 9 of Sou (九索)

// Winds
import tileSw from './Nan.svg'; // 'sw' = South Wind (Nan 南)
import tileNw from './Pei.svg'; // 'nw' = North Wind (Pei 北)
import tileWw from './Shaa.svg'; // 'ww' = West Wind (Shaa 西)
import tileEw from './Ton.svg'; // 'ew' = East Wind (Ton 東)

// Dragons
import tileRd from './Chun.svg'; // 'rd' = Red Dragon (Chun 中)
import tileWd from './Haku.svg'; // 'wd' = White Dragon (Haku 白)
import tileGd from './Hatsu.svg'; // 'gd' = Green Dragon (Hatsu 發)

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

/**
 * Mapping of tile IDs to their imported image assets
 */
export const TILES: Record<TileId, number> = {
  '1m': tile1m,
  '2m': tile2m,
  '3m': tile3m,
  '4m': tile4m,
  '5m': tile5m,
  '6m': tile6m,
  '7m': tile7m,
  '8m': tile8m,
  '9m': tile9m,
  '1p': tile1p,
  '2p': tile2p,
  '3p': tile3p,
  '4p': tile4p,
  '5p': tile5p,
  '6p': tile6p,
  '7p': tile7p,
  '8p': tile8p,
  '9p': tile9p,
  '1s': tile1s,
  '2s': tile2s,
  '3s': tile3s,
  '4s': tile4s,
  '5s': tile5s,
  '6s': tile6s,
  '7s': tile7s,
  '8s': tile8s,
  '9s': tile9s,
  ew: tileEw,
  sw: tileSw,
  ww: tileWw,
  nw: tileNw,
  wd: tileWd,
  gd: tileGd,
  rd: tileRd
};
