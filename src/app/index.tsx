import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { Avatar } from '@/components/Avatar';
import { Chip } from '@/components/Chip';
import { CollectionCard } from '@/components/CollectionCard';
import { PostCard } from '@/components/PostCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { collections, getUser, interests, ME_ID, posts } from '@/data/mock';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const theme = useTheme();
  const me = getUser(ME_ID);
  const [interest, setInterest] = useState<string | null>(null);

  const filtered = useMemo(
    () => (interest ? posts.filter((p) => p.interests.includes(interest)) : posts),
    [interest],
  );
  const [featured, ...rest] = filtered;

  return (
    <Screen>
      {/* Masthead */}
      <View style={styles.masthead}>
        <View>
          <Text style={[styles.overline, { color: theme.accent }]}>{greeting().toUpperCase()}</Text>
          <Text style={[styles.brand, { color: theme.text, fontFamily: Fonts.serif }]}>
            Visual Discovery
          </Text>
        </View>
        <Link href="/profile" asChild>
          <Pressable accessibilityLabel="Open your profile">
            <Avatar name={me.displayName} seed={me.seed} size={44} />
          </Pressable>
        </Link>
      </View>

      <Text style={[styles.standfirst, { color: theme.textSecondary }]}>
        Ideas, places and experiences from people across India — save what moves you.
      </Text>

      {/* Interest filter */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[null, ...interests]}
        keyExtractor={(i) => i ?? 'all'}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => (
          <Chip
            label={item ?? 'Everything'}
            selected={interest === item}
            onPress={() => setInterest(item)}
          />
        )}
      />

      {/* Featured story */}
      {featured ? (
        <View>
          <SectionHeader overline="Featured" title="Worth your time" />
          <PostCard post={featured} featured />
        </View>
      ) : null}

      {/* Collections strip — the organize step of the loop */}
      <SectionHeader overline="Organize" title="Collections to start" />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={collections}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.collections}
        renderItem={({ item }) => <CollectionCard collection={item} />}
      />

      {/* The feed */}
      <SectionHeader
        overline="Fresh"
        title={interest ? `In ${interest}` : 'From people you follow'}
      />
      {rest.map((post, i) => (
        <PostCard key={post.id} post={post} index={i + 1} />
      ))}

      <Text style={[styles.endMark, { color: theme.textSecondary }]}>
        That’s everything for now. Go outside. ✳
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8, marginBottom: Spacing.one },
  brand: { fontSize: 30, fontWeight: '600', letterSpacing: -0.5 },
  standfirst: { fontSize: 14, lineHeight: 21, marginBottom: Spacing.four, maxWidth: 320 },
  chips: { paddingVertical: Spacing.two },
  collections: { paddingRight: Spacing.four },
  endMark: { textAlign: 'center', fontSize: 13, marginTop: Spacing.four, fontStyle: 'italic' },
});
