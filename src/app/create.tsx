import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Artwork } from '@/components/Artwork';
import { places } from '@/data/mock';
import { Fonts, Radius, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const POST_TYPES = ['Photo', 'Carousel', 'Video', 'Note'] as const;

/**
 * Mock creation flow. Everything stays on-device: no media picker wiring,
 * no uploads, no backend. Publishing shows a local confirmation state.
 */
export default function CreateScreen() {
  const theme = useTheme();
  const [kind, setKind] = useState<(typeof POST_TYPES)[number]>('Photo');
  const [caption, setCaption] = useState('');
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);

  const canPublish = caption.trim().length > 0;

  if (published) {
    return (
      <Screen scroll={false}>
        <View style={styles.doneWrap}>
          <View style={[styles.doneMark, { backgroundColor: theme.accentSoft }]}>
            <Text style={[styles.doneGlyph, { color: theme.accent }]}>✓</Text>
          </View>
          <Text style={[styles.doneTitle, { color: theme.text, fontFamily: Fonts.serif }]}>
            Saved as a draft
          </Text>
          <Text style={[styles.doneBody, { color: theme.textSecondary }]}>
            This is a mock shell — your {kind.toLowerCase()} post stays on this device. Real
            publishing, media storage and sharing arrive with the backend.
          </Text>
          <Pressable
            onPress={() => {
              setPublished(false);
              setCaption('');
              setPlaceId(null);
              setTags('');
            }}
            style={[styles.primaryBtn, { backgroundColor: theme.text }]}>
            <Text style={[styles.primaryText, { color: theme.background }]}>Create another</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={[styles.overline, { color: theme.accent }]}>CREATE</Text>
      <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif }]}>
        Share a discovery
      </Text>
      <Text style={[styles.standfirst, { color: theme.textSecondary }]}>
        A place, an idea, a find — show people what it looks like out there.
      </Text>

      <SectionHeader overline="Format" title="What are you posting?" />
      <View style={styles.chipRow}>
        {POST_TYPES.map((t) => (
          <Chip key={t} label={t} selected={kind === t} onPress={() => setKind(t)} />
        ))}
      </View>

      <SectionHeader overline="Visual" title="Your media" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add photos (mock)"
        style={[styles.mediaDrop, { borderColor: theme.line, backgroundColor: theme.card }]}>
        <Artwork seed={`draft-${kind}`} aspectRatio={1.618} radius={Radius.medium} />
        <View style={styles.mediaHint}>
          <Text style={[styles.mediaHintTitle, { color: theme.text }]}>+ Add photos</Text>
          <Text style={[styles.mediaHintSub, { color: theme.textSecondary }]}>
            Mock only — no files leave your device
          </Text>
        </View>
      </Pressable>

      <SectionHeader overline="Words" title="Tell the story" />
      <TextInput
        value={caption}
        onChangeText={setCaption}
        placeholder="What should people know? Where is it, what did it cost, when should they go…"
        placeholderTextColor={theme.textSecondary}
        multiline
        style={[
          styles.input,
          styles.captionInput,
          {
            color: theme.text,
            backgroundColor: theme.card,
            borderColor: theme.line,
            fontFamily: Fonts.serif,
          },
        ]}
      />

      <SectionHeader overline="Place" title="Where is this?" />
      <View style={styles.chipRowWrap}>
        {places.map((p) => (
          <View key={p.id} style={styles.chipPad}>
            <Chip label={`${p.name}`} selected={placeId === p.id} onPress={() => setPlaceId(placeId === p.id ? null : p.id)} />
          </View>
        ))}
      </View>

      <SectionHeader overline="Tags" title="Help people find it" />
      <TextInput
        value={tags}
        onChangeText={setTags}
        placeholder="jaipur, heritage, morninglight"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.line }]}
      />

      <Pressable
        disabled={!canPublish}
        onPress={() => setPublished(true)}
        accessibilityRole="button"
        style={[
          styles.primaryBtn,
          { backgroundColor: canPublish ? theme.accent : theme.backgroundElement, marginTop: Spacing.five },
        ]}>
        <Text style={[styles.primaryText, { color: canPublish ? theme.accentInk : theme.textSecondary }]}>
          Save draft
        </Text>
      </Pressable>
      <Text style={[styles.finePrint, { color: theme.textSecondary }]}>
        Mock shell — nothing is uploaded or shared.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8, marginBottom: Spacing.one },
  title: { fontSize: 30, fontWeight: '600', letterSpacing: -0.5, marginBottom: Spacing.two },
  standfirst: { fontSize: 14, lineHeight: 21, marginBottom: Spacing.two, maxWidth: 330 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chipRowWrap: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  chipPad: { padding: 4 },
  mediaDrop: { borderWidth: Rhythm.hairline, borderRadius: Radius.large, padding: Spacing.three },
  mediaHint: { alignItems: 'center', paddingVertical: Spacing.three },
  mediaHintTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  mediaHintSub: { fontSize: 12.5 },
  input: {
    borderWidth: Rhythm.hairline,
    borderRadius: Radius.medium,
    padding: Spacing.three,
    fontSize: 15,
  },
  captionInput: { minHeight: 110, textAlignVertical: 'top', fontSize: 17, lineHeight: 25 },
  primaryBtn: {
    borderRadius: Radius.pill,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  primaryText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  finePrint: { textAlign: 'center', fontSize: 12, marginTop: Spacing.three },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.five },
  doneMark: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.four },
  doneGlyph: { fontSize: 30, fontWeight: '700' },
  doneTitle: { fontSize: 26, fontWeight: '600', marginBottom: Spacing.two, textAlign: 'center' },
  doneBody: { fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: Spacing.five, maxWidth: 320 },
});
