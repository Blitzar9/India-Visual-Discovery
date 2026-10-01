import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Artwork } from '@/components/Artwork';
import { Avatar } from '@/components/Avatar';
import { Chip } from '@/components/Chip';
import { CollectionCard } from '@/components/CollectionCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { collections, getUser, ME_ID, posts } from '@/data/mock';
import { Fonts, Radius, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PROFILE_TABS = ['Posts', 'Collections', 'About'] as const;

function Stat({ value, label }: { value: number | string; label: string }) {
  const theme = useTheme();
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: theme.text, fontFamily: Fonts.serif }]}>
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </Text>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const me = getUser(ME_ID);
  const [tab, setTab] = useState<(typeof PROFILE_TABS)[number]>('Posts');
  const myPosts = posts.filter((p) => p.authorId === ME_ID);

  return (
    <Screen>
      {/* Identity */}
      <View style={styles.identity}>
        <Avatar name={me.displayName} seed={me.seed} size={84} />
        <Text style={[styles.name, { color: theme.text, fontFamily: Fonts.serif }]}>
          {me.displayName}
        </Text>
        <Text style={[styles.username, { color: theme.textSecondary }]}>@{me.username}</Text>
        <Text style={[styles.bio, { color: theme.textSecondary }]}>{me.bio}</Text>
        <View style={styles.interestRow}>
          {me.interests.map((i) => (
            <Chip key={i} label={i} />
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.stats, { borderTopColor: theme.line, borderBottomColor: theme.line }]}>
        <Stat value={myPosts.length} label="Posts" />
        <Stat value={me.followers} label="Followers" />
        <Stat value={me.following} label="Following" />
        <Stat value={collections.length} label="Collections" />
      </View>

      {/* Actions (mock) */}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          style={[styles.actionBtn, { backgroundColor: theme.text }]}>
          <Text style={[styles.actionText, { color: theme.background }]}>Edit profile</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.actionBtn, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.actionText, { color: theme.text }]}>Share</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {PROFILE_TABS.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            style={[styles.tab, tab === t && { borderBottomColor: theme.accent, borderBottomWidth: 2 }]}>
            <Text
              style={[
                styles.tabText,
                { color: tab === t ? theme.text : theme.textSecondary },
                tab === t && { fontWeight: '700' },
              ]}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === 'Posts' ? (
        <View style={styles.grid}>
          {(myPosts.length > 0 ? myPosts : posts.slice(0, 4)).map((item) => (
            <View key={item.id} style={styles.gridCell}>
              <Artwork seed={item.seed} aspectRatio={1} radius={Radius.medium} />
              <Text style={[styles.gridTitle, { color: theme.text }]} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {tab === 'Collections' ? (
        <View>
          <SectionHeader overline="Saved" title="Your collections" />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={collections}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => <CollectionCard collection={item} />}
          />
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Collections keep your saves organized around a plan — a trip, a move, a season.
          </Text>
        </View>
      ) : null}

      {tab === 'About' ? (
        <View style={[styles.about, { backgroundColor: theme.card, borderColor: theme.line }]}>
          <AboutRow label="City" value={me.city} />
          <AboutRow label="Interests" value={me.interests.join(' · ')} />
          <AboutRow label="Member since" value="October 2026 (mock)" />
        </View>
      ) : null}
    </Screen>
  );
}

function AboutRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.aboutRow, { borderBottomColor: theme.line }]}>
      <Text style={[styles.aboutLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.aboutValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', paddingTop: Spacing.two },
  name: { fontSize: 28, fontWeight: '600', marginTop: Spacing.three, letterSpacing: -0.4 },
  username: { fontSize: 14, marginTop: 2 },
  bio: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: Spacing.two, maxWidth: 300 },
  interestRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: Spacing.three },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: Rhythm.hairline,
    borderBottomWidth: Rhythm.hairline,
    marginTop: Spacing.four,
    paddingVertical: Spacing.three,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '600' },
  statLabel: { fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four },
  actionBtn: { flex: 1, borderRadius: Radius.pill, paddingVertical: Spacing.two + 4, alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '700' },
  tabRow: { flexDirection: 'row', marginTop: Spacing.four, marginBottom: Spacing.three },
  tab: { flex: 1, alignItems: 'center', paddingVertical: Spacing.two + 2 },
  tabText: { fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  gridCell: { width: '48%', flexGrow: 1 },
  gridTitle: { fontSize: 13, lineHeight: 18, marginTop: Spacing.two, fontWeight: '500' },
  hint: { fontSize: 13, lineHeight: 20, marginTop: Spacing.four, fontStyle: 'italic' },
  about: { borderWidth: Rhythm.hairline, borderRadius: Radius.large, padding: Spacing.three, marginTop: Spacing.two },
  aboutRow: { paddingVertical: Spacing.two + 2, borderBottomWidth: Rhythm.hairline },
  aboutLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  aboutValue: { fontSize: 15 },
});
