import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { conversations, getUser, type MockConversation } from '@/data/mock';
import { Fonts, Radius, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function ConversationRow({ conversation }: { conversation: MockConversation }) {
  const theme = useTheme();
  const peer = getUser(conversation.participantId);
  return (
    <Link href={`/inbox/${conversation.id}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Conversation with ${peer.displayName}`}
        style={({ pressed }) => [
          styles.row,
          { borderBottomColor: theme.line, opacity: pressed ? 0.8 : 1 },
        ]}>
        <Avatar name={peer.displayName} seed={peer.seed} size={52} />
        <View style={styles.texts}>
          <View style={styles.topLine}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {peer.displayName}
            </Text>
            <Text style={[styles.time, { color: theme.textSecondary }]}>{conversation.updatedAt}</Text>
          </View>
          <Text
            style={[
              styles.snippet,
              { color: conversation.unread > 0 ? theme.text : theme.textSecondary },
              conversation.unread > 0 && { fontWeight: '600' },
            ]}
            numberOfLines={2}>
            {conversation.lastMessage}
          </Text>
        </View>
        {conversation.unread > 0 ? (
          <View style={[styles.unread, { backgroundColor: theme.accent }]}>
            <Text style={[styles.unreadText, { color: theme.accentInk }]}>{conversation.unread}</Text>
          </View>
        ) : null}
      </Pressable>
    </Link>
  );
}

/**
 * Mock inbox. Conversations and messages are static local data;
 * sending appends to in-memory state only (see inbox/[id].tsx).
 */
export default function InboxScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <Text style={[styles.overline, { color: theme.accent }]}>INBOX</Text>
      <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif }]}>Messages</Text>
      <Text style={[styles.standfirst, { color: theme.textSecondary }]}>
        Share discoveries with friends. Mock conversations for now.
      </Text>

      <View style={[styles.list, { borderTopColor: theme.line, marginTop: Spacing.three }]}>
        {conversations.map((c) => (
          <ConversationRow key={c.id} conversation={c} />
        ))}
      </View>

      {conversations.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          body="When you share a post or collection with a friend, it will land here."
        />
      ) : null}

      <View style={[styles.note, { backgroundColor: theme.accentSoft, borderRadius: Radius.medium }]}>
        <Text style={[styles.noteText, { color: theme.textSecondary }]}>
          ✳ Mock shell — messages are local sample data, not real chat.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8, marginBottom: Spacing.one },
  title: { fontSize: 30, fontWeight: '600', letterSpacing: -0.5, marginBottom: Spacing.two },
  standfirst: { fontSize: 14, lineHeight: 21, maxWidth: 330 },
  list: { borderTopWidth: Rhythm.hairline },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: Rhythm.hairline,
  },
  texts: { flex: 1 },
  topLine: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 15, fontWeight: '700', flex: 1 },
  time: { fontSize: 12, marginLeft: Spacing.two },
  snippet: { fontSize: 13.5, lineHeight: 19 },
  unread: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { fontSize: 12, fontWeight: '700' },
  note: { padding: Spacing.three, marginTop: Spacing.five },
  noteText: { fontSize: 12.5, lineHeight: 19, textAlign: 'center' },
});
