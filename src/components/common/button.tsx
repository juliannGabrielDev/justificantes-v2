import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Pressable, StyleSheet, View, type ViewProps } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { StyledText } from "@/components/common/styled-text";
import { useHaptics } from "@/hooks/use-haptics";
import {
	brand,
	radius,
	spacing,
	useThemeColors,
	type ThemeColors,
} from "@/use-theme";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "nothing";
export type ButtonSize = "default" | "super";

interface ButtonProps extends ViewProps {
	children: React.ReactNode;
	/** Tailwind/uniwind utilities for edge cases on the root */
	className?: string;
	/** Tailwind/uniwind utilities for edge cases on the animated surface */
	contentClassName?: string;
	variant?: ButtonVariant;
	size?: ButtonSize;
	disabled?: boolean;
	onPress?: () => void;
}

interface ButtonContextType {
	variant: ButtonVariant;
	size: ButtonSize;
	disabled: boolean;
	contentColor: string;
	spinnerColor: string;
}

const ButtonContext = createContext<ButtonContextType>({
	variant: "primary",
	size: "default",
	disabled: false,
	contentColor: "",
	spinnerColor: "",
});

function getVariantTokens(c: ThemeColors) {
	return {
		primary: {
			bg: brand.primary,
			content: c.onSurfaceLight,
			spinner: brand.secondary,
		},
		secondary: {
			bg: brand.secondary,
			content: c.onSurfaceDark,
			spinner: brand.tertiary,
		},
		tertiary: {
			bg: brand.tertiary,
			content: c.onSurfaceLight,
			spinner: brand.primary,
		},
		nothing: {
			bg: c.surfaceContainer,
			content: c.onSurface,
			spinner: c.onSurface,
		},
	} satisfies Record<
		ButtonVariant,
		{ bg: string; content: string; spinner: string }
	>;
}

const SIZE_CONFIG = {
	default: {
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.xl,
		paddingHorizontalWithIcon: [spacing.lg, spacing.xl],
		borderWidth: 2,
		borderRadius: radius["3xl"],
		gap: spacing.xs,
		text: {
			weight: "extraboldItalic",
			variant: "body",
			size: "lg",
		},
	},
	super: {
		paddingVertical: spacing.lg,
		paddingHorizontal: spacing["4xl"],
		paddingHorizontalWithIcon: [spacing["3xl"], spacing["4xl"]],
		borderWidth: 3,
		borderRadius: radius.full,
		gap: spacing.xs,
		text: {
			weight: "blackItalic",
			variant: "headline",
			size: "md",
		},
	},
} as const;

function ButtonIcon({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <View className={className}>{children}</View>;
}

function ButtonRoot({
	children,
	className,
	contentClassName,
	onPress,
	variant = "primary",
	size = "default",
	disabled = false,
	...props
}: ButtonProps) {
	const haptics = useHaptics();
	const { colors } = useThemeColors();
	const variantTokens = getVariantTokens(colors);
	const tokens = variantTokens[variant];
	const sizeConfig = SIZE_CONFIG[size];

	const hasIcon = React.Children.toArray(children).some(
		(child) => React.isValidElement(child) && child.type === ButtonIcon,
	);

	const surfaceStyle = useMemo(
		() =>
			StyleSheet.create({
				shadowBlock: {
					borderRadius: sizeConfig.borderRadius,
					backgroundColor: colors.shadow,
				},
				surface: {
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					gap: sizeConfig.gap,
					borderRadius: sizeConfig.borderRadius,
					borderWidth: sizeConfig.borderWidth,
					borderColor: colors.outline,
					backgroundColor: tokens.bg,
					paddingVertical: sizeConfig.paddingVertical,
					paddingLeft: hasIcon
						? sizeConfig.paddingHorizontalWithIcon[0]
						: sizeConfig.paddingHorizontal,
					paddingRight: sizeConfig.paddingHorizontalWithIcon[1],
				},
			}),
		[colors, tokens.bg, sizeConfig, hasIcon],
	);

	const offset = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: offset.get() - 4 }],
	}));

	const handlePressIn = () => {
		if (disabled) return;
		offset.set(withTiming(4, { duration: 100 }));
		haptics.light();
	};

	const handlePressOut = () => {
		if (disabled) return;
		offset.set(withTiming(0, { duration: 150 }));
	};

	const handlePress = () => {
		if (disabled || !onPress) return;
		onPress();
	};

	return (
		<ButtonContext.Provider
			value={{
				variant,
				size,
				disabled,
				contentColor: tokens.content,
				spinnerColor: tokens.spinner,
			}}
		>
			<Pressable
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={handlePress}
				disabled={disabled}
				className={className}
				{...props}
			>
				{/* Static shadow block behind the animated surface */}
				<View style={surfaceStyle.shadowBlock}>
					<Animated.View
						style={[
							surfaceStyle.surface,
							animatedStyle,
							disabled && { opacity: 0.5 },
						]}
						className={contentClassName}
					>
						{children}
					</Animated.View>
				</View>
			</Pressable>
		</ButtonContext.Provider>
	);
}

function ButtonText({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { contentColor, size } = useContext(ButtonContext);
	const textConfig = SIZE_CONFIG[size].text;

	return (
		<StyledText
			variant={textConfig.variant}
			size={textConfig.size}
			weight={textConfig.weight}
			color={contentColor}
			className={className}
		>
			{children}
		</StyledText>
	);
}

function ButtonSpinner({ size = 20 }: { size?: number }) {
	const { spinnerColor } = useContext(ButtonContext);
	const rotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withRepeat(
			withTiming(360, { duration: 1000, easing: Easing.linear }),
			-1,
		);
	}, [rotation]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}));

	return (
		<Animated.View style={animatedStyle}>
			<Svg width={size} height={size} viewBox="0 0 320 320" fill="none">
				<Path
					d="M174.94 84.95C197.48 -28.315 122.55 -28.315 145.08 84.95C122.55 -28.315 53.327 0.35202 117.49 96.38C53.327 0.35202 0.35202 53.33 96.38 117.49C0.35202 53.33 -28.315 122.55 84.95 145.07C-28.315 122.54 -28.315 197.46 84.95 174.93C-28.315 197.46 0.36602 266.67 96.38 202.51C0.36602 266.67 53.34 319.65 117.49 223.62C53.327 319.63 122.55 348.3 145.07 235.05C122.54 348.32 197.46 348.32 174.93 235.05C197.46 348.32 266.67 319.63 202.51 223.62C266.67 319.63 319.65 266.66 223.62 202.51C319.63 266.67 348.3 197.45 235.05 174.93C348.32 197.46 348.32 122.54 235.05 145.07C348.32 122.54 319.63 53.33 223.62 117.49C319.63 53.33 266.66 0.35202 202.51 96.38C266.67 0.36602 197.45 -28.302 174.93 84.95H174.94Z"
					fill={spinnerColor}
				/>
			</Svg>
		</Animated.View>
	);
}

export const Button = Object.assign(ButtonRoot, {
	Text: ButtonText,
	Icon: ButtonIcon,
	Spinner: ButtonSpinner,
});

export const useButtonContext = () => useContext(ButtonContext);
