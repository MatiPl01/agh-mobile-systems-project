import { useTensorflowModelInstance } from '@/providers/TensorflowModelProvider';
import { Hand } from '@/types/hand';
import {
  getDetectedHand,
  getDetectionsFromTensor,
  nonMaxSuppression
} from '@/utils/scanner-utils';
import { PaintStyle, Skia } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useSkiaFrameProcessor
} from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { useResizePlugin } from 'vision-camera-resize-plugin';

type ScannerProps = {
  onHandDetected: (hand: Hand) => void;
};

export default function Scanner({ onHandDetected }: ScannerProps) {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const format = useCameraFormat(device, [
    { videoAspectRatio: 16 / 9 },
    { videoResolution: { width: 1920, height: 1080 } }
  ]);

  const plugin = useTensorflowModelInstance();

  const { resize } = useResizePlugin();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const handleHandDetected = Worklets.createRunOnJS((hand: Hand) => {
    onHandDetected(hand);
  });

  const frameProcessor = useSkiaFrameProcessor(
    frame => {
      'worklet';
      if (!plugin || !resize || plugin.state !== 'loaded') return;

      const resized = resize(frame, {
        scale: { width: 640, height: 640 },
        pixelFormat: 'rgb',
        dataType: 'float32'
      });

      const outputTensor = plugin.model.runSync([resized]);
      const detections = getDetectionsFromTensor(outputTensor, 8400);
      const uniqueDetections = nonMaxSuppression(detections, 0.5, 0.5);

      // console.log(`Received ${outputTensor.length} outputs`);
      // console.log(`Unique detections: ${JSON.stringify(uniqueDetections)}`);

      const detectedHand = getDetectedHand(uniqueDetections);

      // If a valid hand is detected, call the callback to save it
      if (detectedHand !== null) handleHandDetected(detectedHand);

      const frameWidth = frame.width;
      const frameHeight = frame.height;

      // Render the underlying camera frame so we can draw on top of it
      frame.render();

      for (const detection of uniqueDetections) {
        const paint = Skia.Paint();

        paint.setStyle(PaintStyle.Stroke);
        paint.setStrokeWidth(10);

        // Green if a valid hand is detected, red otherwise
        paint.setColor(
          detectedHand !== null ? Skia.Color('green') : Skia.Color('red')
        );

        // The frame was resized to 640x640 and a center crop was applied,
        // so we need to adjust the coordinates to draw on the original frame
        const ratio = frameWidth / frameHeight;
        const rect = Skia.XYWHRect(
          (0.5 + (detection.x - detection.width / 2 - 0.5) / ratio) *
            frameWidth,
          (detection.y - detection.height / 2) * frameHeight,
          (detection.width / ratio) * frameWidth,
          detection.height * frameHeight
        );

        frame.drawRect(rect, paint);
      }
    },
    [plugin, resize]
  );

  if (!hasPermission) return <Text>No camera permission granted.</Text>;

  if (!device) return <Text>No camera device found.</Text>;

  return (
    <Camera
      frameProcessor={frameProcessor}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      format={format}
    />
  );
}
