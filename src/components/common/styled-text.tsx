import { forwardRef, useMemo } from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import Animated, { type AnimatedProps } from 'react-native-reanimated';

import {
	fontSizes,
	fonts,
	type FontKeys,
	type FontSizeKey,
	type ThemeColors,
} from '@/constants/theme';
import { useThemeColors } from '@/use-theme';

export type TextVariant = FontSizeKey;
export type TextSize = 'lg' | 'md' | 'sm';
export type TextFamily = 'sans' | 'display';

export type StyledTextProps = AnimatedProps<TextProps> & {
	/** Typography scale: display | headline | title | body | label */
	variant?: TextVariant;
	/** Scale step, defaults to 'md' */
	size?: TextSize;
	/**
	 * Font group: 'sans' (Inter) or 'display' (Alan Sans).
	 * Defaults to 'sans'.
	 */
	family?: TextFamily;
	/** Font weight key from the theme (fonts), defaults to 'regular' */
	weight?: FontKeys;
	/** Semantic theme color key or any raw color, defaults to 'onSurface' */
	color?: keyof ThemeColors | (string & {});
	align?: TextStyle['textAlign'];
	/** Uppercase text transform */
	uppercase?: boolean;
	/** Single line (true) or specific number of lines with ellipsis */
	truncate?: boolean | number;
	/** Tailwind/uniwind utilities for edge cases */
	className?: string;
};

const DISPLAY_WEIGHTS: Record<'bold' | 'extrabold' | 'black', string> = {
	bold: fonts.displayBold,
	extrabold: fonts.displayExtrabold,
	black: fonts.displayBlack,
};

function resolveFontFamily(
	family: TextFamily,
	weight: FontKeys,
): string {
	if (family === 'display') {
		return (
			DISPLAY_WEIGHTS[weight as 'bold' | 'extrabold' | 'black'] ??
			fonts[weight]
		);
	}
	return fonts[weight];
}

export const StyledText = forwardRef<Text, StyledTextProps>(function StyledText(
	{
		variant = 'body',
		size = 'md',
		family,
		weight = 'regular',
		color = 'onSurface',
		align,
		uppercase = false,
		truncate = false,
		className,
		style,
		...rest
	},
	ref,
) {
	const { colors } = useThemeColors();

	const resolvedFamily: TextFamily = family ?? 'sans';

	const resolvedColor =
		color in colors ? colors[color as keyof ThemeColors] : color;

	const textStyle = useMemo(
		() =>
			StyleSheet.create({
				text: {
					fontSize: fontSizes[variant][size].fontSize,
					lineHeight: fontSizes[variant][size].lineHeight,
					fontFamily: resolveFontFamily(resolvedFamily, weight),
					color: resolvedColor,
					textAlign: align,
					textTransform: uppercase ? 'uppercase' : undefined,
				},
			}),
		[variant, size, resolvedFamily, weight, resolvedColor, align, uppercase],
	);

	const numberOfLines =
		typeof truncate === 'number'
			? truncate
			: truncate
				? 1
				: rest.numberOfLines;

	const ellipsizeMode =
		truncate || rest.numberOfLines
			? (rest.ellipsizeMode ?? 'tail')
			: rest.ellipsizeMode;

	return (
		<Animated.Text
			ref={ref}
			className={className}
			numberOfLines={numberOfLines}
			ellipsizeMode={ellipsizeMode}
			style={[textStyle.text, style]}
			{...rest}
		/>
	);
});
