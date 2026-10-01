import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { conversations, getMessages, getUser, ME_ID, type MockMessage } from '@/data/mock';
import { Radius, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function Bubble({ message, mine }: { message: MockMessage; mine: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.bubbleRow, mine ? styles.mineRow : styles.theirsRow]}>
      {!mine ? <Avatar name={getUser(message.senderId).displayName} seed={getUser(message.senderId).seed} size={28} /> : null}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: mine ? theme.text : theme.backgroundElement,
            borderBottomRightRadius: mine ? 4 : Radius.medium,
            borderBottomLeftRadius: mine ? Radius.medium : 4,
          },
        ]}>
        <Text style={[styles.bubbleText, { color: mine ? theme.background : theme.text }]}>
          {message.text}
        </Text>
        <Text style={[styles.bubbleTime, { color: mine ? theme.background : theme.textSecondary }]}>
          {message.createdAt}
        </Text>
      </View>
    </View>
  );
}

/**
 * Mock thread view. Sending a message appends it to in-memory state —
 * nothing is transmitted or stored.
 */
export default function ThreadScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversation = conversations.find((c) => c.id === id);
  const peer = conversation ? getUser(conversation.participantId) : null;

  const [draft, setDraft] = useState('');
  const [local, setLocal] = useState<MockMessage[]>([]);

  if (!conversation || !peer) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <Text style={{ color: theme.textSecondary, padding: Spacing.four }}>
          Conversation not found.
        </Text>
      </View>
    );
  }

  const all = [...getMessages(conversation.id), ...local];

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setLocal((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        conversationId: conversation.id,
        senderId: ME_ID,
        text,
        createdAt: 'now',
      },
    ]);
    setDraft('');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: peer.displayName, headerBackTitle: 'Inbox' }} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 44}>
        <FlatList
          data={all}
          keyExtractor={(m) => m.id}
          contentContainerStyle={[styles.list, { paddingTop: insets.top + Spacing.three }]}
          renderItem={({ item }) => <Bubble message={item} mine={item.senderId === ME_ID} />}
        />
        <View
          style={[
            styles.composer,
            {
              borderTopColor: theme.line,
              backgroundColor: theme.background,
              paddingBottom: Math.max(insets.bottom, Spacing.two),
            },
          ]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={`Message ${peer.displayName.split(' ')[0]}… (mock)`}
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.backgroundElement },
            ]}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={[
              styles.sendBtn,
              { backgroundColor: draft.trim() ? theme.accent : theme.backgroundElement },
            ]}>
            <Text style={[styles.sendText, { color: draft.trim() ? theme.accentInk : theme.textSecondary }]}>
              ↑
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  list: { paddingHorizontal: Spacing.three, gap: Spacing.two + 2, flexGrow: 1 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two, maxWidth: '86%' },
  mineRow: { alignSelf: 'flex-end' },
  theirsRow: { alignSelf: 'flex-start' },
  bubble: { paddingVertical: Spacing.two + 2, paddingHorizontal: Spacing.three, borderRadius: Radius.medium },
  bubbleText: { fontSize: 14.5, lineHeight: 21 },
  bubbleTime: { fontSize: 10.5, marginTop: 4, opacity: 0.7, alignSelf: 'flex-end' },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: Rhythm.hairline,
  },
  input: { flex: 1, borderRadius: Radius.pill, paddingVertical: Spacing.two + 2, paddingHorizontal: Spacing.three + 2, fontSize: 14.5 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendText: { fontSize: 20, fontWeight: '700' },
});
