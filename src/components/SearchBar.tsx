import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

/** Mock search field — filters local mock data, nothing leaves the device. */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search places, ideas, people…',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: theme.card,
          borderColor: focused ? theme.accent : theme.line,
        },
      ]}>
      <ThemedText themeColor="textSecondary" style={styles.icon}>
        ⌕
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, { color: theme.text }]}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    gap: Spacing.two,
  },
  icon: { fontSize: 18 },
  input: { flex: 1, fontSize: 15 },
});
