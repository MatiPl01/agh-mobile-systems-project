import { Detection } from '@/types/detection';
import { Hand, TileId } from '@/types/hand';
import { isValidHand } from './hand';

export function getDetectionsFromTensor(
  outputTensor: any,
  numDetections: number,
  threshold = 0.5
): Detection[] {
  'worklet';
  const detections = [];

  for (let i = 0; i < numDetections; i++) {
    const xc = outputTensor[0][i];
    const yc = outputTensor[0][i + numDetections];
    const w = outputTensor[0][i + numDetections * 2];
    const h = outputTensor[0][i + numDetections * 3];

    let bestConfidence = 0;
    let bestClass = -1;
    for (let j = 0; j < 37; j++) {
      const confidence = outputTensor[0][i + numDetections * (j + 4)];
      if (confidence > bestConfidence) {
        bestConfidence = confidence;
        bestClass = j;
      }
    }
    if (bestConfidence > threshold) {
      detections.push({
        x: xc,
        y: yc,
        width: w,
        height: h,
        class: bestClass,
        confidence: bestConfidence
      });
    }
  }

  return detections;
}

export function iou(boxA: Detection, boxB: Detection): number {
  'worklet';
  const ax1 = boxA.x - boxA.width / 2;
  const ay1 = boxA.y - boxA.height / 2;
  const ax2 = boxA.x + boxA.width / 2;
  const ay2 = boxA.y + boxA.height / 2;

  const bx1 = boxB.x - boxB.width / 2;
  const by1 = boxB.y - boxB.height / 2;
  const bx2 = boxB.x + boxB.width / 2;
  const by2 = boxB.y + boxB.height / 2;

  const interX1 = Math.max(ax1, bx1);
  const interY1 = Math.max(ay1, by1);
  const interX2 = Math.min(ax2, bx2);
  const interY2 = Math.min(ay2, by2);

  const interW = Math.max(0, interX2 - interX1);
  const interH = Math.max(0, interY2 - interY1);
  const interArea = interW * interH;

  const areaA = (ax2 - ax1) * (ay2 - ay1);
  const areaB = (bx2 - bx1) * (by2 - by1);

  const union = areaA + areaB - interArea;
  if (union <= 0) return 0;

  return interArea / union;
}

export function nonMaxSuppression(
  detections: Detection[],
  iouThreshold: number = 0.5,
  scoreThreshold: number = 0.5
): Detection[] {
  'worklet';
  const results: Detection[] = [];

  // group detections by class id
  const detectionsByClass = new Map<number, Detection[]>();

  for (const det of detections) {
    if (det.confidence < scoreThreshold) continue;

    const arr = detectionsByClass.get(det.class) ?? [];
    arr.push(det);
    detectionsByClass.set(det.class, arr);
  }

  for (const [, detsOfClass] of detectionsByClass.entries()) {
    // sort descending by confidence
    const dets = [...detsOfClass].sort((a, b) => b.confidence - a.confidence);

    const kept: Detection[] = [];

    while (dets.length > 0) {
      const current = dets.shift() as Detection;
      kept.push(current);

      // remove boxes with high IoU to current
      for (let i = dets.length - 1; i >= 0; i--) {
        const overlap = iou(current, dets[i]);
        if (overlap > iouThreshold) {
          dets.splice(i, 1);
        }
      }
    }

    results.push(...kept);
  }

  return results;
}

const detectionClassToTileId: TileId[] = [
  '1m',
  '1p',
  '1s',
  'ew',
  '2m',
  '2p',
  '2s',
  'sw',
  '3m',
  '3p',
  '3s',
  'ww',
  '4m',
  '4p',
  '4s',
  'nw',
  '5m',
  '5p',
  '5s',
  'wd',
  '6m',
  '6p',
  '6s',
  'gd',
  '7m',
  '7p',
  '7s',
  'rd',
  '8m',
  '8p',
  '8s',
  '9m',
  '9p',
  '9s'
];

export function getDetectedHand(uniqueDetections: Detection[]): Hand | null {
  'worklet';

  // The valid hand needs to have between 14 and 18 tiles, so we can rule out other cases early
  if (uniqueDetections.length < 14 || uniqueDetections.length > 18) return null;

  const tiles = uniqueDetections.map(detection => ({
    tileId: detectionClassToTileId[detection.class],
    x: 1 - detection.y,
    y: detection.x,
    width: detection.height,
    height: detection.width
  }));
  tiles.sort((a, b) => a.x - b.x);

  let avgTileWidth = 0;
  let avgTileHeight = 0;
  for (const tile of tiles) {
    avgTileWidth += tile.width;
    avgTileHeight += tile.height;
  }
  avgTileWidth /= tiles.length;
  avgTileHeight /= tiles.length;

  // Used to divide tiles into closed and open parts
  const xGapThreshold = avgTileWidth * 1.5;

  // Used to group open tiles into melds
  const yGapThreshold = avgTileHeight * 0.6;

  // Split tiles into closed and open parts
  const closedTiles = [tiles[0]];
  const openTiles = [];

  for (let i = 1; i < tiles.length; i++) {
    const prev = tiles[i - 1];
    const cur = tiles[i];

    if (openTiles.length > 0 || cur.x - prev.x > xGapThreshold) {
      openTiles.push(cur);
    } else {
      closedTiles.push(cur);
    }
  }

  // Group open tiles into melds
  const openMelds = [];
  if (openTiles.length > 0) {
    openTiles.sort((a, b) => a.y - b.y);

    openMelds.push([openTiles[0]]);
    for (let i = 1; i < openTiles.length; i++) {
      const prev = openTiles[i - 1];
      const cur = openTiles[i];

      if (cur.y - prev.y > yGapThreshold) {
        openMelds.push([cur]);
      } else {
        openMelds[openMelds.length - 1].push(cur);
      }
    }
  }

  // Construct the hand object
  const closedPart = closedTiles.map(({ tileId }) => tileId);
  const openPart = openMelds.map(meld => ({
    open: true,
    tiles: meld.map(({ tileId }) => tileId)
  }));
  const hand = { closedPart, openPart };

  // Validate the hand structure
  const isValid = isValidHand(hand);

  return isValid ? hand : null;
}
