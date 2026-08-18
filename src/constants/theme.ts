/**
 * Design token system - single source of truth for the app's visual language.
 *
 * Usage:
 *   import { colors, fonts } from '@/constants/theme';
 *   // Then consume them via the useThemeColors() / useStyles() hooks.
 */

export const brand = {
	primary: '#00f0ff',
	secondary: '#7000ff',
	tertiary: '#fed639',
	tertiary100: '#fff0c7',
	tertiary800: '#554500',
	success: '#55db9c',
	pending: '#fed639',
	danger: '#ff6b6b',
} as const;

export const light = {
	// static (same in both schemes)
	onSurfaceLight: '#1c3335', // seafoam-800
	onSurfaceDark: '#f0f9f9', // seafoam-100

	surfaceFieldFocus: brand.tertiary100,
	divider: '#dbeef0', // seafoam-200

	surfaceDim: '#ffffff',
	surface: '#f0f9f9', // seafoam-100
	surfaceBright: '#ffffff',

	surfaceContainerLow: '#ffffff',
	inverseSurfaceContainerLow: '#0c1a1a', // seafoam-950
	surfaceContainer: '#ffffff',
	surfaceContainerHover: '#f0f9f9', // seafoam-100
	inverseSurfaceContainer: '#1c3335', // seafoam-800
	surfaceContainerHigh: '#f7fcfc', // seafoam-50
	surfaceContainerHighHover: '#f0f9f9', // seafoam-100
	inverseSurfaceContainerHigh: '#102223', // seafoam-900
	surfaceContainerHighest: '#dbeef0', // seafoam-200

	onSurface: '#1c3335', // seafoam-800
	inverseOnSurface: '#f0f9f9', // seafoam-100
	onSurfaceVariant: '#476466', // seafoam-600

	outline: '#0c1a1a', // seafoam-950 (borders)
	outlineVariant: '#94b5b7', // seafoam-400
	shadow: '#344f51', // seafoam-700
	dot: 'rgba(0, 0, 0, 0.3)',
} as const;

export const dark = {
	// static (same in both schemes)
	onSurfaceLight: '#1c3335', // seafoam-800
	onSurfaceDark: '#f0f9f9', // seafoam-100

	surfaceFieldFocus: brand.tertiary800,
	divider: '#1c3335', // seafoam-800

	surfaceDim: '#0c1a1a', // seafoam-950
	surface: '#102223', // seafoam-900
	surfaceBright: '#102223', // seafoam-900

	surfaceContainerLow: '#0c1a1a', // seafoam-950
	inverseSurfaceContainerLow: '#ffffff',
	surfaceContainer: '#1c3335', // seafoam-800
	surfaceContainerHover: '#102223', // seafoam-900
	inverseSurfaceContainer: '#ffffff',
	surfaceContainerHigh: '#102223', // seafoam-900
	surfaceContainerHighHover: '#1c3335', // seafoam-800
	inverseSurfaceContainerHigh: '#f7fcfc', // seafoam-50
	surfaceContainerHighest: '#1c3335', // seafoam-800

	onSurface: '#f0f9f9', // seafoam-100
	inverseOnSurface: '#1c3335', // seafoam-800
	onSurfaceVariant: '#c9e2e3', // seafoam-300

	outline: '#f0f9f9', // seafoam-50
	outlineVariant: '#638688', // seafoam-500
	shadow: '#c9e2e3', // seafoam-300
	dot: 'rgba(255, 255, 255, 0.15)',
} as const;

export interface ThemeColors {
	onSurfaceLight: string;
	onSurfaceDark: string;
	surfaceFieldFocus: string;
	divider: string;
	surfaceDim: string;
	surface: string;
	surfaceBright: string;
	surfaceContainerLow: string;
	inverseSurfaceContainerLow: string;
	surfaceContainer: string;
	surfaceContainerHover: string;
	inverseSurfaceContainer: string;
	surfaceContainerHigh: string;
	surfaceContainerHighHover: string;
	inverseSurfaceContainerHigh: string;
	surfaceContainerHighest: string;
	onSurface: string;
	inverseOnSurface: string;
	onSurfaceVariant: string;
	outline: string;
	outlineVariant: string;
	shadow: string;
	dot: string;
}

export const colors: { light: ThemeColors; dark: ThemeColors } = {
	light,
	dark,
};

export const fonts = {
	displayBold: 'Alan-Sans-Bold',
	displayExtrabold: 'Alan-Sans-ExtraBold',
	displayBlack: 'Alan-Sans-Black',

	regular: 'Inter-Regular',
	regularItalic: 'Inter-Regular-Italic',
	medium: 'Inter-Medium',
	mediumItalic: 'Inter-Medium-Italic',
	semibold: 'Inter-SemiBold',
	semiboldItalic: 'Inter-SemiBold-Italic',
	bold: 'Inter-Bold',
	boldItalic: 'Inter-Bold-Italic',
	extrabold: 'Inter-ExtraBold',
	extraboldItalic: 'Inter-ExtraBold-Italic',
	black: 'Inter-Black',
	blackItalic: 'Inter-Black-Italic',
} as const;

export type FontKeys = keyof typeof fonts;

// Spacing and size scale (padding, margin, gap, etc)
export const spacing = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	'2xl': 24,
	'3xl': 28,
	'4xl': 32,
	'5xl': 36,
	'6xl': 40,
	'7xl': 44,
	'8xl': 48,
} as const;

export const radius = {
	xl: 12,
	'2xl': 16,
	'3xl': 24,
	'4xl': 32,
	full: 99999,
} as const;

export const fontSizes = {
	display: {
		lg: { fontSize: 57, lineHeight: 64 },
		md: { fontSize: 45, lineHeight: 52 },
		sm: { fontSize: 36, lineHeight: 44 },
	},
	headline: {
		lg: { fontSize: 32, lineHeight: 40 },
		md: { fontSize: 28, lineHeight: 36 },
		sm: { fontSize: 24, lineHeight: 32 },
	},
	title: {
		lg: { fontSize: 22, lineHeight: 28 },
		md: { fontSize: 16, lineHeight: 24 },
		sm: { fontSize: 14, lineHeight: 20 },
	},
	body: {
		lg: { fontSize: 16, lineHeight: 24 },
		md: { fontSize: 14, lineHeight: 20 },
		sm: { fontSize: 12, lineHeight: 16 },
	},
	label: {
		lg: { fontSize: 14, lineHeight: 20 },
		md: { fontSize: 12, lineHeight: 16 },
		sm: { fontSize: 11, lineHeight: 16 },
	},
} as const;

export type FontSizeKey = keyof typeof fontSizes;
