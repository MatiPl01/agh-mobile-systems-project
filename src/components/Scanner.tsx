import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor
} from 'react-native-vision-camera';
import { useImageLabeler } from 'react-native-vision-camera-image-labeler';

export default function Scanner() {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  const { scanImage } = useImageLabeler({ minConfidence: 0.1 });

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const labels = scanImage(frame);

    if (labels.length > 0)
      console.log(`${labels[0].label} (${labels[0].confidence})`);
  }, []);

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
