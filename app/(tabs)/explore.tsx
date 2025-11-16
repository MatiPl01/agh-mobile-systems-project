import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const takePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera not ready');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false
      });

      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture');
      console.error('Error taking picture:', error);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const resetCamera = () => {
    setCapturedPhoto(null);
  };

  if (!permission) {
    return (
      <ThemedView
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom }
        ]}>
        <View style={styles.centeredContent}>
          <ThemedText>Requesting camera permission...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom }
        ]}>
        <View style={styles.centeredContent}>
          <ThemedText type='title' style={styles.message}>
            Camera Permission Required
          </ThemedText>
          <ThemedText style={styles.message}>
            We need access to your camera to scan Mahjong tiles and score
            sheets.
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].tint
              }
            ]}
            onPress={requestPermission}>
            <ThemedText
              style={[
                styles.buttonText,
                {
                  color:
                    colorScheme === 'dark' ? Colors.dark.background : '#fff'
                }
              ]}>
              Grant Permission
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  if (capturedPhoto) {
    return (
      <ThemedView
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom }
        ]}>
        <View style={styles.previewContainer}>
          <ThemedText type='title' style={styles.title}>
            Photo Captured
          </ThemedText>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: capturedPhoto }}
              style={styles.previewImage}
              contentFit='contain'
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: Colors[colorScheme ?? 'light'].tint
                }
              ]}
              onPress={resetCamera}>
              <ThemedText
                style={[
                  styles.buttonText,
                  {
                    color:
                      colorScheme === 'dark' ? Colors.dark.background : '#fff'
                  }
                ]}>
                Take Another
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode='picture'
      />
      <View style={styles.overlay}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <ThemedText type='title' style={styles.headerText}>
            Mahjong Scanner
          </ThemedText>
          <ThemedText style={styles.headerSubtext}>
            Point your camera at Mahjong tiles or score sheet
          </ThemedText>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame} />
        </View>

        <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraFacing}>
            <IconSymbol
              name='arrow.triangle.2.circlepath.camera.fill'
              size={32}
              color='#fff'
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={styles.controlButton} />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  imageContainer: {
    width: '100%',
    maxHeight: '60%',
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    minHeight: 300
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  headerText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8
  },
  headerSubtext: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.9
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  scanFrame: {
    width: '80%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    backgroundColor: 'transparent'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff'
  },
  title: {
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20
  },
  note: {
    marginTop: 30,
    paddingHorizontal: 20,
    textAlign: 'center',
    opacity: 0.6,
    fontSize: 14
  }
});
