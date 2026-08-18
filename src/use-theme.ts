/**
 * Style Factory Pattern — hooks for memoized, theme-aware StyleSheet styles.
 *
 * Why this approach?
 *   StyleSheet.create() compiles style objects only once, and useMemo guarantees
 *   the factory only re-runs when the color scheme actually changes, not on every
 *   render. This eliminates style recalculations and avoids bridge serialization
 *   overhead on each component re-render.
 *
 * Usage example:
 *   function createStyles(c: ThemeColors) {
 *     return StyleSheet.create({
 *       container: { flex: 1, backgroundColor: c.background },
 *       title:     { color: c.foreground, fontFamily: fonts.displayBold },
 *     })
 *   }
 *   const styles = useStyles(createStyles);
 */

import type { ThemeColors } from '@/constants/theme';
import { brand, colors, fontSizes, fonts, radius, spacing } from '@/constants/theme';
import { useMemo } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

// === 1. Color primitive hook

/**
 * Returns the semantic color tokens resolved for the current color scheme,
 * plus a convenience `isDark` flag.
 */
export function useThemeColors(): { colors: ThemeColors; isDark: boolean } {
	const scheme = useColorScheme(); // 'light' | 'dark' | null (null = not determined yet)
	const isDark = scheme === 'dark';
	return {
		isDark,
		colors: isDark ? colors.dark : colors.light,
	};
}

// === 2. Style factory hook

type StyleFactory<T extends StyleSheet.NamedStyles<T>> = (
	themeColors: ThemeColors,
) => T;

/**
 * Takes a style factory function and returns a memoized StyleSheet object.
 *
 * The factory receives the current theme's color tokens so you never write
 * hardcoded hex values in components. Styles are only recalculated when the
 * color scheme changes (isDark toggle), not on every render.
 *
 * @param styleFactory  Pure function: (colors) => StyleSheet.create({ … })
 */
export function useStyles<T extends StyleSheet.NamedStyles<T>>(
	styleFactory: StyleFactory<T>,
): T {
	const { colors: themeColors, isDark } = useThemeColors();

	return useMemo(
		() => styleFactory(themeColors),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isDark], // themeColors reference changes with isDark; we only track isDark
	);
}

// Re-export tokens so components can import everything from a single place
export { brand, colors, fontSizes, fonts, radius, spacing };
export type { ThemeColors };

