import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: '#1D3D47', light: '#A1CEDC' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{' '}
          <ThemedText type='defaultSemiBold'>app/(tabs)/index.tsx</ThemedText>{' '}
          to see changes. Press{' '}
          <ThemedText type='defaultSemiBold'>
            {Platform.select({
              android: 'cmd + m',
              ios: 'cmd + d',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href='/modal'>
          <Link.Trigger>
            <ThemedText type='subtitle'>Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction
              icon='cube'
              title='Action'
              onPress={() => alert('Action pressed')}
            />
            <Link.MenuAction
              icon='square.and.arrow.up'
              title='Share'
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu icon='ellipsis' title='More'>
              <Link.MenuAction
                icon='trash'
                title='Delete'
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type='defaultSemiBold'>
            npm run reset-project
          </ThemedText>{' '}
          to get a fresh <ThemedText type='defaultSemiBold'>app</ThemedText>{' '}
          directory. This will move the current{' '}
          <ThemedText type='defaultSemiBold'>app</ThemedText> to{' '}
          <ThemedText type='defaultSemiBold'>app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    bottom: 0,
    height: 178,
    left: 0,
    position: 'absolute',
    width: 290
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  }
});
