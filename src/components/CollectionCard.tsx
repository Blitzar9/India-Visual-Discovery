import { StyleSheet, Text, View } from 'react-native';

import type { MockCollection } from '@/data/mock';
import { Fonts, Radius, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Artwork } from './Artwork';

/**
 * Collection card with a stacked-cover visual — the "organize" primitive
 * of the product loop, given a distinct stacked-paper look.
 */
export function CollectionCard({ collection }: { collection: MockCollection }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.line },
      ]}>
      <View style={styles.stack}>
        <View
          style={[
            styles.stackLayer,
            { backgroundColor: theme.backgroundElement, transform: [{ rotate: '-4deg' }] },
          ]}
        />
        <View
          style={[
            styles.stackLayer,
            { backgroundColor: theme.backgroundSelected, transform: [{ rotate: '3deg' }] },
          ]}
        />
        <Artwork seed={collection.seed} aspectRatio={1.35} radius={Radius.medium} />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif }]} numberOfLines={1}>
          {collection.title}
        </Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]} numberOfLines={2}>
          {collection.description}
        </Text>
        <Text style={[styles.meta, { color: theme.accent }]}>
          {collection.postCount} saved{collection.isPublic ? '' : ' · Private'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderWidth: Rhythm.hairline,
    borderRadius: Radius.large,
    padding: Spacing.three,
    marginRight: Spacing.three,
  },
  stack: { position: 'relative', marginBottom: Spacing.three },
  stackLayer: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    borderRadius: Radius.medium,
  },
  texts: {},
  title: { fontSize: 17, fontWeight: '600', marginBottom: 2 },
  sub: { fontSize: 12.5, lineHeight: 18, marginBottom: Spacing.two },
  meta: { fontSize: 12, fontWeight: '700' },
});
