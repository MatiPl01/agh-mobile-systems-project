type Detection = {
  x: number;
  y: number;
  width: number;
  height: number;
  class: number;
  confidence: number;
};

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
