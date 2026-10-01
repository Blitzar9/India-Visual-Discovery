import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Artwork } from '@/components/Artwork';
import { Avatar } from '@/components/Avatar';
import { EmptyState } from '@/components/EmptyState';
import { PlaceCard } from '@/components/PlaceCard';
import { PostCard } from '@/components/PostCard';
import { Screen } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { getUser, interests, places, posts, users } from '@/data/mock';
import { Fonts, Radius, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CATEGORY_BLURBS: Record<string, string> = {
  'Cafés': 'Slow mornings, strong brews',
  'Weekend trips': 'Leave Saturday, back Sunday',
  'Street food': 'Chaat o’clock, everywhere',
  'Textiles & craft': 'Made by hand, worn with pride',
  Architecture: 'Old stones, new eyes',
  Photography: 'Light, found',
  'College fits': 'Thrift-first style',
  'Neighbourhood gems': 'Your street, rediscovered',
};

function CategoryTile({ title, index }: { title: string; index: number }) {
  const theme = useTheme();
  const count = posts.filter((p) => p.interests.includes(title)).length;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${count} posts`}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: theme.card,
          borderColor: theme.line,
          opacity: pressed ? 0.85 : 1,
          // Subtle asymmetry: alternate tiles sit slightly lower.
          marginTop: index % 2 === 1 ? Spacing.four : 0,
        },
      ]}>
      <Artwork seed={`cat-${title}`} aspectRatio={1.25} radius={Radius.medium} />
      <Text style={[styles.tileTitle, { color: theme.text, fontFamily: Fonts.serif }]}>{title}</Text>
      <Text style={[styles.tileSub, { color: theme.textSecondary }]} numberOfLines={1}>
        {CATEGORY_BLURBS[title] ?? ''}
      </Text>
      <Text style={[styles.tileCount, { color: theme.accent }]}>{count} posts</Text>
    </Pressable>
  );
}

function CreatorRow({ userId }: { userId: string }) {
  const theme = useTheme();
  const user = getUser(userId);
  const [following, setFollowing] = useState(false);
  return (
    <View style={[styles.creator, { borderBottomColor: theme.line }]}>
      <Avatar name={user.displayName} seed={user.seed} size={46} />
      <View style={styles.creatorTexts}>
        <Text style={[styles.creatorName, { color: theme.text }]}>{user.displayName}</Text>
        <Text style={[styles.creatorSub, { color: theme.textSecondary }]} numberOfLines={1}>
          {user.city} · {user.interests.slice(0, 2).join(', ')}
        </Text>
      </View>
      <Pressable
        onPress={() => setFollowing((f) => !f)}
        accessibilityRole="button"
        accessibilityLabel={following ? `Unfollow ${user.displayName}` : `Follow ${user.displayName}`}
        style={[
          styles.followBtn,
          {
            backgroundColor: following ? theme.backgroundElement : theme.text,
            borderColor: theme.line,
          },
        ]}>
        <Text
          style={[
            styles.followText,
            { color: following ? theme.text : theme.background },
            following && { fontWeight: '700' },
          ]}>
          {following ? 'Following' : 'Follow'}
        </Text>
      </Pressable>
    </View>
  );
}

export default function ExploreScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const matchedPlaces = useMemo(
    () =>
      q
        ? places.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.city.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q),
          )
        : places,
    [q],
  );
  const matchedPosts = useMemo(
    () =>
      q
        ? posts.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.excerpt.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q)),
          )
        : [],
    [q],
  );

  return (
    <Screen>
      <Text style={[styles.overline, { color: theme.accent }]}>EXPLORE</Text>
      <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif }]}>
        What can you discover?
      </Text>

      <View style={styles.searchWrap}>
        <SearchBar value={query} onChange={setQuery} />
      </View>

      {q ? (
        <View>
          <SectionHeader overline="Results" title={`For “${query.trim()}”`} />
          {matchedPlaces.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
          {matchedPosts.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} />
          ))}
          {matchedPlaces.length === 0 && matchedPosts.length === 0 ? (
            <EmptyState
              title="Nothing found"
              body="Try a place, a craving, or an interest — “café”, “Jaipur”, “thrift”."
            />
          ) : null}
        </View>
      ) : (
        <View>
          <SectionHeader overline="Browse" title="Wander by interest" />
          <View style={styles.tileGrid}>
            {interests.map((item, index) => (
              <View key={item} style={styles.tileCell}>
                <CategoryTile title={item} index={index} />
              </View>
            ))}
          </View>

          <SectionHeader overline="Places" title="Trending this week" />
          {places.slice(0, 4).map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}

          <SectionHeader overline="People" title="Creators to follow" />
          <View style={[styles.creatorList, { borderTopColor: theme.line }]}>
            {users
              .filter((u) => u.id !== 'u-me')
              .slice(0, 4)
              .map((u) => (
                <CreatorRow key={u.id} userId={u.id} />
              ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8, marginBottom: Spacing.one },
  title: { fontSize: 30, fontWeight: '600', letterSpacing: -0.5, marginBottom: Spacing.three },
  searchWrap: { marginBottom: Spacing.two },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three, marginBottom: Spacing.three },
  tileCell: { width: '48%', flexGrow: 1 },
  tile: {
    flex: 1,
    borderWidth: Rhythm.hairline,
    borderRadius: Radius.large,
    padding: Spacing.three,
  },
  tileTitle: { fontSize: 16, fontWeight: '600', marginTop: Spacing.two },
  tileSub: { fontSize: 12, marginTop: 2 },
  tileCount: { fontSize: 11.5, fontWeight: '700', marginTop: Spacing.two },
  creatorList: { borderTopWidth: Rhythm.hairline },
  creator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: Rhythm.hairline,
  },
  creatorTexts: { flex: 1 },
  creatorName: { fontSize: 15, fontWeight: '600' },
  creatorSub: { fontSize: 12.5, marginTop: 2 },
  followBtn: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: Rhythm.hairline,
  },
  followText: { fontSize: 13, fontWeight: '600' },
});
