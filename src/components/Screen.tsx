import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Standard screen wrapper: safe-area aware, max-width constrained,
 * generous editorial padding. Use `scroll` for long content.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  style,
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: object;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        styles.inner,
        padded && { paddingHorizontal: Rhythm.page },
        { paddingTop: insets.top + Spacing.three },
        style,
      ]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
            alignItems: 'center',
          }}>
          {content}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            paddingBottom: insets.bottom,
            alignItems: 'center',
          }}>
          {content}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  inner: { width: '100%', maxWidth: MaxContentWidth },
});
