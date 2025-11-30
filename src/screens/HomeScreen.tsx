import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, { css } from 'react-native-reanimated';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.titleContainer, styles.titleAnimation]}>
        <ThemedText type='title'>Home</ThemedText>
      </Animated.View>

      <Animated.View style={[styles.rotatingBox, styles.rotateAnimation]}>
        <ThemedText style={styles.rotatingText}>✨</ThemedText>
      </Animated.View>

      <Pressable style={styles.button}>
        {({ pressed }) => (
          <Animated.View
            style={[styles.buttonContent, pressed && styles.buttonPressed]}>
            <ThemedText style={styles.buttonText}>Tap Me!</ThemedText>
          </Animated.View>
        )}
      </Pressable>
    </ThemedView>
  );
}

const styles = css.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30
  },
  titleContainer: {
    alignItems: 'center'
  },
  titleAnimation: {
    animationName: {
      from: {
        opacity: 0,
        transform: [{ scale: 0.5 }, { translateY: -50 }]
      },
      to: {
        opacity: 1,
        transform: [{ scale: 1 }, { translateY: 0 }]
      }
    },
    animationDuration: '800ms',
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both'
  },
  rotatingBox: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rotateAnimation: {
    animationName: {
      from: { transform: [{ rotate: '0deg' }] },
      to: { transform: [{ rotate: '360deg' }] }
    },
    animationDuration: '2000ms',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite'
  },
  rotatingText: {
    fontSize: 40
  },
  button: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonContent: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    transform: [{ scale: 1 }],
    transitionProperty: 'transform',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out'
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }]
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});
