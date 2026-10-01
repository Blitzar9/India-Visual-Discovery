import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Calm empty state with a serif headline. */
export function EmptyState({ title, body }: { title: string; body: string }) {
  const theme = useTheme();
  return (
    <View style={styles.base}>
      <View style={[styles.mark, { backgroundColor: theme.accentSoft }]}>
        <Text style={[styles.markText, { color: theme.accent }]}>✳</Text>
      </View>
      <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', paddingVertical: Spacing.six, paddingHorizontal: Spacing.five },
  mark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  markText: { fontSize: 24 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: Spacing.two, textAlign: 'center' },
  body: { fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
