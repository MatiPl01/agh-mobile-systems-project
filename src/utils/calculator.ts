import { Hand, HandPoints } from '@/types/hand';
import { Riichi } from 'riichi-ts';

const tileIdToNumber = {
  '1m': 0,
  '2m': 1,
  '3m': 2,
  '4m': 3,
  '5m': 4,
  '6m': 5,
  '7m': 6,
  '8m': 7,
  '9m': 8,
  '1p': 9,
  '2p': 10,
  '3p': 11,
  '4p': 12,
  '5p': 13,
  '6p': 14,
  '7p': 15,
  '8p': 16,
  '9p': 17,
  '1s': 18,
  '2s': 19,
  '3s': 20,
  '4s': 21,
  '5s': 22,
  '6s': 23,
  '7s': 24,
  '8s': 25,
  '9s': 26,
  ew: 27,
  sw: 28,
  ww: 29,
  nw: 30,
  wd: 31,
  gd: 32,
  rd: 33
};

export function calculateHandPoints(hand: Hand): HandPoints {
  console.log('Calculating hand points for hand:', hand);

  const roundWindTileId = hand.options?.roundWind || 'ew';
  const seatWindTileId = hand.options?.seatWind || 'sw';

  const winType = hand.options?.winType || 'tsumo';
  const winningTileIndex = hand.options?.winningTileIndex ?? 0;
  const winningTileId = hand.closedPart[winningTileIndex];

  const closedPart =
    winType === 'tsumo'
      ? [
          ...hand.closedPart.filter((_, index) => winningTileIndex !== index),
          winningTileId
        ]
      : hand.closedPart.filter((_, index) => winningTileIndex !== index);

  const tileTaken = winType === 'ron' ? tileIdToNumber[winningTileId] : null;

  const riichi = hand.options?.riichi || false;
  const ippatsu = hand.options?.ippatsu || false;
  const doubleRiichi = hand.options?.doubleRiichi || false;

  const riichiHand = new Riichi(
    // Closed part of the hand.
    // Taken tile from the wall should be the last here in case of tsumo.
    closedPart.map(tileId => tileIdToNumber[tileId]),
    // Open parts of the hand
    // Set open: false to mark closed kan (ankan)
    hand.openPart.map(({ open, tiles }) => ({
      open,
      tiles: tiles.map(tileId => tileIdToNumber[tileId])
    })),
    {
      bakaze: tileIdToNumber[roundWindTileId], // round wind
      jikaze: tileIdToNumber[seatWindTileId] // seat wind
    },
    // @ts-ignore
    tileTaken, // tile taken from someone's discard. In case of tsumo, set this to null.
    false, // was this the first take? Used to determine tenhou/chinou/renhou
    riichi, // does this hand have riichi?
    ippatsu, // does this hand have ippatsu?
    doubleRiichi, // does this hand have daburu-riichi?
    false, // is it the last taken tile? Used to determine haitei/houtei
    false, // was it agari after a kan? Used to determine rinshan/chankan
    0, // akadora count in hand
    true, // allow akadora; if this is false, previous parameter is ignored
    true, // allow kuitan?
    false // use kiriage mangan?
  );

  const result = riichiHand.calc();

  console.log('Calculation result:', result);

  /*
    Result format:
    {
      error: false, // true if hand couldn't be parsed
      fu: 30,
      han: 6,
      isAgari: true, // will be false if the hand is not winning
      ten: 12000, // amount of points won by the hand
      text: '', // additional info. Will contain 'no yaku' if the hand has no winning points 
      yaku: { // list of found yaku in the hand
       chinitsu: 5, // yaku name and amount of han for certain yaku
       tanyao: 1 
      },
      yakuman: 0, // Count of yakumans found
      hairi: { // shanten count and waits info
         now: 0, // current shanten count. 0 for tenpai.
         wait: [12], // tiles this hand is waiting for to improve or win
         waitsAfterDiscard: { // waits after discarding a certain tile
          12: [13, 14] 
         } 
      }
      hairi7and13: { // same as above but only for chiitoitsu and kokushimusou.
         now: 0,
         wait: [12],
         waitsAfterDiscard: { 12: [13, 14] }
      }
    }
 */

  return result;
}
