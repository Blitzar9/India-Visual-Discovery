import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { MockPlace } from '@/data/mock';
import { Fonts, Radius, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Artwork } from './Artwork';

/** Compact horizontal place row with an artwork thumb. */
export function PlaceCard({ place, onPress }: { place: MockPlace; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${place.name}, ${place.city}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.line,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <Artwork seed={place.seed} aspectRatio={1} radius={Radius.medium} style={styles.thumb} />
      <View style={styles.texts}>
        <Text style={[styles.name, { color: theme.text, fontFamily: Fonts.serif }]} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]} numberOfLines={1}>
          {place.city} · {place.category}
        </Text>
        <Text style={[styles.count, { color: theme.accent }]}>
          {place.postCount} posts
        </Text>
      </View>
      <Text style={[styles.chev, { color: theme.textSecondary }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: Rhythm.hairline,
    borderRadius: Radius.large,
    padding: Spacing.two + 2,
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  thumb: { width: 76, flexShrink: 0 },
  texts: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', marginBottom: 2 },
  sub: { fontSize: 12.5, marginBottom: Spacing.one },
  count: { fontSize: 12, fontWeight: '700' },
  chev: { fontSize: 26, paddingRight: Spacing.two },
});
