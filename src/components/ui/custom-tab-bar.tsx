import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

import { StyledText } from "@/components/common/styled-text";
import { useHaptics } from "@/hooks/use-haptics";
import {
	radius,
	spacing,
	useStyles,
	useThemeColors,
	type ThemeColors,
} from "@/use-theme";

const ICON_WRAPPER_SIZE = 22;
const LABEL_MAX_WIDTH = 96;

type ColorToken = keyof ThemeColors | (string & {});

function resolveColor(value: ColorToken, c: ThemeColors): string {
	return value in c ? c[value as keyof ThemeColors] : value;
}

interface TabItemProps {
	label: string;
	isFocused: boolean;
	onPress: () => void;
	onLongPress: () => void;
	color: string;
	Icon: React.ComponentType<{ size: number; color: string }>;
	/** Text + active icon color on the pill, defaults to 'onSurface' */
	contentColor?: ColorToken;
	/** Inactive icon color, defaults to 'onSurface' */
	inactiveColor?: ColorToken;
}

function createStyles(c: ThemeColors) {
	return StyleSheet.create({
		pressable: {
			borderRadius: radius.full,
		},
		itemContainer: {
			flexDirection: "row",
			alignItems: "center",
			overflow: "hidden",
			borderRadius: radius.full,
			paddingVertical: spacing.sm,
			paddingLeft: spacing.sm,
		},
		pill: {
			position: "absolute",
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			borderRadius: radius.full,
		},
		contentRow: {
			zIndex: 10,
			flexDirection: "row",
			alignItems: "center",
			gap: spacing.xs,
		},
		iconWrapper: {
			width: ICON_WRAPPER_SIZE,
			height: ICON_WRAPPER_SIZE,
			alignItems: "center",
			justifyContent: "center",
		},
		icon: {
			position: "absolute",
		},
		tabBar: {
			position: "absolute",
			right: 0,
			bottom: spacing["4xl"],
			left: 0,
			alignItems: "center",
			justifyContent: "center",
		},
		tabBarContainer: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing.sm,
			padding: spacing.sm,
			borderRadius: radius.full,
			borderWidth: 2,
			borderColor: c.outline,
			backgroundColor: c.surfaceContainer,
		},
	});
}

export function TabItem({
	label,
	isFocused,
	onPress,
	onLongPress,
	color,
	Icon,
	contentColor = "onSurfaceLight",
	inactiveColor = "onSurface",
}: TabItemProps) {
	const styles = useStyles(createStyles);
	const { colors } = useThemeColors();
	const resolvedContentColor = resolveColor(contentColor, colors);
	const resolvedInactiveColor = resolveColor(inactiveColor, colors);
	const activeProgress = useSharedValue(0);

	useEffect(() => {
		// Speed tuned spring physics for snappy, instant response
		activeProgress.value = withSpring(isFocused ? 1 : 0, {
			damping: 20,
			stiffness: 300,
			mass: 0.5,
		});
	}, [isFocused, activeProgress]);

	const containerStyle = useAnimatedStyle(() => {
		const paddingRight = 8 + activeProgress.value * 4;
		const scale = 1 + activeProgress.value * 0.04;

		return {
			paddingRight,
			transform: [{ scale }],
		};
	});

	const pillStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: color,
			opacity: activeProgress.value,
			transform: [
				{ scaleX: activeProgress.value },
				{ scaleY: activeProgress.value },
			],
		};
	});

	const activeIconStyle = useAnimatedStyle(() => ({
		opacity: activeProgress.value,
		transform: [{ scale: activeProgress.value }],
	}));

	const inactiveIconStyle = useAnimatedStyle(() => ({
		opacity: 1 - activeProgress.value,
		transform: [{ scale: 1 - activeProgress.value * 0.1 }],
	}));

	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			accessibilityRole="button"
			accessibilityState={isFocused ? { selected: true } : {}}
			style={styles.pressable}
		>
			<Animated.View
				layout={LinearTransition.duration(120)}
				style={[styles.itemContainer, containerStyle]}
			>
				{/* Active Pill Background scaling from center */}
				<Animated.View style={[styles.pill, pillStyle]} />

				{/* Content layer above the background */}
				<View style={styles.contentRow}>
					{/* Cross-fading icon wrapper */}
					<View style={styles.iconWrapper}>
						<Animated.View style={[styles.icon, inactiveIconStyle]}>
							<Icon size={20} color={resolvedInactiveColor} />
						</Animated.View>
						<Animated.View style={[styles.icon, activeIconStyle]}>
							<Icon size={20} color={resolvedContentColor} />
						</Animated.View>
					</View>

					{isFocused && (
						<StyledText
							variant="label"
							size="sm"
							weight="boldItalic"
							uppercase
							truncate
							color={resolvedContentColor}
							entering={FadeIn.duration(120)}
							exiting={FadeOut.duration(80)}
							style={{ maxWidth: LABEL_MAX_WIDTH }}
						>
							{label}
						</StyledText>
					)}
				</View>
			</Animated.View>
		</Pressable>
	);
}

export interface TabConfig {
	label: string;
	/** Pill background color */
	color: string;
	Icon: React.ComponentType<{ size: number; color: string }>;
	/** Text + active icon color on the pill, defaults to 'onSurface' */
	contentColor?: ColorToken;
	/** Inactive icon color, defaults to 'onSurface' */
	inactiveColor?: ColorToken;
}

interface CustomTabBarProps {
	state: any;
	navigation: any;
	config: Record<string, TabConfig>;
}

/**
 * Recommended: 2-4 tabs. Labels truncate when they don't fit,
 * but beyond 4 tabs the pills get too crowded.
 */
export default function CustomTabBar({
	state,
	navigation,
	config,
}: CustomTabBarProps) {
	const styles = useStyles(createStyles);
	const haptics = useHaptics();

	return (
		<View style={styles.tabBar} pointerEvents="box-none">
			{/* bar container */}
			<Animated.View
				layout={LinearTransition.duration(120)}
				style={styles.tabBarContainer}
				className="shadow-brutalist-md"
			>
				{state.routes.map((route: any, index: number) => {
					const isFocused = state.index === index;

					const onPress = () => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
							canPreventDefault: true,
						});

						haptics.light();

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name, route.params);
						}
					};

					const onLongPress = () => {
						navigation.emit({
							type: "tabLongPress",
							target: route.key,
						});
					};

					const tabConfig = config[route.name];
					if (!tabConfig) return null;

					return (
						<TabItem
							key={route.key}
							label={tabConfig.label}
							isFocused={isFocused}
							onPress={onPress}
							onLongPress={onLongPress}
							color={tabConfig.color}
							Icon={tabConfig.Icon}
							contentColor={tabConfig.contentColor}
							inactiveColor={tabConfig.inactiveColor}
						/>
					);
				})}
			</Animated.View>
		</View>
	);
}
