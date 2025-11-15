import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        animationDuration: '300ms',
        animationIterationCount: 4,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] }
        },
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6
      }}>
      👋
    </Animated.Text>
  );
}
