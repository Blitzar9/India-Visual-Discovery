import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { getPlace, getUser, type MockPost } from '@/data/mock';
import { Fonts, Radius, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Artwork } from './Artwork';
import { Avatar } from './Avatar';

const KIND_LABEL: Record<MockPost['kind'], string> = {
  photo: 'Photo',
  carousel: 'Carousel',
  video: 'Video',
  text: 'Note',
};

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

/**
 * Editorial post card: generous whitespace, serif headline, quiet meta row.
 * Deliberately not a social-media tile — it reads like a journal entry.
 */
export function PostCard({
  post,
  index = 0,
  featured = false,
}: {
  post: MockPost;
  index?: number;
  featured?: boolean;
}) {
  const theme = useTheme();
  const author = getUser(post.authorId);
  const place = post.placeId ? getPlace(post.placeId) : undefined;
  const [saved, setSaved] = useState(false);

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 70).duration(420)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={post.title}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.line,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
          featured && styles.featured,
        ]}>
        <View style={styles.artWrap}>
          <Artwork seed={post.seed} aspectRatio={featured ? 1.618 : 1.5} radius={Radius.large} />
          <View style={[styles.kindBadge, { backgroundColor: theme.background }]}>
            <Text style={[styles.kindText, { color: theme.textSecondary }]}>
              {KIND_LABEL[post.kind]}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text
            style={[
              styles.title,
              { color: theme.text, fontFamily: Fonts.serif },
              featured && styles.featuredTitle,
            ]}>
            {post.title}
          </Text>
          <Text style={[styles.excerpt, { color: theme.textSecondary }]} numberOfLines={3}>
            {post.excerpt}
          </Text>

          <View style={styles.meta}>
            <Avatar name={author.displayName} seed={author.seed} size={28} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]} numberOfLines={1}>
              {author.displayName} · {post.createdAt}
              {place ? ` · ${place.name}` : ''}
            </Text>
          </View>

          <View style={[styles.actions, { borderTopColor: theme.line }]}>
            <Pressable
              onPress={() => setSaved((s) => !s)}
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Remove from saved' : 'Save this post'}
              style={({ pressed }) => [
                styles.saveBtn,
                {
                  backgroundColor: saved ? theme.text : theme.accentSoft,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}>
              <Text
                style={[
                  styles.saveText,
                  { color: saved ? theme.background : theme.accent },
                  saved && { fontWeight: '700' },
                ]}>
                {saved ? '✓ Saved' : '+ Save'}
              </Text>
            </Pressable>
            <Text style={[styles.counts, { color: theme.textSecondary }]}>
              {formatCount(post.likes)} likes · {post.comments} comments
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: Rhythm.hairline,
    borderRadius: Radius.large,
    overflow: 'hidden',
    marginBottom: Rhythm.cardGap,
  },
  featured: {
    // Featured card breathes: no border, artwork carries it.
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  artWrap: { position: 'relative' },
  kindBadge: {
    position: 'absolute',
    top: Spacing.three,
    left: Spacing.three,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Radius.pill,
    opacity: 0.94,
  },
  kindText: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  body: { padding: Spacing.four },
  title: { fontSize: 21, lineHeight: 27, fontWeight: '600', marginBottom: Spacing.two },
  featuredTitle: { fontSize: 27, lineHeight: 34 },
  excerpt: { fontSize: 14, lineHeight: 21, marginBottom: Spacing.three },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three },
  metaText: { fontSize: 12.5, flex: 1 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: Rhythm.hairline,
    paddingTop: Spacing.three,
  },
  saveBtn: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Radius.pill },
  saveText: { fontSize: 13, fontWeight: '600' },
  counts: { fontSize: 12.5 },
});
