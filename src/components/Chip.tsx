import { Pressable, StyleSheet, Text } from 'react-native';

import { Radius, Rhythm, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Rounded interest / filter pill. */
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: selected ? theme.text : theme.backgroundElement,
          borderColor: selected ? theme.text : theme.line,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <Text
        style={[
          styles.label,
          { color: selected ? theme.background : theme.textSecondary },
          selected && { fontWeight: '700' },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: Rhythm.hairline,
    marginRight: Spacing.two,
  },
  label: { fontSize: 13, fontWeight: '500', letterSpacing: 0.2 },
});
