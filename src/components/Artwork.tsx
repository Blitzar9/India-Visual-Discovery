import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';

/**
 * Deterministic generative cover art for mock posts/places/collections.
 * Abstract landscape compositions (sky, sun, horizon) drawn with plain
 * Views — no image assets, no network. The seed picks a curated duo so
 * every card feels intentional, not random.
 *
 * Subtle asymmetry: the sun sits off-centre and the horizon band follows
 * a ~1:1.618 division.
 */
const DUOS: [string, string, string][] = [
  ['#EFC98A', '#B4552A', '#7A3A1C'], // ochre / clay
  ['#A9BC9B', '#3E4A3D', '#2A332A'], // moss
  ['#9DB4D4', '#2E4A6B', '#1E3247'], // indigo
  ['#DFA3A8', '#7A3B3B', '#552828'], // rose
  ['#93C4BB', '#2A5A54', '#1D403B'], // teal
  ['#E5B85C', '#8A5A1D', '#5F3E13'], // marigold
];

function hashSeed(seed: string): number {
  let h = 7;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 100003;
  return h;
}

export function Artwork({
  seed,
  aspectRatio = 1.618,
  radius = Radius.large,
  style,
}: {
  seed: string;
  aspectRatio?: number;
  radius?: number;
  style?: object;
}) {
  const h = hashSeed(seed);
  const [sky, land, deep] = DUOS[h % DUOS.length];
  // Deterministic offsets for gentle variation between cards.
  const sunLeft = 12 + (h % 41); // 12–52%
  const sunSize = 22 + (h % 14); // 22–35% of width
  const horizonAt = 58 + (h % 9); // 58–66% from top

  return (
    <View style={[styles.base, { backgroundColor: sky, aspectRatio, borderRadius: radius }, style]}>
      {/* sun, deliberately off-centre */}
      <View
        style={{
          position: 'absolute',
          left: `${sunLeft}%`,
          top: '14%',
          width: `${sunSize}%`,
          aspectRatio: 1,
          borderRadius: 999,
          backgroundColor: '#FFF8EA',
          opacity: 0.9,
        }}
      />
      {/* soft halo */}
      <View
        style={{
          position: 'absolute',
          left: `${sunLeft - 6}%`,
          top: '6%',
          width: `${sunSize + 12}%`,
          aspectRatio: 1,
          borderRadius: 999,
          backgroundColor: '#FFF8EA',
          opacity: 0.25,
        }}
      />
      {/* horizon band */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${horizonAt}%`,
          bottom: 0,
          backgroundColor: land,
          borderBottomLeftRadius: radius,
          borderBottomRightRadius: radius,
        }}
      />
      {/* foreground strip */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${horizonAt + 12}%`,
          bottom: 0,
          backgroundColor: deep,
          opacity: 0.55,
          borderBottomLeftRadius: radius,
          borderBottomRightRadius: radius,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden', width: '100%' },
});
