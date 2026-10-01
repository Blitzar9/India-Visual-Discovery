import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** Deterministic muted background for an avatar, derived from a seed string. */
export function seedColor(seed: string, theme: { accentSoft: string; backgroundElement: string }): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  const tones = [theme.accentSoft, theme.backgroundElement, '#E9DCC8', '#DCE3D5', '#E5D5D0'];
  return tones[h % tones.length];
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({
  name,
  seed,
  size = 40,
}: {
  name: string;
  seed: string;
  size?: number;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: seedColor(seed, theme),
        },
      ]}>
      <Text style={[styles.text, { color: theme.text, fontSize: size * 0.36 }]}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  text: { fontWeight: '700', letterSpacing: 0.5 },
});
