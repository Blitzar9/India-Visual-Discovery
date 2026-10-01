import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Editorial section header: small overline + serif title, deliberately
 * left-weighted (asymmetric) with generous air above.
 */
export function SectionHeader({
  overline,
  title,
  action,
}: {
  overline?: string;
  title: string;
  action?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={styles.base}>
      <View style={styles.texts}>
        {overline ? (
          <Text style={[styles.overline, { color: theme.accent }]}>{overline.toUpperCase()}</Text>
        ) : null}
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif }]}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: Rhythm.sectionGap,
    marginBottom: Spacing.three,
  },
  texts: { flex: 1, paddingRight: Spacing.four },
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 1.6, marginBottom: Spacing.one },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '600' },
});
