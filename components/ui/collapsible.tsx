import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({
  children,
  title
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.heading}
        onPress={() => setIsOpen(value => !value)}>
        <IconSymbol
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          name='chevron.right'
          size={18}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
          weight='medium'
        />

        <ThemedText type='defaultSemiBold'>{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    marginLeft: 24,
    marginTop: 6
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6
  }
});
