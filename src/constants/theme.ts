/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * Editorial, calm palette for India Visual Discovery.
 * Warm paper backgrounds, warm ink text, one restrained accent (fired clay).
 * Both schemes stay low-contrast and whitespace-friendly.
 */
export const Colors = {
  light: {
    text: '#211C14',
    background: '#FAF7F0',
    backgroundElement: '#F1EAE0',
    backgroundSelected: '#E7DCCB',
    textSecondary: '#8A8072',
    accent: '#B4552A',
    accentSoft: '#F5E4D2',
    accentInk: '#FFFFFF',
    line: '#E7DDC9',
    card: '#FFFFFF',
  },
  dark: {
    text: '#F3EDE1',
    background: '#15120E',
    backgroundElement: '#221E17',
    backgroundSelected: '#2E2820',
    textSecondary: '#A79E8D',
    accent: '#D98A52',
    accentSoft: '#33241A',
    accentInk: '#15120E',
    line: '#2D2620',
    card: '#1E1A15',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/**
 * Section rhythm loosely inspired by the golden ratio: card gaps of 24,
 * section gaps of ~40 (24 * 1.618), generous page padding of 20.
 */
export const Rhythm = {
  page: 20,
  cardGap: 24,
  sectionGap: 40,
  hairline: 1,
} as const;

export const Radius = {
  small: 10,
  medium: 16,
  large: 24,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
