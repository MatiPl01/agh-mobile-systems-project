import {
  getDetectionsFromTensor,
  nonMaxSuppression
} from '@/utils/scanner-utils';
import { PaintStyle, Skia } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Platform, Text } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { StyleSheet } from 'react-native-unistyles';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useSkiaFrameProcessor
} from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';

export default function Scanner() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const delegate = Platform.OS === 'ios' ? 'core-ml' : undefined;
  const plugin = useTensorflowModel(require('@/assets/model.tflite'), delegate);

  const { resize } = useResizePlugin();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

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

      console.log(`Received ${outputTensor.length} outputs`);

      const detections = getDetectionsFromTensor(outputTensor, 8400);
      const uniqueDetections = nonMaxSuppression(detections, 0.5, 0.5);

      console.log(`Unique detections: ${JSON.stringify(uniqueDetections)}`);

      const frameWidth = frame.width;
      const frameHeight = frame.height;

      frame.render();

      console.log(`Frame dimensions: ${frameWidth}x${frameHeight}`);
      for (const detection of uniqueDetections) {
        const paint = Skia.Paint();
        paint.setStyle(PaintStyle.Stroke);
        paint.setStrokeWidth(10);
        paint.setColor(Skia.Color('red'));
        const ratio = frameWidth / frameHeight;
        const rect = Skia.XYWHRect(
          (0.5 + (detection.x - detection.width / 2 - 0.5) / ratio) *
            frameWidth,
          (detection.y - detection.height / 2) * frameHeight,
          (detection.width / ratio) * frameWidth,
          detection.height * frameHeight
        );
        frame.drawRect(rect, paint);
        // frame.drawRect(
        //   (0.5 + (detection.x - 0.5) / ratio) * frameWidth,
        //   detection.y * frameHeight,
        //   10,
        //   paint
        // );
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
    />
  );
}
